import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
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
  plugins: [reactRefresh(), svgr()],
})
