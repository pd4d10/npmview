import React, { FC } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import * as hljs from 'react-syntax-highlighter/dist/esm/styles/hljs'

const languageMap: { [key: string]: string } = {
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  ts: 'typescript',
  md: 'markdown',
  markdown: 'markdown',
  '': 'plaintext',
}

export const Preview: FC<{ code?: string; ext: string }> = ({ code, ext }) => {
  if (code == null) return null

  const language = languageMap[ext] || ext
  return (
    <SyntaxHighlighter
      language={language}
      showLineNumbers
      style={hljs.github}
      lineNumberContainerStyle={{
        float: 'left',
        paddingRight: 10,
        userSelect: 'none',
        color: 'rgba(27,31,35,.3)',
      }}
    >
      {code}
    </SyntaxHighlighter>
  )
}
