export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'ks-theme'
const META_COLORS: Record<Theme, string> = { light: '#ece7db', dark: '#0d0c0a' }

type Listener = (theme: Theme) => void
const listeners = new Set<Listener>()

function readInitial(): Theme {
  const param = new URLSearchParams(window.location.search).get('theme')
  if (param === 'dark' || param === 'light') return param
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') return stored
  } catch {
    /* storage can be unavailable in privacy-restricted contexts */
  }
  return 'light'
}

let current: Theme = readInitial()

export function getTheme(): Theme {
  return current
}

export function applyTheme(theme: Theme): void {
  current = theme
  document.documentElement.dataset.theme = theme
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', META_COLORS[theme])
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* private mode */
  }
  listeners.forEach((fn) => fn(theme))
}

export function toggleTheme(): Theme {
  applyTheme(current === 'light' ? 'dark' : 'light')
  return current
}

export function onThemeChange(fn: Listener): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function initTheme(): void {
  document.documentElement.dataset.theme = current
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', META_COLORS[current])
}
