import React, { useEffect, useState } from 'react'
import { Tree, ITreeNode } from '@blueprintjs/core'
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

function convertMetaToTreeNode(
  file: PackageMetaFile | PackageMetaDirectory,
): ITreeNode {
  switch (file.type) {
    case 'directory':
      return {
        id: file.path,
        icon: 'folder-close',
        label: file.path,
        childNodes: file.files.map(convertMetaToTreeNode),
        isExpanded: true,
      }
    case 'file':
      return {
        id: file.path,
        icon: 'document',
        label: file.path,
      }
  }
}

const App: React.FC = () => {
  const [data, setData] = useState<ITreeNode>()

  useEffect(() => {
    ;(async () => {
      const res = await fetch('https://unpkg.com/express@4.17.1/?meta')
      const json = await res.json()
      const node = convertMetaToTreeNode(json as PackageMetaDirectory)
      setData(node)
    })()
  }, [])

  return (
    <div>{data && data.childNodes && <Tree contents={data.childNodes} />}</div>
  )
}

export default App
