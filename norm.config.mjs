// @ts-check
import { defineConfig } from '@norm/cli'
import react from '@vitejs/plugin-react'

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
        plugins: [react()],
      },
    },
  },
})
