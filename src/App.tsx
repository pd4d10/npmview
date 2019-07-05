import React, { useEffect, useState } from 'react'
import path from 'path'
import { Tree, ITreeNode } from '@blueprintjs/core'
import numeral from 'numeral'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import './App.css'

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

const App: React.FC = () => {
  const [data, setData] = useState<PackageMetaDirectory>()
  const [expandedMap, setExpandedMap] = useState<{ [key: string]: boolean }>({})
  const [code, setCode] = useState('')

  useEffect(() => {
    ;(async () => {
      const res = await fetch('https://unpkg.com/express@4.17.1/?meta')
      const json = await res.json()
      setData(json)
    })()
  }, [])

  if (!data) return null

  const convertMetaToTreeNode = (
    file: PackageMetaFile | PackageMetaDirectory,
  ): ITreeNode => {
    switch (file.type) {
      case 'directory':
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
      const res = await fetch(`https://unpkg.com/express@4.17.1${node.id}`)
      const text = await res.text()
      setCode(text)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flexBasis: 300, overflow: 'auto' }}>
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
  )
}

export default App
