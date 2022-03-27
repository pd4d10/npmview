// @ts-check
import { defineConfig } from '@norm/cli'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  projects: {
    '.': {
      type: 'web-app',
      overrides: {
        resolve: {
          alias: {
            path: 'path-browserify',
          },
        },
        define: {
          'process.env': '{}',
        },
        plugins: [react(), svgr()],
      },
    },
  },
})
