import { useEffect, useState } from 'react'
import { applyTheme } from './theme-engine.ts'
import { defaultTheme, defaultThemeForMode, themeById, themes, themesForMode } from './palettes.ts'
import { persistThemeId, storedThemeForMode, storedThemeId, writeThemeToUrl } from './theme-storage.ts'
import type { ThemeDefinition, ThemeMode } from './tokens.ts'

export interface ThemeState {
  readonly theme: ThemeDefinition
  readonly options: readonly ThemeDefinition[]
  readonly modeOptions: readonly ThemeDefinition[]
  readonly selectMode: (mode: ThemeMode) => void
  readonly selectTheme: (themeId: string) => void
}

export function useTheme(): ThemeState {
  const [themeId, setThemeId] = useState(storedThemeId)
  const theme = themeById(themeId) ?? defaultTheme

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  function selectTheme(nextThemeId: string): void {
    const nextTheme = themeById(nextThemeId)
    if (!nextTheme) return
    setThemeId(nextTheme.id)
    persistThemeId(nextTheme.id)
    writeThemeToUrl(nextTheme.id)
  }

  function selectMode(mode: ThemeMode): void {
    const rememberedId = storedThemeForMode(mode)
    selectTheme(rememberedId ?? defaultThemeForMode(mode).id)
  }

  return { theme, options: themes, modeOptions: themesForMode(theme.mode), selectMode, selectTheme }
}
