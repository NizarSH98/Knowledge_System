import { directions } from '../../directions/registry.ts'
import { RouteLink } from '../../shared/components/RouteLink.tsx'
import { useTheme } from '../../themes/useTheme.ts'
import { PaletteSelector } from '../components/PaletteSelector.tsx'

export function ComparePlaceholderPage() {
  const { theme, options, selectTheme } = useTheme()

  return (
    <main id="main-content" className="compare-placeholder">
      <p className="eyebrow">Comparison workspace / three complementary lenses</p>
      <h1>One evidence model. Three different jobs.</h1>
      <p>The directions now belong to one product story: spatial discovery, dependable operation, and durable institutional memory.</p>
      <PaletteSelector value={theme.id} options={options} onChange={selectTheme} compact />
      <div className="compare-placeholder__routes">
        {directions.map((direction) => (
          <RouteLink key={direction.id} to={direction.route}>
            <span>{direction.index} / {direction.dominantInteraction}</span>
            <strong>{direction.name}</strong>
            <small>{direction.metaphor}</small>
          </RouteLink>
        ))}
      </div>
    </main>
  )
}
