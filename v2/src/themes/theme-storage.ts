import type { DirectionId } from '../directions/registry.ts'
import { defaultThemeFor, themeById } from './palettes.ts'

const STORAGE_PREFIX = 'knowledge-systems:v2:theme:'

export function storedThemeId(directionId: DirectionId): string {
  const urlThemeId = new URLSearchParams(window.location.search).get('v2theme')
  const urlTheme = urlThemeId ? themeById(urlThemeId) : undefined
  if (urlTheme?.directionId === directionId) return urlTheme.id

  try {
    const storedId = window.localStorage.getItem(`${STORAGE_PREFIX}${directionId}`)
    const storedTheme = storedId ? themeById(storedId) : undefined
    if (storedTheme?.directionId === directionId) return storedTheme.id
  } catch {
    // Storage is an enhancement. Private browsing policies must not block the UI.
  }

  return defaultThemeFor(directionId).id
}

export function persistThemeId(directionId: DirectionId, themeId: string): void {
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${directionId}`, themeId)
  } catch {
    // Keep the in-memory selection when storage is unavailable.
  }
}

export function writeThemeToUrl(themeId: string): void {
  const url = new URL(window.location.href)
  url.searchParams.set('v2theme', themeId)
  window.history.replaceState(null, '', url)
}
