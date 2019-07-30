import React, { useEffect, useState } from 'react'
import path from 'path'
import { Tree, ITreeNode } from '@blueprintjs/core'
import numeral from 'numeral'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { RouteComponentProps } from 'react-router'

interface PackageMetaFile {
  path: string
  type: 'file'
  contentType: 'text/markdown' | 'application/javascript'
  integrity: string
  lastModified: string
  size: number
}

interface PackageMetaDirectory {
  path: string
  type: 'directory'
  files: (PackageMetaFile | PackageMetaDirectory)[]
}

export const Package: React.FC<RouteComponentProps<{ name: string }>> = ({
  match,
}) => {
  const { name } = match.params
  const [data, setData] = useState<PackageMetaDirectory>()
  const [packageJson, setPackageJson] = useState()
  const [expandedMap, setExpandedMap] = useState<{ [key: string]: boolean }>({})
  const [code, setCode] = useState('')

  useEffect(() => {
    ;(async () => {
      const r0 = await fetch(`https://unpkg.com/${name}/package.json`)
      const _packageJson = await r0.json()
      setPackageJson(_packageJson)
      const r1 = await fetch(
        `https://unpkg.com/${name}@${_packageJson.version}/?meta`,
      )
      setData(await r1.json())
    })()
  }, [name])

  if (!data) return null

  const convertMetaToTreeNode = (
    file: PackageMetaFile | PackageMetaDirectory,
  ): ITreeNode => {
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
          icon: 'folder-close',
          label: path.basename(file.path),
          childNodes: file.files.map(convertMetaToTreeNode),
          isExpanded: !!expandedMap[file.path],
        }
      case 'file':
        return {
          id: file.path,
          icon: 'document',
          label: path.basename(file.path),
          secondaryLabel: numeral(file.size).format('0.00b'),
        }
    }
  }

  const files = convertMetaToTreeNode(data).childNodes

  if (!files) return null

  const handleClick = async (node: ITreeNode) => {
    if (node.icon === 'folder-close') {
      setExpandedMap(old => ({ ...old, [node.id]: !old[node.id] }))
    } else {
      const res = await fetch(
        `https://unpkg.com/${name}@${packageJson.version}${node.id}`,
      )
      setCode(await res.text())
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ flexBasis: 20, flexShrink: 0 }}>
        {name} {packageJson.description}
      </div>
      <div
        style={{ flexGrow: 1, display: 'flex', height: 'calc(100vh - 20px)' }}
      >
        <div style={{ flexBasis: 300, flexShrink: 0, overflow: 'auto' }}>
          <Tree
            contents={files}
            onNodeClick={handleClick}
            onNodeExpand={handleClick}
            onNodeCollapse={handleClick}
          />
        </div>
        <div style={{ flexGrow: 1, overflow: 'auto' }}>
          <SyntaxHighlighter language="javascript" style={docco}>
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  )
}
