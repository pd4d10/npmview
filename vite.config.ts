import { UserConfig } from 'vite'

const config: UserConfig = {
  jsx: 'react',
  plugins: [require('vite-plugin-react')],
  alias: {
    path: 'path-browserify',
  },
  optimizeDeps: {
    include: [
      'react-syntax-highlighter/dist/esm/styles/hljs/github',
      'highlight.js/lib/languages/javascript',
      'highlight.js/lib/languages/css',
      'highlight.js/lib/languages/scss',
      'highlight.js/lib/languages/typescript',
      'highlight.js/lib/languages/json',
      'highlight.js/lib/languages/markdown',
      'highlight.js/lib/languages/plaintext',
    ],
  },
}

export default config
