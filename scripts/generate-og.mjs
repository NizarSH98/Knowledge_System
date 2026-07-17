import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.goto('file://' + join(here, 'og-image.html'))
await page.waitForTimeout(300)
await page.screenshot({ path: join(here, '..', 'public', 'og-image.png') })
await browser.close()
console.log('og-image.png written to public/')
