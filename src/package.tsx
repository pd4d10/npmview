import React, { useEffect, useState, useCallback } from 'react'
import path from 'path'
import { Tree, ITreeNode, Divider } from '@blueprintjs/core'
import numeral from 'numeral'
import SyntaxHighlighter from 'react-syntax-highlighter'
import ReactMarkdown from 'react-markdown'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { RouteComponentProps } from 'react-router'

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

export const Package: React.FC<RouteComponentProps<{ name: string }>> = ({
  match,
}) => {
  const { name } = match.params
  const [data, setData] = useState<PackageMetaDirectory>()
  const [packageJson, setPackageJson] = useState()
  const [expandedMap, setExpandedMap] = useState<{ [key: string]: boolean }>({})
  const [selected, setSelected] = useState()
  const [code, setCode] = useState('')
  const [ext, setExt] = useState('')

  useEffect(() => {
    ;(async () => {
      const r0 = await fetch(`https://unpkg.com/${name}/package.json`)
      const _packageJson = await r0.json()
      setPackageJson(_packageJson)
      const r1 = await fetch(
        `https://unpkg.com/${name}@${_packageJson.version}/?meta`,
      )
      setData((await r1.json()) as PackageMetaDirectory)
    })()
  }, [name])

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
            `https://unpkg.com/${name}@${packageJson.version}${node.id}`,
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
    [name, packageJson],
  )

  const preview = () => {
    if (!code) return null

    switch (ext) {
      case 'md':
      case 'markdown':
        return <ReactMarkdown source={code} className="markdown-body" />
      case '':
        return <pre>{code}</pre>
      default:
        // js, ts, json
        return (
          <SyntaxHighlighter language={ext} style={docco}>
            {code}
          </SyntaxHighlighter>
        )
    }
  }

  if (!data) return null

  const files = convertMetaToTreeNode(data).childNodes
  if (!files) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ flexBasis: 20, flexShrink: 0 }}>
        {name} {packageJson.description}
      </div>
      <Divider />
      <div
        style={{ flexGrow: 1, display: 'flex', height: 'calc(100vh - 31px)' }}
      >
        <div style={{ flexBasis: 300, flexShrink: 0, overflow: 'auto' }}>
          <Tree
            contents={files}
            onNodeClick={handleClick}
            onNodeExpand={handleClick}
            onNodeCollapse={handleClick}
          />
        </div>
        <Divider />
        <div style={{ flexGrow: 1, overflow: 'auto', padding: 20 }}>
          {preview()}
        </div>
      </div>
    </div>
  )
}
