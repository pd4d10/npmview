import React, { useEffect, useState, useCallback, FC, useRef } from 'react'
import path from 'path'
import {
  Tree,
  ITreeNode,
  Divider,
  Navbar,
  NavbarGroup,
  NavbarDivider,
  Dialog,
  Classes,
  Spinner,
  Toaster,
  Intent,
} from '@blueprintjs/core'
import numeral from 'numeral'
import useReactRouter from 'use-react-router'
import {
  getRepositoryUrl,
  PackageMetaDirectory,
  PackageMetaItem,
  fetchMeta,
  fetchPackageJson,
  fetchCode,
} from './utils'
import { Preview } from './preview'
import { Entry } from './entry'
import { Center } from './center'

const HEADER_HEIGHT = 40

export const Package: FC = () => {
  const { params } = useReactRouter<{ name: string; scope?: string }>().match

  let [fullName, version] = params.name.split('@')
  if (params.scope) {
    fullName = params.scope + '/' + fullName
  }

  const toastRef = useRef<Toaster>(null)
  const [loadingMeta, setLoadingMeta] = useState(false)
  const [meta, setMeta] = useState<PackageMetaDirectory>()
  const [packageJson, setPackageJson] = useState()
  const [expandedMap, setExpandedMap] = useState<{ [key: string]: boolean }>({})
  const [selected, setSelected] = useState()
  const [loadingCode, setLoadingCode] = useState(false)
  const [code, setCode] = useState<string>()
  const [ext, setExt] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        setSelected(undefined)
        setCode(undefined)
        setLoadingMeta(true)
        const _packageJson = await fetchPackageJson(
          version ? `${fullName}@${version}` : fullName,
        )
        setPackageJson(_packageJson)
        setMeta(await fetchMeta(`${fullName}@${_packageJson.version}`))
      } catch (err) {
        console.error(err)
        if (toastRef.current) {
          toastRef.current.show({
            message: err.message,
            intent: Intent.DANGER,
          })
        }
      } finally {
        setLoadingMeta(false)
      }
    }
    init()
  }, [fullName, version])

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
      if (!node.nodeData) return

      switch (node.nodeData.type) {
        case 'directory':
          setSelected(node.id)
          setExpandedMap(old => ({ ...old, [node.id]: !old[node.id] }))
          break
        case 'file':
          if (selected === node.id) return

          setSelected(node.id)
          try {
            setLoadingCode(true)
            setCode(
              await fetchCode(
                `${fullName}@${packageJson.version}`,
                node.id as string,
              ),
            )
            setExt(
              path
                .extname(node.id.toString())
                .slice(1)
                .toLowerCase(),
            )
          } catch (err) {
            console.error(err)
            if (toastRef.current) {
              toastRef.current.show({
                message: err.message,
                intent: Intent.DANGER,
              })
            }
          } finally {
            setLoadingCode(false)
          }
          break
      }
    },
    [fullName, packageJson, selected],
  )

  if (loadingMeta) {
    return (
      <Center style={{ height: '100vh' }}>
        <Spinner />
      </Center>
    )
  }

  if (!meta) return null

  const files = convertMetaToTreeNode(meta).childNodes
  if (!files) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* FIXME: Type */}
      <Toaster ref={toastRef as any} />
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
          {loadingCode ? (
            <Center style={{ height: '100%' }}>
              <Spinner />
            </Center>
          ) : (
            <Preview code={code} ext={ext} />
          )}
        </div>
      </div>
    </div>
  )
}
