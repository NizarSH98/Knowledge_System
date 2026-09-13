import { defaultTheme, themeById } from './palettes.ts'
import type { ThemeMode } from './tokens.ts'

const ACTIVE_THEME_KEY = 'knowledge-systems:v2:theme'
const MODE_THEME_PREFIX = 'knowledge-systems:v2:theme-mode:'

export function storedThemeId(): string {
  const urlThemeId = new URLSearchParams(window.location.search).get('v2theme')
  if (urlThemeId && themeById(urlThemeId)) return urlThemeId

  try {
    const storedId = window.localStorage.getItem(ACTIVE_THEME_KEY)
    if (storedId && themeById(storedId)) return storedId
  } catch {
    // Storage is an enhancement. Private browsing policies must not block the UI.
  }

  return defaultTheme.id
}

export function storedThemeForMode(mode: ThemeMode): string | undefined {
  try {
    const storedId = window.localStorage.getItem(`${MODE_THEME_PREFIX}${mode}`)
    return storedId && themeById(storedId)?.mode === mode ? storedId : undefined
  } catch {
    return undefined
  }
}

export function persistThemeId(themeId: string): void {
  const theme = themeById(themeId)
  if (!theme) return
  try {
    window.localStorage.setItem(ACTIVE_THEME_KEY, themeId)
    window.localStorage.setItem(`${MODE_THEME_PREFIX}${theme.mode}`, themeId)
  } catch {
    // Keep the in-memory selection when storage is unavailable.
  }
}

export function writeThemeToUrl(themeId: string): void {
  const url = new URL(window.location.href)
  url.searchParams.set('v2theme', themeId)
  window.history.replaceState(null, '', url)
}
