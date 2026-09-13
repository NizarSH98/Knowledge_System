import { expect, test } from '@playwright/test'

test.describe('Knowledge Observatory', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/v2/observatory?v2theme=night-instrument', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: 'Observe how an answer becomes knowable.' })).toBeVisible()
  })

  test('organization space is complete and semantically grouped', async ({ page }) => {
    await expect(page.locator('.space-node--department')).toHaveCount(7)
    await expect(page.locator('.space-node--repository')).toHaveCount(9)
    await expect(page.locator('.space-node--project')).toHaveCount(15)
    await expect(page.locator('.space-node--document')).toHaveCount(128)
    await page.getByRole('button', { name: /Project Atlas, project/ }).click()
    await expect(page.locator('.focus-readout')).toHaveClass(/is-open/)
    await expect(page.locator('.focus-readout').getByText('Project Atlas', { exact: true })).toBeVisible()
    await expect(page.locator('.lens-metrics')).toContainText('Repositories')
  })

  test('the three scales expose different entity grammars', async ({ page }) => {
    await page.getByRole('button', { name: /Relationship people/ }).click()
    await expect(page.getByRole('heading', { name: 'Project Atlas relationship field' })).toBeVisible()
    await expect(page.locator('.space-node--person')).not.toHaveCount(0)
    await expect(page.locator('.space-node--decision')).toHaveCount(1)

    await page.getByRole('button', { name: /Evidence documents/ }).click()
    await expect(page.getByRole('heading', { name: 'Atlas evidence field' })).toBeVisible()
    await expect(page.locator('.space-node--passage')).not.toHaveCount(0)
    await expect(page.locator('.space-node--superseded')).not.toHaveCount(0)
  })

  test('the SVG workload does not download the optional Three.js adapter', async ({ page }) => {
    const resources = await page.evaluate(() => performance.getEntriesByType('resource').map((entry) => entry.name))
    expect(resources.some((resource) => resource.includes('three-adapter'))).toBe(false)
  })

  test('canonical query visibly traverses retrieval stages', async ({ page }) => {
    await page.getByLabel('Identity', { exact: true }).selectOption('identity-procurement')
    await page.getByRole('button', { name: 'Run evidence path' }).click()
    await expect(page.locator('.query-stages .is-active')).toContainText('Records')
    await expect(page.locator('.query-stages .is-active')).toContainText('Candidates', { timeout: 1_500 })
    await expect(page.locator('.query-stages .is-active')).toContainText('Accessible', { timeout: 1_500 })
    await expect(page.getByTestId('observatory-answer')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByTestId('observatory-answer')).toContainText('Answer supported')
    await expect(page.locator('.resolved-claims > li')).toHaveCount(4)
    await expect(page.getByRole('button', { name: /Evidence documents/ })).toHaveAttribute('aria-pressed', 'true')
  })

  test('identity changes alter both answer status and spatial access horizon', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.getByRole('button', { name: 'Run evidence path' }).click()
    await expect(page.getByTestId('observatory-answer')).toContainText('Access-limited refusal')
    await expect(page.locator('.access-horizon')).toBeVisible()

    await page.getByLabel('Identity', { exact: true }).selectOption('identity-operations')
    await expect(page.getByTestId('observatory-answer')).toContainText('Partial answer')
    await expect(page.locator('.access-horizon')).toBeVisible()

    await page.getByLabel('Identity', { exact: true }).selectOption('identity-procurement')
    await expect(page.getByTestId('observatory-answer')).toContainText('Answer supported')
    await expect(page.locator('.resolved-claims > li')).toHaveCount(4)
  })

  test('version rail explains why current evidence wins', async ({ page }) => {
    await expect(page.locator('.version-horizon')).toContainText('Lineage detected')
    await page.getByLabel('Identity', { exact: true }).selectOption('identity-procurement')
    await expect(page.locator('.version-rail li')).toHaveCount(3)
    await page.locator('.version-rail button').first().click()
    await expect(page.locator('.version-reading')).toContainText('Meridian Fabrication first')
    await expect(page.locator('.version-reading')).toContainText('excluded from answer')
    await page.locator('.version-rail button').last().click()
    await expect(page.locator('.version-reading')).toContainText('Eligible for current answer')
  })

  test('citations can be reversed into an influence chain', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.getByLabel('Identity', { exact: true }).selectOption('identity-procurement')
    await page.getByRole('button', { name: 'Run evidence path' }).click()
    await page.locator('.citation-links button').first().click()
    await expect(page.locator('.source-inspector')).toHaveClass(/is-open/)
    await expect(page.locator('.source-inspector blockquote')).toBeVisible()
    await expect(page.locator('.influence-chain')).toContainText('supports')
    await expect(page.locator('.influence-chain')).toContainText('Nova selection decision')
    await expect(page.locator('.influence-chain')).toContainText('Project Atlas procurement')
  })

  test('unsupported questions resolve to an explicit refusal', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.getByLabel('Question').fill('What will Project Atlas cost to operate in 2030?')
    await page.getByRole('button', { name: 'Run evidence path' }).click()
    await expect(page.getByTestId('observatory-answer')).toContainText('Unsupported question')
    await expect(page.getByTestId('observatory-answer')).toContainText('do not support an answer')
    await expect(page.locator('.resolved-claims > li')).toHaveCount(0)
  })

  test('mobile controls and map remain within the document viewport', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile project only')
    const widths = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth }))
    expect(widths.document).toBeLessThanOrEqual(widths.viewport)
    await page.getByRole('button', { name: /Relationship people/ }).click()
    await expect(page.locator('.space-stage')).toHaveCSS('overflow-x', 'auto')
  })
})
