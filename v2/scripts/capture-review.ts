import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium, type Page } from '@playwright/test'

const baseUrl = process.env.V2_PREVIEW_URL ?? 'http://127.0.0.1:4174'
const outputRoot = join(process.cwd(), 'artifacts', 'design-review')

async function open(page: Page, route: string, theme: string): Promise<void> {
  await page.goto(`${baseUrl}${route}?v2theme=${theme}`, { waitUntil: 'domcontentloaded' })
  await page.locator('h1').waitFor()
}

await mkdir(outputRoot, { recursive: true })
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light' })
const page = await context.newPage()

try {
  await open(page, '/', 'polar-sage')
  await page.screenshot({ path: join(outputRoot, '01-integrated-home-light.png'), fullPage: true })
  await open(page, '/', 'graphite-spectral')
  await page.screenshot({ path: join(outputRoot, '02-integrated-home-dark.png'), fullPage: true })

  await open(page, '/observatory', 'mineral-blue')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.getByLabel('Identity', { exact: true }).selectOption('identity-procurement')
  await page.getByRole('button', { name: 'Run evidence path' }).click()
  await page.locator('[data-testid="observatory-answer"]').scrollIntoViewIfNeeded()
  await page.screenshot({ path: join(outputRoot, '03-observatory-light-supported.png') })

  await open(page, '/observatory', 'night-instrument')
  await page.locator('.observatory-space').scrollIntoViewIfNeeded()
  await page.screenshot({ path: join(outputRoot, '04-observatory-dark-map.png') })

  await open(page, '/os', 'warm-paper')
  await page.getByLabel('Identity').selectOption('identity-procurement')
  await page.locator('.os-answer-grid').scrollIntoViewIfNeeded()
  await page.screenshot({ path: join(outputRoot, '05-institutional-os-light.png') })

  await open(page, '/os', 'deep-cobalt')
  await page.locator('.os-command').scrollIntoViewIfNeeded()
  await page.screenshot({ path: join(outputRoot, '06-institutional-os-dark.png') })

  await open(page, '/archive', 'parchment-olive')
  await page.screenshot({ path: join(outputRoot, '07-living-archive-light.png'), fullPage: true })

  await open(page, '/archive', 'bronze-night')
  await page.getByText('General Employee', { exact: true }).click()
  await page.locator('.archive-answer').scrollIntoViewIfNeeded()
  await page.screenshot({ path: join(outputRoot, '08-living-archive-dark-restricted.png') })

  const mobile = await browser.newContext({ viewport: { width: 393, height: 851 }, colorScheme: 'light', hasTouch: true, isMobile: true })
  const mobilePage = await mobile.newPage()
  await open(mobilePage, '/', 'soft-cyan')
  await mobilePage.screenshot({ path: join(outputRoot, '09-integrated-home-mobile.png'), fullPage: true })
  await open(mobilePage, '/os', 'soft-cyan')
  await mobilePage.locator('.os-answer-grid').scrollIntoViewIfNeeded()
  await mobilePage.screenshot({ path: join(outputRoot, '10-institutional-os-mobile.png') })
  await open(mobilePage, '/archive', 'quiet-clay')
  await mobilePage.screenshot({ path: join(outputRoot, '11-living-archive-mobile.png'), fullPage: true })
  await mobile.close()

  console.log(`Captured 11 review frames in ${outputRoot}`)
} finally {
  await page.close()
  await context.close()
  await browser.close()
}
