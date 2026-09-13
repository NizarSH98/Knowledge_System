import { useState } from 'react'
import { V2_ROUTES } from '../../app/routes.ts'
import { canAccessDocument } from '../../knowledge-model/permissions.ts'
import { RouteLink } from '../../shared/components/RouteLink.tsx'
import { useKnowledgeQuery } from '../../shared/hooks/useKnowledgeQuery.ts'
import { useTheme } from '../../themes/useTheme.ts'
import './institutional-os.css'

const statusLabel = {
  supported: 'Answer supported',
  'partially-supported': 'Partial answer',
  'insufficient-permissions': 'Access-limited refusal',
  unsupported: 'Unsupported question',
} as const

export function InstitutionalOSPage() {
  const { theme, modeOptions, selectMode, selectTheme } = useTheme()
  const query = useKnowledgeQuery()
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null)
  const identity = query.model.identities.find((item) => item.id === query.identityId) ?? query.model.identities[0]
  const selectedDocument = query.model.documents.find((item) => item.id === selectedDocumentId)
  const selectedEvidence = query.result.evidence.find((item) => item.document.id === selectedDocumentId)
  const visibleClaims = query.result.status === 'supported' || query.result.status === 'partially-supported'
    ? query.result.claims
    : []
  const accessibleCount = identity
    ? query.model.documents.filter((document) => canAccessDocument(identity, document)).length
    : 0

  return (
    <main id="main-content" className="os-page">
      <header className="os-topbar">
        <RouteLink className="os-wordmark" to={V2_ROUTES.home}><span>KS</span> Institutional OS</RouteLink>
        <p>Asteria / governed knowledge workspace</p>
        <nav aria-label="V2 directions"><RouteLink to={V2_ROUTES.observatory}>Observe</RouteLink><RouteLink to={V2_ROUTES.livingArchive}>Archive</RouteLink></nav>
      </header>

      <section className="os-toolbar" aria-label="Workspace controls">
        <label><span>Identity context</span><select aria-label="Identity" value={query.identityId} onChange={(event) => query.setIdentityId(event.target.value)}>{query.model.identities.map((item) => <option key={item.id} value={item.id}>{item.label} / {item.role}</option>)}</select></label>
        <label><span>Reading mode</span><select aria-label="Reading mode" value={theme.mode} onChange={(event) => selectMode(event.target.value as 'light' | 'dark')}><option value="light">Light mode</option><option value="dark">Dark mode</option></select></label>
        <label><span>Color palette</span><select aria-label="Color palette" value={theme.id} onChange={(event) => selectTheme(event.target.value)}>{modeOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <dl><div><dt>Reachable records</dt><dd>{accessibleCount} / {query.model.documents.length}</dd></div><div><dt>Index state</dt><dd>Current</dd></div></dl>
      </section>

      <div className="os-layout">
        <aside className="os-rail" aria-label="Knowledge domains">
          <p>Workspaces</p>
          <ol><li className="is-active"><span>01</span>Ask knowledge</li><li><span>02</span>Decision register</li><li><span>03</span>Source inventory</li><li><span>04</span>Access map</li></ol>
          <div><small>Active scope</small><strong>Project Atlas</strong><span>Supplier selection</span></div>
        </aside>

        <section className="os-workspace">
          <header className="os-workspace__intro">
            <div><p className="instrument-label">Ask / verified retrieval</p><h1>Work from the answer back to the record.</h1></div>
            <p>Claims, exclusions, and source versions stay visible as operating context. The interface reports support state; it does not simulate certainty.</p>
          </header>

          <form className="os-command" onSubmit={query.submit}>
            <label htmlFor="os-question">Question</label>
            <div><input id="os-question" value={query.draftQuestion} onChange={(event) => query.setDraftQuestion(event.target.value)} /><button type="submit">Retrieve evidence <kbd>↵</kbd></button></div>
            <button type="button" onClick={query.tryUnsupported}>Test an unsupported question</button>
            <button type="button" onClick={query.restoreCanonical}>Restore prepared question</button>
          </form>

          <div className="os-answer-grid">
            <article className="os-answer" data-status={query.result.status} aria-live="polite">
              <header><span>Response / {query.identityId.replace('identity-', '')}</span><strong data-testid="query-status">{statusLabel[query.result.status]}</strong></header>
              <h2>{query.result.answer}</h2>
              {visibleClaims.length > 0 ? <ol className="os-claims">{visibleClaims.map((claim, index) => <li key={claim.id}><span>{String(index + 1).padStart(2, '0')}</span><p>{claim.text}</p><div>{claim.citationIds.map((citationId) => { const citation = query.result.citations.find((item) => item.id === citationId); const document = query.model.documents.find((item) => item.id === citation?.documentId); return document ? <button type="button" key={citationId} onClick={() => setSelectedDocumentId(document.id)}>{document.versionLabel} / {citation?.locator}</button> : null })}</div></li>)}</ol> : <p className="os-empty">No claim is shown without enough accessible, current evidence to answer.</p>}
              {(query.result.restrictedCandidateCount > 0 || query.result.supersededCandidateCount > 0) && <div className="os-exclusions"><strong>Evidence excluded</strong><span>{query.result.restrictedCandidateCount} restricted candidate{query.result.restrictedCandidateCount === 1 ? '' : 's'}</span><span>{query.result.supersededCandidateCount} superseded version{query.result.supersededCandidateCount === 1 ? '' : 's'}</span></div>}
            </article>

            <aside className="os-inspector" aria-live="polite">
              <header><span>Source inspector</span>{selectedDocument && <button type="button" onClick={() => setSelectedDocumentId(null)}>Close</button>}</header>
              {selectedDocument && selectedEvidence ? <><p className="os-inspector__kind">{selectedDocument.kind} / {selectedDocument.versionLabel}</p><h2>{selectedDocument.title}</h2><blockquote>{selectedEvidence.passage.text}</blockquote><dl><div><dt>Passage</dt><dd>{selectedEvidence.passage.locator}</dd></div><div><dt>Owner</dt><dd>{query.model.departments.find((item) => item.id === selectedDocument.ownerDepartmentId)?.name}</dd></div><div><dt>Repository</dt><dd>{query.model.repositories.find((item) => item.id === selectedDocument.repositoryId)?.name}</dd></div><div><dt>Recorded</dt><dd>{selectedDocument.createdAt}</dd></div></dl></> : <div className="os-inspector__empty"><span aria-hidden="true">↳</span><p>Select a citation beside a claim to inspect its exact passage and ownership.</p></div>}
            </aside>
          </div>

          <section className="os-trace" aria-label="Deterministic retrieval trace"><header><span>Retrieval trace</span><p>No confidence score. Only recorded operations.</p></header><ol>{query.result.trace.operations.map((operation, index) => <li key={operation}><span>{String(index + 1).padStart(2, '0')}</span>{operation}</li>)}</ol></section>
        </section>
      </div>
    </main>
  )
}
