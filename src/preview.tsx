import React, { FC } from 'react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import githubStyle from 'react-syntax-highlighter/dist/esm/styles/hljs/github'
import { Icon, Classes } from '@blueprintjs/core'
import langJs from 'highlight.js/lib/languages/javascript'
import langCss from 'highlight.js/lib/languages/css'
import langScss from 'highlight.js/lib/languages/scss'
import langTs from 'highlight.js/lib/languages/typescript'
import langJson from 'highlight.js/lib/languages/json'
import langMd from 'highlight.js/lib/languages/markdown'
import langTxt from 'highlight.js/lib/languages/plaintext'
import { centerStyles, HEADER_HEIGHT } from './utils'

SyntaxHighlighter.registerLanguage('js', langJs)
SyntaxHighlighter.registerLanguage('css', langCss)
SyntaxHighlighter.registerLanguage('scss', langScss)
SyntaxHighlighter.registerLanguage('ts', langTs)
SyntaxHighlighter.registerLanguage('json', langJson)
SyntaxHighlighter.registerLanguage('md', langMd)
SyntaxHighlighter.registerLanguage('txt', langTxt)

const languageMap: { [key: string]: string } = {
  jsx: 'js',
  mjs: 'js',
  tsx: 'ts',
  '': 'txt',
}

export const Preview: FC<{ code?: string; ext: string }> = ({ code, ext }) => {
  if (code == null) {
    return (
      <div
        style={{ ...centerStyles, height: '100%' }}
        className={Classes.TEXT_LARGE}
      >
        <Icon icon="arrow-left" style={{ paddingRight: 10 }} />
        Select a file to view
      </div>
    )
  }

  const language = languageMap[ext] || ext
  return (
    <SyntaxHighlighter
      language={language}
      showLineNumbers
      style={githubStyle}
      lineProps={{
        style: {
          float: 'left',
          paddingRight: 10,
          userSelect: 'none',
          color: 'rgba(27,31,35,.3)',
        },
      }}
      customStyle={{
        marginTop: 5,
        marginBottom: 5,
        maxHeight: `calc(100vh - ${HEADER_HEIGHT + 10}px)`,
      }}
    >
      {code}
    </SyntaxHighlighter>
  )
}
