import { useEffect, useState } from 'react'
import type { DirectionId } from '../directions/registry.ts'
import { applyTheme } from './theme-engine.ts'
import { defaultThemeFor, themeById, themesForDirection } from './palettes.ts'
import { persistThemeId, storedThemeId, writeThemeToUrl } from './theme-storage.ts'
import type { ThemeDefinition } from './tokens.ts'

export interface DirectionThemeState {
  readonly theme: ThemeDefinition
  readonly options: readonly ThemeDefinition[]
  readonly selectTheme: (themeId: string) => void
}

export function useDirectionTheme(directionId: DirectionId): DirectionThemeState {
  const [themeId, setThemeId] = useState(() => storedThemeId(directionId))
  const options = themesForDirection(directionId)
  const candidate = themeById(themeId)
  const theme = candidate?.directionId === directionId ? candidate : defaultThemeFor(directionId)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  function selectTheme(nextThemeId: string): void {
    const nextTheme = themeById(nextThemeId)
    if (nextTheme?.directionId !== directionId) return
    setThemeId(nextTheme.id)
    persistThemeId(directionId, nextTheme.id)
    writeThemeToUrl(nextTheme.id)
  }

  return { theme, options, selectTheme }
}
