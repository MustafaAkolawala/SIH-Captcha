import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  server: {
    host: true,
    port: 8081,
    proxy: {
      "/api": "http://localhost:6500",
    },
    watch: {
      usePolling: true,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

