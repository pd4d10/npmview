import React, { FC } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import * as hljs from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { Center } from './center'
import { Icon, Classes } from '@blueprintjs/core'

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
  if (code == null) {
    return (
      <Center style={{ height: '100%' }} className={Classes.TEXT_LARGE}>
        <Icon icon="arrow-left" style={{ paddingRight: 10 }} />
        Select a file to view
      </Center>
    )
  }

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
