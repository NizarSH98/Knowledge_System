import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

const SECTIONS = [
  '#top',
  '#problem',
  '#how-it-works',
  '#outcomes',
  '#engagement',
  '#principles',
  '#fit',
  '#founder',
  '#assessment',
]

const collectErrors = (page: Page): string[] => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(String(err)))
  return errors
}

const IGNORED = [/SwiftShader/i, /GPU stall/i, /Automatic fallback/i, /WebGL warning/i]
const realErrors = (errors: string[]) => errors.filter((e) => !IGNORED.some((rx) => rx.test(e)))

test.describe('structure and content', () => {
  test('all sections, nav, and footer render without console errors', async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto('/')
    await page.waitForTimeout(2500)

    for (const sel of SECTIONS) {
      await expect(page.locator(sel)).toBeAttached()
    }
    await expect(page.locator('header.nav')).toBeVisible()
    await expect(page.locator('footer.footer')).toBeAttached()
    await expect(page.locator('h1')).toContainText('Your company already contains the answers')
    expect(realErrors(errors)).toEqual([])
  })

  test('primary CTA is a correctly encoded mailto', async ({ page }) => {
    await page.goto('/')
    const href = await page.locator('.hero-actions a.btn-primary').getAttribute('href')
    expect(href).toContain('mailto:jabernizar98@gmail.com')
    expect(href).toContain(encodeURIComponent('Knowledge Systems Assessment Enquiry'))
  })

  test('client brief is exposed as a downloadable PDF', async ({ page }) => {
    await page.goto('/?nowebgl')
    const brief = page.locator('.btn-brief')
    await expect(brief).toBeVisible()
    await expect(brief).toHaveAttribute('download', 'Knowledge-Systems-Client-Brief.pdf')
    await expect(brief).toHaveAttribute('href', './knowledge-systems-client-brief.pdf')

    const response = await page.request.get('/knowledge-systems-client-brief.pdf')
    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toContain('application/pdf')
    expect((await response.body()).byteLength).toBeGreaterThan(60_000)
  })

  test('engagement phases stay distinct and read-only-first is explicit', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.phase')).toHaveCount(4)
    await expect(page.locator('.phase--current')).toContainText('Knowledge Assessment')
    await expect(page.locator('#engagement')).toContainText('Read-only. No autonomous changes')
  })
})

test.describe('viewports and overflow', () => {
  for (const vp of [
    { w: 1440, h: 900 },
    { w: 1280, h: 720 },
    { w: 768, h: 1024 },
    { w: 390, h: 844 },
  ]) {
    test(`no horizontal overflow at ${vp.w}×${vp.h}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.w, height: vp.h })
      await page.goto('/')
      await page.waitForTimeout(1500)
      for (const y of [0, 0.25, 0.5, 0.75, 1]) {
        await page.evaluate((frac) => {
          window.scrollTo(0, (document.documentElement.scrollHeight - window.innerHeight) * frac)
        }, y)
        await page.waitForTimeout(350)
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        expect(overflow, `overflow at scroll ${y}`).toBeLessThanOrEqual(1)
      }
    })
  }
})

test.describe('accessibility and modes', () => {
  test('light is the default theme and the dark alternative persists', async ({ page }) => {
    await page.goto('/?nowebgl')
    await page.evaluate(() => localStorage.removeItem('ks-theme'))
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await expect(page.locator('.theme-toggle').first()).toContainText('dark')

    await page.locator('.theme-toggle').first().click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    await page.goto('/?nowebgl&theme=light')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  })

  test('keyboard: tab reaches skip link, nav, and the final CTA', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    await expect(page.locator('.skip-link')).toBeFocused()

    let foundFinal = false
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press('Tab')
      const inFinal = await page.evaluate(
        () => document.activeElement?.closest('#assessment') !== null,
      )
      if (inFinal) {
        foundFinal = true
        break
      }
    }
    expect(foundFinal).toBe(true)
  })

  test('reduced motion: stacked chapters, content fully visible', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.waitForTimeout(1200)
    await expect(page.locator('html')).toHaveClass(/reduced-motion/)
    await expect(page.locator('.inside-stacked')).toBeAttached()
    await expect(page.locator('.inside-stage')).toHaveCount(0)
    const chapterCount = await page.locator('.inside-stacked .inside-chapter').count()
    expect(chapterCount).toBe(6)
    await expect(page.locator('.hero-actions a.btn-primary')).toBeVisible()
  })

  test('WebGL fallback: page fully usable without canvas', async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto('/?nowebgl')
    await page.waitForTimeout(1200)
    await expect(page.locator('html')).toHaveClass(/no-webgl/)
    await expect(page.locator('canvas')).toHaveCount(0)
    await expect(page.locator('.static-lattice')).toBeVisible()
    for (const sel of SECTIONS) {
      await expect(page.locator(sel)).toBeAttached()
    }
    await expect(page.locator('.inside-stacked')).toBeAttached()
    expect(realErrors(errors)).toEqual([])
  })

  test('fast scroll through the pinned sequence does not break the page', async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto('/')
    await page.waitForTimeout(2000)
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
      await page.waitForTimeout(400)
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForTimeout(400)
    }
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await page.waitForTimeout(800)
    await expect(page.locator('#assessment .btn-primary')).toBeVisible()
    expect(realErrors(errors)).toEqual([])
  })

  test('anchor navigation works', async ({ page }) => {
    await page.goto('/')
    await page.locator('.nav-links a[href="#engagement"]').click()
    await page.waitForTimeout(1500)
    const inView = await page.evaluate(() => {
      const el = document.querySelector('#engagement')
      if (!el) return false
      const r = el.getBoundingClientRect()
      return r.top < window.innerHeight && r.bottom > 0
    })
    expect(inView).toBe(true)
  })
})

test.describe('screenshots', () => {
  const shots = [
    { name: 'hero', frac: 0 },
    { name: 'problem', frac: 0.08 },
    { name: 'mask', frac: 0.14 },
    { name: 'inside-pinned', frac: 0.35 },
    { name: 'inside-late', frac: 0.52 },
    { name: 'outcomes', frac: 0.66 },
    { name: 'engagement', frac: 0.74 },
    { name: 'principles', frac: 0.8 },
    { name: 'fit', frac: 0.86 },
    { name: 'final', frac: 0.97 },
    { name: 'footer', frac: 1 },
  ]
  for (const vp of [
    { label: 'desktop-1440', w: 1440, h: 900 },
    { label: 'mobile-390', w: 390, h: 844 },
  ]) {
    test(`capture ${vp.label}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.w, height: vp.h })
      await page.goto('/')
      await page.waitForTimeout(2500)
      for (const s of shots) {
        await page.evaluate((frac) => {
          window.scrollTo(0, (document.documentElement.scrollHeight - window.innerHeight) * frac)
        }, s.frac)
        await page.waitForTimeout(900)
        await page.screenshot({ path: `artifacts/screenshots/${vp.label}-${s.name}.png` })
      }
    })
  }
})
