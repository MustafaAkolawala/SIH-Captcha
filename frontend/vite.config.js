import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8081,
    proxy: {
      "/api": "http://localhost:6500",
    },
    watch: {
      usePolling: true,
    },
  },
  plugins: [react()],
})
