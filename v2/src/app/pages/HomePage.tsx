import { useEffect } from 'react'
import { directions, type DirectionDefinition } from '../../directions/registry.ts'
import { RouteLink } from '../../shared/components/RouteLink.tsx'
import { clearAppliedTheme } from '../../themes/theme-engine.ts'
import { defaultThemeFor, themeById } from '../../themes/palettes.ts'
import { storedThemeId } from '../../themes/theme-storage.ts'
import type { V2Route } from '../routes.ts'
import { ConceptPreview } from '../components/ConceptPreview.tsx'

function DirectionCard({ direction }: { readonly direction: DirectionDefinition }) {
  const selectedTheme = themeById(storedThemeId(direction.id)) ?? defaultThemeFor(direction.id)

  return (
    <article className="direction-card">
      <div className="direction-card__index" aria-hidden="true">{direction.index}</div>
      <div className="direction-card__preview"><ConceptPreview directionId={direction.id} /></div>
      <div className="direction-card__body">
        <h2>{direction.name}</h2>
        <p>{direction.metaphor}</p>
        <dl>
          <div><dt>Dominant interaction</dt><dd>{direction.dominantInteraction}</dd></div>
          <div>
            <dt>Current palette</dt>
            <dd className="current-palette">
              <i style={{ background: selectedTheme.colors.primary }} aria-hidden="true" />
              {selectedTheme.name}
            </dd>
          </div>
        </dl>
        <RouteLink className="enter-link" to={direction.route as V2Route}>
          Enter direction <span aria-hidden="true">↗</span>
        </RouteLink>
      </div>
    </article>
  )
}

export function HomePage() {
  useEffect(() => clearAppliedTheme(), [])

  return (
    <main id="main-content" className="chooser">
      <header className="chooser__intro">
        <p className="eyebrow">V2 design exploration · synthetic demonstration</p>
        <h1>Three ways to understand organizational knowledge.</h1>
        <p>
          One organization. One evidence set. Three independently art-directed interpretations.
          This neutral index keeps the comparison open.
        </p>
      </header>
      <section className="direction-grid" aria-label="Candidate directions">
        {directions.map((direction) => <DirectionCard key={direction.id} direction={direction} />)}
      </section>
      <aside className="checkpoint-notice">
        <span>Checkpoint 2</span>
        <p>The routes, themes, capability detection, quality tiers, and shared model are live. Direction-specific design work has not begun.</p>
      </aside>
    </main>
  )
}
