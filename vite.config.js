import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-caixa': {
        target: 'https://servicebus2.caixa.gov.br',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api-caixa/, '/portaldeloterias/api'),
      },
    },
  },
})
