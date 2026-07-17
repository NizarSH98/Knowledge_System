import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' keeps every asset reference relative, so the same build works
// from a GitHub Pages project subdirectory (/repo-name/) or a custom domain.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1200,
  },
})
