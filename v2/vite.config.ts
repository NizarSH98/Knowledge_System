import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => ({
  base: command === 'build' && mode !== 'test' ? '/Knowledge_System/v2/' : '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    port: 4174,
    strictPort: true,
  },
  preview: {
    port: 4175,
    strictPort: true,
  },
}))
