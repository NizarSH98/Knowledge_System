import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const vite = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url))
const playwright = fileURLToPath(new URL('../node_modules/@playwright/test/cli.js', import.meta.url))
const previewUrl = 'http://127.0.0.1:4173'

const preview = spawn(
  process.execPath,
  [vite, 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'],
  { cwd: root, stdio: 'inherit' },
)

const stopPreview = () => {
  if (!preview.killed) preview.kill()
}

process.once('SIGINT', () => {
  stopPreview()
  process.exit(130)
})
process.once('SIGTERM', () => {
  stopPreview()
  process.exit(143)
})

try {
  let ready = false
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (preview.exitCode !== null) throw new Error('Preview server exited before becoming ready.')
    try {
      const response = await fetch(previewUrl)
      if (response.ok) {
        ready = true
        break
      }
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  if (!ready) throw new Error(`Preview server did not become ready at ${previewUrl}.`)

  const tests = spawn(process.execPath, [playwright, 'test', ...process.argv.slice(2)], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, PW_SKIP_WEBSERVER: '1' },
  })
  const exitCode = await new Promise((resolve) => tests.once('exit', resolve))
  process.exitCode = typeof exitCode === 'number' ? exitCode : 1
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
} finally {
  stopPreview()
}
