import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api-fleet': {
        target: 'https://task1-nsaic.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-fleet/, '')
      }
    }
  }
})

