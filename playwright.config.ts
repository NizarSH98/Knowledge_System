import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  outputDir: './artifacts/test-results',
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    launchOptions: {
      // Headless Chromium needs software WebGL for the lattice
      args: ['--enable-unsafe-swiftshader'],
    },
  },
  webServer: process.env.PW_SKIP_WEBSERVER ? undefined : {
    // Invoke Vite directly so the test runner is not dependent on the host
    // shell's npm shim policy (notably Windows PowerShell execution policy).
    command: 'node ./node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 30_000,
  },
})
