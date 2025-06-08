import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ["a117-2a0a-ef40-1051-4a01-7df8-41d9-d9d8-1c23.ngrok-free.app"]
  }
})
