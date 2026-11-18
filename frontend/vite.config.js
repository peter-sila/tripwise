import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['tripwise-ete0.onrender.com'],
  },
  preview: {
    allowedHosts: ['tripwise-ete0.onrender.com'],
  },
})
