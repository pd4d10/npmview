import React, { useEffect, useState, useCallback, FC } from 'react'
import path from 'path'
import {
  Tree,
  ITreeNode,
  Divider,
  Navbar,
  NavbarGroup,
  NavbarDivider,
  Button,
  Dialog,
  Classes,
} from '@blueprintjs/core'
import numeral from 'numeral'
import useReactRouter from 'use-react-router'
import { getRepositoryUrl } from './utils'
import { Preview } from './preview'
import { Entry } from './entry'

interface PackageMetaFile {
  path: string
  type: 'file'
  contentType: string
  integrity: string
  lastModified: string
  size: number
}

interface PackageMetaDirectory {
  path: string
  type: 'directory'
  files: PackageMetaItem[]
}

type PackageMetaItem = PackageMetaFile | PackageMetaDirectory

const HEADER_HEIGHT = 40

export const Package: FC = () => {
  const { match } = useReactRouter<{ name: string; scope?: string }>()
  let fullName = match.params.name
  if (match.params.scope) {
    fullName = match.params.scope + '/' + fullName
  }

  const [data, setData] = useState<PackageMetaDirectory>()
  const [packageJson, setPackageJson] = useState()
  const [expandedMap, setExpandedMap] = useState<{ [key: string]: boolean }>({})
  const [selected, setSelected] = useState()
  const [code, setCode] = useState('')
  const [ext, setExt] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    ;(async () => {
      const r0 = await fetch(`https://unpkg.com/${fullName}/package.json`)
      const _packageJson = await r0.json()
      setPackageJson(_packageJson)
      const r1 = await fetch(
        `https://unpkg.com/${fullName}@${_packageJson.version}/?meta`,
      )
      setData((await r1.json()) as PackageMetaDirectory)
    })()
  }, [fullName])

  const convertMetaToTreeNode = (
    file: PackageMetaItem,
  ): ITreeNode<PackageMetaItem> => {
    switch (file.type) {
      case 'directory':
        file.files.sort((a, b) => {
          // Directory first
          if (a.type === 'directory' && b.type === 'file') {
            return -1
          } else if (a.type === 'file' && b.type === 'directory') {
            return 1
          } else {
            // Then sorted by first char
            return (
              path.basename(a.path).charCodeAt(0) -
              path.basename(b.path).charCodeAt(0)
            )
          }
        })
        return {
          id: file.path,
          nodeData: file,
          icon: 'folder-close',
          label: path.basename(file.path),
          childNodes: file.files.map(convertMetaToTreeNode),
          isExpanded: !!expandedMap[file.path],
          isSelected: selected === file.path,
        }
      case 'file':
        return {
          id: file.path,
          nodeData: file,
          icon: 'document',
          label: path.basename(file.path),
          secondaryLabel: numeral(file.size).format('0.00b'),
          isSelected: selected === file.path,
        }
    }
  }

  const handleClick = useCallback(
    async (node: ITreeNode<PackageMetaItem>) => {
      setSelected(node.id)

      if (!node.nodeData) return

      switch (node.nodeData.type) {
        case 'directory':
          setExpandedMap(old => ({ ...old, [node.id]: !old[node.id] }))
          break
        case 'file':
          const res = await fetch(
            `https://unpkg.com/${fullName}@${packageJson.version}${node.id}`,
          )
          setCode(await res.text())
          setExt(
            path
              .extname(node.id.toString())
              .slice(1)
              .toLowerCase(),
          )
          break
      }
    },
    [fullName, packageJson],
  )

  if (!data) return null

  const files = convertMetaToTreeNode(data).childNodes
  if (!files) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Navbar style={{ height: HEADER_HEIGHT }}>
        <NavbarGroup style={{ height: HEADER_HEIGHT }}>
          <div>
            {packageJson.name}@{packageJson.version}
          </div>

          <Dialog
            isOpen={dialogOpen}
            title="Select package"
            icon="info-sign"
            onClose={() => {
              setDialogOpen(false)
            }}
          >
            <div className={Classes.DIALOG_BODY}>
              <Entry
                afterChange={() => {
                  setDialogOpen(false)
                }}
              />
            </div>
          </Dialog>

          <NavbarDivider />
          <a
            href={`https://www.npmjs.com/package/${packageJson.name}/v/${
              packageJson.version
            }`}
          >
            npm
          </a>

          {packageJson.homepage && (
            <>
              <NavbarDivider />
              <a href={packageJson.homepage}>homepage</a>
            </>
          )}

          {packageJson.repository && (
            <>
              <NavbarDivider />
              <a href={getRepositoryUrl(packageJson.repository)}>repository</a>
            </>
          )}

          {packageJson.license && (
            <>
              <NavbarDivider />
              <div>{packageJson.license}</div>
            </>
          )}

          {packageJson.description && (
            <>
              <NavbarDivider />
              <div>{packageJson.description}</div>
            </>
          )}
        </NavbarGroup>
        <NavbarGroup align="right" style={{ height: HEADER_HEIGHT }}>
          <a
            href="#"
            onClick={e => {
              e.preventDefault()
              setDialogOpen(true)
            }}
          >
            view another package
          </a>
          <NavbarDivider />
          <a href="https://github.com/pd4d10/npmview">source code</a>
        </NavbarGroup>
      </Navbar>
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        <div
          style={{
            flexBasis: 300,
            flexShrink: 0,
            overflow: 'auto',
            paddingTop: 5,
          }}
        >
          <Tree
            contents={files}
            onNodeClick={handleClick}
            onNodeExpand={handleClick}
            onNodeCollapse={handleClick}
          />
        </div>
        <Divider />
        <div style={{ flexGrow: 1, overflow: 'auto' }}>
          <Preview code={code} ext={ext} />
        </div>
      </div>
    </div>
  )
}
