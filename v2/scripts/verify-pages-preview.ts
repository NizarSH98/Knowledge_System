import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const origin = process.env.V2_PREVIEW_ORIGIN ?? 'http://127.0.0.1:4175'
const publicBase = '/Knowledge_System'
const routes = ['/', '/observatory/', '/os/', '/archive/', '/compare/'] as const
const outputDirectory = join(process.cwd(), 'artifacts', 'deployment-preview')
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
const consoleErrors: string[] = []

page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push(message.text())
})

try {
  await mkdir(outputDirectory, { recursive: true })

  for (const route of routes) {
    const response = await page.goto(`${origin}${publicBase}${route}`, { waitUntil: 'domcontentloaded' })
    if (response?.status() !== 200) throw new Error(`${route} returned ${response?.status() ?? 'no response'}`)
    await page.locator('main').waitFor()
    await page.locator('h1').waitFor()
    const routeName = route === '/' ? 'chooser' : route.replaceAll('/', '')
    await page.screenshot({ path: join(outputDirectory, `route-${routeName}.png`) })
    console.log(`200 ${publicBase}${route}`)
  }

  await page.goto(`${origin}${publicBase}/`, { waitUntil: 'domcontentloaded' })
  await page.screenshot({ path: join(outputDirectory, '01-chooser.png') })
  await page.evaluate(() => {
    ;(window as Window & { __deploymentSentinel?: string }).__deploymentSentinel = 'preserved'
  })
  await page.getByRole('link', { name: 'Open Knowledge Observatory' }).click()

  if (new URL(page.url()).pathname !== `${publicBase}/observatory`) {
    throw new Error(`Client navigation lost the repository prefix: ${page.url()}`)
  }
  const sentinel = await page.evaluate(() => (window as Window & { __deploymentSentinel?: string }).__deploymentSentinel)
  if (sentinel !== 'preserved') throw new Error('Client navigation reloaded the document.')

  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { name: 'Observe how an answer becomes knowable.' }).waitFor()
  await page.screenshot({ path: join(outputDirectory, '02-observatory-direct-reload.png') })

  if (consoleErrors.length > 0) throw new Error(`Browser console errors:\n${consoleErrors.join('\n')}`)
  console.log('Repository prefix preserved; direct Observatory reload passed; no console errors.')
  console.log(`Screenshots: ${outputDirectory}`)
} finally {
  await page.close()
  await browser.close()
}
