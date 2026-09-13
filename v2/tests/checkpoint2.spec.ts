import { expect, test } from '@playwright/test'
import { themes } from '../src/themes/palettes.ts'

const routes = ['/', '/observatory', '/os', '/archive', '/compare'] as const

for (const route of routes) {
  test(`${route} loads without console errors`, async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text())
    })
    await page.goto(`${route}?v2renderer=static`, { waitUntil: 'domcontentloaded' })
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('h1')).toBeVisible()
    expect(consoleErrors).toEqual([])
  })
}

test('chooser presents three genuinely distinct concepts', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { name: 'Three ways to understand organizational knowledge.' })).toBeVisible()
  await expect(page.getByRole('article')).toHaveCount(3)
  await expect(page.getByText('Trace an answer through evidence in space.')).toBeVisible()
  await expect(page.getByText('Operate an answer workspace and inspect every claim.')).toBeVisible()
  await expect(page.getByText('Gather records into a visibly footnoted case.')).toBeVisible()
})

test('route navigation and palette state work without reload', async ({ page }) => {
  await page.goto('/?test=route&v2renderer=static', { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => {
    ;(window as Window & { __v2RouteSentinel?: string }).__v2RouteSentinel = 'preserved'
  })
  await page.getByRole('link', { name: /Enter direction/ }).first().click()
  await expect(page).toHaveURL(/\/observatory/)
  expect(await page.evaluate(() => (window as Window & { __v2RouteSentinel?: string }).__v2RouteSentinel)).toBe('preserved')
  await page.getByLabel('Instrument finish').selectOption('polar-instrument')
  await expect(page).toHaveURL(/v2theme=polar-instrument/)
  await expect(page.locator('html')).toHaveAttribute('data-v2-theme', 'polar-instrument')
  await expect(page.locator('html')).toHaveCSS('--color-bg', '#EDF1EE')
  await page.reload()
  await expect(page.getByLabel('Instrument finish')).toHaveValue('polar-instrument')
})

test('shared retrieval behavior changes with identity and refuses unsupported questions', async ({ page }) => {
  await page.goto('/os?v2renderer=static', { waitUntil: 'domcontentloaded' })
  const status = page.getByTestId('query-status')
  await expect(status).toHaveText('insufficient permissions')

  await page.getByLabel('Identity').selectOption('identity-operations')
  await expect(status).toHaveText('partially supported')

  await page.getByLabel('Identity').selectOption('identity-procurement')
  await expect(status).toHaveText('supported')
  await expect(page.locator('.claim-list > li')).toHaveCount(4)

  await page.getByRole('button', { name: 'Try the unsupported question' }).click()
  await expect(status).toHaveText('unsupported')
  await expect(page.getByText(/do not support an answer/)).toBeVisible()
})

test('forced static mode retains the structured renderer equivalent', async ({ page }) => {
  await page.goto('/archive?v2renderer=static', { waitUntil: 'domcontentloaded' })
  await expect(page.getByTestId('backend-status')).toHaveText('Static · DOM/SVG')
  await expect(page.getByRole('list', { name: 'Equivalent structured retrieval representation' })).toBeVisible()
  await expect(page.locator('canvas')).toHaveCount(0)
})

test('reduced motion selects the reduced tier', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/os?v2renderer=webgl', { waitUntil: 'domcontentloaded' })
  await expect(page.getByText('reduced', { exact: true })).toBeVisible()
  await expect(page.getByText('Reduced', { exact: true })).toBeVisible()
})

test('mobile chooser and direction page do not overflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile project only')
  for (const route of ['/', '/observatory?v2renderer=static']) {
    await page.goto(route, { waitUntil: 'domcontentloaded' })
    const widths = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth }))
    expect(widths.document).toBeLessThanOrEqual(widths.viewport)
  }
})

test('WebGL renderer initializes when the browser exposes WebGL 2', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'desktop project only')
  const consoleErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })

  await page.goto('/os?v2renderer=webgl&v2quality=reduced', { waitUntil: 'domcontentloaded' })
  const status = page.getByTestId('backend-status')
  await expect(status).toHaveText(/WebGL 2 · Three\.js backend|Static · DOM\/SVG/, { timeout: 15_000 })
  await expect.poll(async () => {
    const label = await status.textContent()
    const canvasCount = await page.locator('canvas').count()
    return label?.startsWith('WebGL') ? canvasCount === 1 : label === 'Static · DOM/SVG' && canvasCount === 0
  }).toBe(true)
  expect(consoleErrors).toEqual([])
})

test('all twelve palettes update DOM and live renderer theme state', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'desktop project only')
  const routeByDirection = {
    observatory: '/observatory',
    'institutional-os': '/os',
    'living-archive': '/archive',
  } as const

  for (const [direction, route] of Object.entries(routeByDirection)) {
    await page.goto(`${route}?v2renderer=webgl&v2quality=reduced`, { waitUntil: 'domcontentloaded' })
    const directionThemes = themes.filter((theme) => theme.directionId === direction)
    for (const theme of directionThemes) {
      if (direction === 'observatory') {
        await page.getByLabel('Instrument finish').selectOption(theme.id)
      } else {
        await page.getByLabel(theme.name).check()
      }
      await expect(page.locator('html')).toHaveAttribute('data-v2-theme', theme.id)
      await expect(page.locator('html')).toHaveCSS('--color-bg', theme.colors.background)
      if (direction !== 'observatory') {
        const backend = await page.getByTestId('backend-status').textContent()
        if (backend?.startsWith('WebGL')) {
          await expect(page.locator('canvas')).toHaveAttribute('data-v2-theme', theme.id)
        }
      }
    }
  }
})
