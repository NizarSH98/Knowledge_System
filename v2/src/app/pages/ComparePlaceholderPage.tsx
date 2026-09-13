import { useEffect } from 'react'
import { directions } from '../../directions/registry.ts'
import { RouteLink } from '../../shared/components/RouteLink.tsx'
import { clearAppliedTheme } from '../../themes/theme-engine.ts'

export function ComparePlaceholderPage() {
  useEffect(() => clearAppliedTheme(), [])

  return (
    <main id="main-content" className="compare-placeholder">
      <p className="eyebrow">Comparison workspace · reserved</p>
      <h1>Comparison begins after all three candidates can stand on their own.</h1>
      <p>No scores, screenshots, or performance claims are fabricated at this checkpoint.</p>
      <div className="compare-placeholder__routes">
        {directions.map((direction) => (
          <RouteLink key={direction.id} to={direction.route}>
            <span>{direction.index}</span>{direction.name}
          </RouteLink>
        ))}
      </div>
    </main>
  )
}
