import React, { FC } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import ReactMarkdown from 'react-markdown'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'

export const Preview: FC<{ code: string; ext: string }> = ({ code, ext }) => {
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
