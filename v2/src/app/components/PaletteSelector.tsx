import type { ThemeDefinition } from '../../themes/tokens.ts'

interface PaletteSelectorProps {
  readonly value: string
  readonly options: readonly ThemeDefinition[]
  readonly onChange: (themeId: string) => void
  readonly compact?: boolean
}

export function PaletteSelector({ value, options, onChange, compact = false }: PaletteSelectorProps) {
  const light = options.filter((option) => option.mode === 'light')
  const dark = options.filter((option) => option.mode === 'dark')

  return (
    <section className={`palette-selector${compact ? ' palette-selector--compact' : ''}`} aria-label="Shared color palettes">
      <div className="palette-selector__heading">
        <p className="instrument-label">Appearance</p>
        <p>One shared palette system, separated by reading mode.</p>
      </div>
      <div className="palette-selector__modes">
        {[{ id: 'light', label: 'Light mode', options: light }, { id: 'dark', label: 'Dark mode', options: dark }].map((group) => (
          <fieldset key={group.id} className="palette-group">
            <legend>{group.label}</legend>
            <div className="palette-selector__options">
              {group.options.map((option) => (
                <label key={option.id} className="palette-option" title={option.character}>
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
                      background: `linear-gradient(135deg, ${option.colors.background} 0 48%, ${option.colors.primary} 49% 73%, ${option.colors.evidence} 74%)`,
                    }}
                    aria-hidden="true"
                  />
                  <span><strong>{option.name}</strong><small>{option.character}</small></span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </section>
  )
}
