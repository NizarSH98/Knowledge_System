import { canAccessDocument } from '../../knowledge-model/permissions.ts'
import type { Identity, KnowledgeModel } from '../../knowledge-model/types.ts'

interface VersionRailProps {
  readonly model: KnowledgeModel
  readonly identity: Identity
  readonly selectedVersionId: string
  readonly onSelect: (documentId: string) => void
}

export function VersionRail({ model, identity, selectedVersionId, onSelect }: VersionRailProps) {
  const versions = model.documents
    .filter((document) => document.versionFamilyId === 'version-family-atlas-evaluation')
    .toSorted((first, second) => first.version - second.version)
  const canInspect = versions.every((document) => canAccessDocument(identity, document))
  const selected = versions.find((document) => document.id === selectedVersionId) ?? versions.at(-1)

  return (
    <section className="version-observatory" aria-labelledby="version-title">
      <header>
        <div>
          <p className="instrument-label">Temporal rail / VF-ATL-EVAL</p>
          <h2 id="version-title">Knowledge has state and history.</h2>
        </div>
        <span className="version-rule">Current wins by declared lineage—not recency theatre.</span>
      </header>

      {canInspect ? (
        <>
          <ol className="version-rail">
            {versions.map((document, index) => (
              <li key={document.id} className={document.id === selected?.id ? 'is-selected' : ''}>
                <button type="button" onClick={() => onSelect(document.id)} aria-pressed={document.id === selected?.id}>
                  <span>{document.versionLabel}</span>
                  <strong>{document.createdAt}</strong>
                  <small>{document.status}</small>
                </button>
                {index < versions.length - 1 ? <i aria-hidden="true">superseded by</i> : null}
              </li>
            ))}
          </ol>
          {selected ? (
            <article className={`version-reading version-reading--${selected.status}`}>
              <header><span>{selected.title}</span><strong>{selected.versionLabel}</strong></header>
              <p>{selected.passages[0]?.text}</p>
              <footer>
                <span>{selected.passages[0]?.locator}</span>
                <span>{selected.status === 'current' ? 'Eligible for current answer' : 'Retained for lineage · excluded from answer'}</span>
              </footer>
            </article>
          ) : null}
        </>
      ) : (
        <div className="version-horizon">
          <div aria-hidden="true"><i /><i /><i /></div>
          <strong>Lineage detected. Contents unresolved.</strong>
          <p>This identity can see that the evaluation changed, but cannot inspect supplier-evaluation versions or infer what they contain.</p>
        </div>
      )}
    </section>
  )
}
