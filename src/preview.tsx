import React, { FC } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import ReactMarkdown from 'react-markdown'
import * as hljs from 'react-syntax-highlighter/dist/esm/styles/hljs'

const languageMap: { [key: string]: string } = {
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  ts: 'typescript',
  '': 'plaintext',
}

export const Preview: FC<{ code: string; ext: string }> = ({ code, ext }) => {
  if (!code) return null

  switch (ext) {
    case 'md':
    case 'markdown':
      return <ReactMarkdown source={code} className="markdown-body" />
    default:
      const language = languageMap[ext] || ext
      return (
        <SyntaxHighlighter
          language={language}
          showLineNumbers
          style={hljs.github}
        >
          {code}
        </SyntaxHighlighter>
      )
  }
}
