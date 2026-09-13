import type { ThemeDefinition } from '../../themes/tokens.ts'

interface PaletteSelectorProps {
  readonly value: string
  readonly options: readonly ThemeDefinition[]
  readonly onChange: (themeId: string) => void
}

export function PaletteSelector({ value, options, onChange }: PaletteSelectorProps) {
  return (
    <fieldset className="palette-selector">
      <legend>Palette</legend>
      <div className="palette-selector__options">
        {options.map((option) => (
          <label key={option.id} className="palette-option">
            <input
              type="radio"
              name="v2-palette"
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
            />
            <span
              className="palette-option__swatch"
              style={{
                background: `linear-gradient(135deg, ${option.colors.background} 0 49%, ${option.colors.primary} 50% 74%, ${option.colors.evidence} 75%)`,
              }}
              aria-hidden="true"
            />
            <span>{option.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
