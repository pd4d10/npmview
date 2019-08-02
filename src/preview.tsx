import React, { FC } from 'react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import * as styles from 'react-syntax-highlighter/dist/esm/styles/hljs'
import * as languages from 'react-syntax-highlighter/dist/esm/languages/hljs'
import { Center } from './center'
import { Icon, Classes } from '@blueprintjs/core'

SyntaxHighlighter.registerLanguage('js', languages.javascript)
SyntaxHighlighter.registerLanguage('css', languages.css)
SyntaxHighlighter.registerLanguage('scss', languages.scss)
SyntaxHighlighter.registerLanguage('ts', languages.typescript)
SyntaxHighlighter.registerLanguage('json', languages.json)
SyntaxHighlighter.registerLanguage('md', languages.markdown)
SyntaxHighlighter.registerLanguage('txt', languages.plaintext)

const languageMap: { [key: string]: string } = {
  jsx: 'js',
  mjs: 'js',
  tsx: 'ts',
  '': 'txt',
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
      style={styles.github}
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
