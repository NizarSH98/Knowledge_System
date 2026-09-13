import { directions, type DirectionDefinition } from '../../directions/registry.ts'
import { RouteLink } from '../../shared/components/RouteLink.tsx'
import { useTheme } from '../../themes/useTheme.ts'
import { ConceptPreview } from '../components/ConceptPreview.tsx'
import { PaletteSelector } from '../components/PaletteSelector.tsx'

const sectionCopy: Readonly<Record<DirectionDefinition['id'], {
  readonly verb: string
  readonly title: string
  readonly body: string
  readonly capabilities: readonly string[]
}>> = {
  observatory: {
    verb: 'Observe',
    title: 'See the organization around the answer.',
    body: 'Move from departments and projects to people, decisions, records, passages, and citations. The spatial view preserves context while an evidence path explains exactly what the current identity can know.',
    capabilities: ['Three semantic scales', 'Permission horizon', 'Animated evidence path', 'Version lineage', 'Reverse citation inspection'],
  },
  'institutional-os': {
    verb: 'Operate',
    title: 'Turn evidence into a dependable work surface.',
    body: 'A dense, keyboard-minded workspace separates the supported answer from its claims, source records, and retrieval trace. Nothing is hidden behind a confidence score.',
    capabilities: ['Identity-aware command bar', 'Claim ledger', 'Source inspector', 'Explicit exclusions', 'Deterministic trace'],
  },
  'living-archive': {
    verb: 'Remember',
    title: 'Read the decision as an institutional record.',
    body: 'An editorial dossier gives every claim a footnote, every source an owner, and every version a place in time. Superseded evidence remains visible without being allowed to quietly win.',
    capabilities: ['Narrative dossier', 'Margin references', 'Source folios', 'Version chronology', 'Permission-aware redaction'],
  },
}

function IntegratedDirection({ direction }: { readonly direction: DirectionDefinition }) {
  const copy = sectionCopy[direction.id]

  return (
    <article className={`integrated-direction integrated-direction--${direction.id}`}>
      <div className="integrated-direction__visual" aria-hidden="true">
        <span className="integrated-direction__number">{direction.index}</span>
        <ConceptPreview directionId={direction.id} />
      </div>
      <div className="integrated-direction__copy">
        <p className="eyebrow">{copy.verb} / {direction.name}</p>
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
        <ul>{copy.capabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul>
        <RouteLink className="enter-link" to={direction.route}>Open the {direction.name} workspace <span aria-hidden="true">↗</span></RouteLink>
      </div>
    </article>
  )
}

export function HomePage() {
  const { theme, options, selectTheme } = useTheme()

  return (
    <main id="main-content" className="chooser integrated-home">
      <header className="chooser__intro">
        <p className="eyebrow">Asteria Infrastructure Group / synthetic demonstration</p>
        <h1>Observe, operate, and remember what the organization knows.</h1>
        <p>
          One evidence system expressed through three complementary interaction languages.
          Explore them together here, then open each full workspace for a closer review.
        </p>
      </header>

      <PaletteSelector value={theme.id} options={options} onChange={selectTheme} />

      <section className="integrated-sequence" aria-label="Three connected knowledge experiences">
        {directions.map((direction) => <IntegratedDirection key={direction.id} direction={direction} />)}
      </section>

      <aside className="integrated-principle">
        <p className="eyebrow">One governing principle</p>
        <p>A supported answer must remain reversible: from sentence, to claim, to passage, to document, to owner, and back to the decision it influenced.</p>
      </aside>
    </main>
  )
}
