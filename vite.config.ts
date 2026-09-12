import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.GITHUB_PAGES_BASE || './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 46217,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 46217,
    strictPort: true,
  },
})
