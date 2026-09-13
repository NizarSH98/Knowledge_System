import type { ThemeDefinition } from './tokens.ts'

const cssTokenNames = {
  background: '--color-bg',
  surface: '--color-surface',
  surfaceRaised: '--color-surface-raised',
  text: '--color-text',
  textMuted: '--color-text-muted',
  primary: '--color-primary',
  evidence: '--color-evidence',
  current: '--color-current',
  restricted: '--color-restricted',
  superseded: '--color-superseded',
  warning: '--color-warning',
  relationship: '--color-relationship',
  border: '--color-border',
  focus: '--color-focus',
  hover: '--color-hover',
  selection: '--color-selection',
} as const

export function applyTheme(theme: ThemeDefinition, element = document.documentElement): void {
  const replacingTheme = Boolean(element.dataset.v2Theme)
  for (const [token, cssName] of Object.entries(cssTokenNames)) {
    const value = theme.colors[token as keyof ThemeDefinition['colors']]
    element.style.setProperty(cssName, value)
  }
  element.dataset.v2Theme = theme.id
  element.dataset.v2Direction = theme.directionId
  if (replacingTheme) {
    element.dataset.v2ThemeTransition = 'ready'
  } else {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (element.dataset.v2Theme === theme.id) element.dataset.v2ThemeTransition = 'ready'
      })
    })
  }
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute('content', theme.colors.background)
}

export function clearAppliedTheme(element = document.documentElement): void {
  for (const cssName of Object.values(cssTokenNames)) element.style.removeProperty(cssName)
  delete element.dataset.v2Theme
  delete element.dataset.v2Direction
  delete element.dataset.v2ThemeTransition
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute('content', '#E8E7E2')
}
