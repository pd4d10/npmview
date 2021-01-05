import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

export default defineConfig({
  alias: {
    path: 'path-browserify',
  },
  plugins: [reactRefresh],
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
})
