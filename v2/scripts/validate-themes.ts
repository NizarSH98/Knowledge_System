import { themes } from '../src/themes/palettes.ts'

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255)
  const linear = channels.map((channel) => channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4)
  return 0.2126 * (linear[0] ?? 0) + 0.7152 * (linear[1] ?? 0) + 0.0722 * (linear[2] ?? 0)
}

function contrast(foreground: string, background: string): number {
  const a = luminance(foreground)
  const b = luminance(background)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

const readableTokens = ['text', 'textMuted', 'primary', 'evidence', 'restricted'] as const
const readingSurfaces = ['background', 'surface'] as const
const failures: string[] = []

for (const theme of themes) {
  for (const token of readableTokens) {
    for (const surface of readingSurfaces) {
      const ratio = contrast(theme.colors[token], theme.colors[surface])
      if (ratio < 4.5) failures.push(`${theme.id}: ${token}/${surface} = ${ratio.toFixed(2)}:1`)
    }
  }
  const focusRatio = contrast(theme.colors.focus, theme.colors.background)
  if (focusRatio < 3) failures.push(`${theme.id}: focus/background = ${focusRatio.toFixed(2)}:1`)
}

if (failures.length > 0) {
  console.error('Theme contrast validation failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(`Theme validation passed: ${themes.length} palettes; readable semantic text ≥ 4.5:1; focus ≥ 3:1.`)
}
