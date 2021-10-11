import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  resolve: {
    alias: {
      path: 'path-browserify',
    },
  },
  define: {
    'process.env': '{}',
  },
  plugins: [react(), svgr()],
})
