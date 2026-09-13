import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium, type Page } from '@playwright/test'

const baseUrl = process.env.V2_PREVIEW_URL ?? 'http://127.0.0.1:4174'
const themes = ['night-instrument', 'deep-cobalt', 'polar-instrument', 'graphite-spectral'] as const
const outputRoot = join(process.cwd(), 'artifacts', 'observatory')

async function open(page: Page, theme: string) {
  await page.goto(`${baseUrl}/v2/observatory?v2theme=${theme}`, { waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { name: 'Observe how an answer becomes knowable.' }).waitFor()
}

async function frame(page: Page, selector: string, output: string) {
  const target = page.locator(selector).first()
  await target.scrollIntoViewIfNeeded()
  await page.evaluate(() => window.scrollBy({ top: -24, behavior: 'instant' }))
  await page.screenshot({ path: output })
}

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'dark' })

try {
  for (const theme of themes) {
    const themeOutput = join(outputRoot, theme)
    await mkdir(themeOutput, { recursive: true })
    const page = await context.newPage()

    await open(page, theme)
    await frame(page, '.observatory-space', join(themeOutput, '01-initial-organization.png'))

    await page.getByLabel('Identity', { exact: true }).selectOption('identity-procurement')
    await page.getByRole('button', { name: 'Run evidence path' }).click()
    await page.waitForTimeout(850)
    await frame(page, '.observatory-space', join(themeOutput, '02-query-running.png'))

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.getByRole('button', { name: 'Run evidence path' }).click()
    await page.locator('.citation-links button').first().click()
    await frame(page, '.observatory-workbench', join(themeOutput, '03-evidence-selected.png'))

    await page.getByLabel('Identity', { exact: true }).selectOption('identity-general')
    await frame(page, '.observatory-space', join(themeOutput, '04-restricted-state.png'))

    await page.getByLabel('Identity', { exact: true }).selectOption('identity-procurement')
    await page.locator('.version-rail button').first().click()
    await frame(page, '.version-observatory', join(themeOutput, '05-version-history.png'))

    await page.getByRole('button', { name: 'Run evidence path' }).click()
    await frame(page, '[data-testid="observatory-answer"]', join(themeOutput, '06-answer-resolved.png'))

    await page.close()
  }

  const mobileOutput = join(outputRoot, 'mobile-polar')
  await mkdir(mobileOutput, { recursive: true })
  const mobileContext = await browser.newContext({
    viewport: { width: 393, height: 851 },
    colorScheme: 'light',
    hasTouch: true,
    isMobile: true,
  })
  const mobilePage = await mobileContext.newPage()
  await open(mobilePage, 'polar-instrument')
  await frame(mobilePage, '.observatory-space', join(mobileOutput, '01-organization.png'))
  await mobilePage.emulateMedia({ reducedMotion: 'reduce' })
  await mobilePage.getByLabel('Identity', { exact: true }).selectOption('identity-procurement')
  await mobilePage.getByRole('button', { name: 'Run evidence path' }).click()
  await frame(mobilePage, '[data-testid="observatory-answer"]', join(mobileOutput, '02-answer-resolved.png'))
  await mobileContext.close()
} finally {
  await context.close()
  await browser.close()
}

console.log(`Captured ${themes.length * 6} palette states plus 2 mobile review states in ${outputRoot}`)
