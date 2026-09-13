import { copyFile, mkdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const outputDirectory = join(process.cwd(), 'dist')
const sourceHtml = join(outputDirectory, 'index.html')
const routeDirectories = ['observatory', 'os', 'archive', 'compare'] as const
const html = await readFile(sourceHtml, 'utf8')

if (!html.includes('/Knowledge_System/assets/')) {
  throw new Error('Production HTML is not using the expected /Knowledge_System/ asset base.')
}

await Promise.all(routeDirectories.map(async (route) => {
  const directory = join(outputDirectory, route)
  await mkdir(directory, { recursive: true })
  await copyFile(sourceHtml, join(directory, 'index.html'))
}))

console.log(`Prepared GitHub Pages entries: /, ${routeDirectories.map((route) => `/${route}/`).join(', ')}`)
