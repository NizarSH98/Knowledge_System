import { expect, test } from '@playwright/test'
import { themes } from '../src/themes/palettes.ts'

const routes = ['/', '/observatory', '/os', '/archive', '/compare'] as const

for (const route of routes) {
  test(`${route} loads without console errors`, async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text())
    })
    await page.goto(route, { waitUntil: 'domcontentloaded' })
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('h1')).toBeVisible()
    expect(consoleErrors).toEqual([])
  })
}

test('home combines three genuinely distinct experiences', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { name: 'Observe, operate, and remember what the organization knows.' })).toBeVisible()
  await expect(page.locator('.integrated-direction')).toHaveCount(3)
  await expect(page.getByText('See the organization around the answer.')).toBeVisible()
  await expect(page.getByText('Turn evidence into a dependable work surface.')).toBeVisible()
  await expect(page.getByText('Read the decision as an institutional record.')).toBeVisible()
})

test('route navigation and global palette state work without reload', async ({ page }) => {
  await page.goto('/?test=route', { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => { (window as Window & { __v2RouteSentinel?: string }).__v2RouteSentinel = 'preserved' })
  await page.getByRole('link', { name: /Open the Knowledge Observatory workspace/ }).click()
  await expect(page).toHaveURL(/\/observatory/)
  expect(await page.evaluate(() => (window as Window & { __v2RouteSentinel?: string }).__v2RouteSentinel)).toBe('preserved')
  await page.getByLabel('Color palette').selectOption('polar-sage')
  await expect(page).toHaveURL(/v2theme=polar-sage/)
  await expect(page.locator('html')).toHaveAttribute('data-v2-theme', 'polar-sage')
  await expect(page.locator('html')).toHaveCSS('--color-bg', '#EDF1EE')
  await page.reload()
  await expect(page.getByLabel('Color palette')).toHaveValue('polar-sage')
})

test('Institutional OS retrieval changes by identity and refuses unsupported questions', async ({ page }) => {
  await page.goto('/os', { waitUntil: 'domcontentloaded' })
  const status = page.getByTestId('query-status')
  await expect(status).toHaveText('Access-limited refusal')
  await page.getByLabel('Identity').selectOption('identity-operations')
  await expect(status).toHaveText('Partial answer')
  await page.getByLabel('Identity').selectOption('identity-procurement')
  await expect(status).toHaveText('Answer supported')
  await expect(page.locator('.os-claims > li')).toHaveCount(4)
  await page.getByRole('button', { name: 'Test an unsupported question' }).click()
  await expect(status).toHaveText('Unsupported question')
  await expect(page.getByText(/do not support an answer/)).toBeVisible()
})

test('Institutional OS exposes exclusions, source passages, and deterministic trace', async ({ page }) => {
  await page.goto('/os', { waitUntil: 'domcontentloaded' })
  await page.getByLabel('Identity').selectOption('identity-procurement')
  await expect(page.locator('.os-exclusions')).toContainText('superseded')
  await page.locator('.os-claims button').first().click()
  await expect(page.locator('.os-inspector blockquote')).toBeVisible()
  await expect(page.locator('.os-trace li')).not.toHaveCount(0)
  await expect(page.locator('.os-trace')).toContainText('No confidence score')
})

test('Living Archive exposes source folios and the complete version lineage', async ({ page }) => {
  await page.goto('/archive', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { name: 'Why Nova Industrial was selected for Project Atlas' })).toBeVisible()
  await expect(page.locator('.archive-folios > ol > li')).not.toHaveCount(0)
  await expect(page.locator('.archive-chronology li')).toHaveCount(3)
  await page.locator('.archive-folios > ol > li button').first().click()
  await expect(page.locator('.archive-folio__reading blockquote')).toBeVisible()
})

test('all shared light and dark palettes update every direction', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'desktop project only')
  for (const route of ['/observatory', '/os', '/archive']) {
    await page.goto(route, { waitUntil: 'domcontentloaded' })
    for (const theme of themes) {
      await page.getByLabel('Reading mode').selectOption(theme.mode)
      await page.getByLabel('Color palette').selectOption(theme.id)
      await expect(page.locator('html')).toHaveAttribute('data-v2-theme', theme.id)
      await expect(page.locator('html')).toHaveAttribute('data-v2-color-mode', theme.mode)
      await expect(page.locator('html')).toHaveCSS('--color-bg', theme.colors.background)
    }
  }
})

test('mobile pages remain within the document viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile project only')
  for (const route of routes) {
    await page.goto(route, { waitUntil: 'domcontentloaded' })
    const widths = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth }))
    expect(widths.document).toBeLessThanOrEqual(widths.viewport)
  }
})
