import { useState } from 'react'
import { V2_ROUTES } from '../../app/routes.ts'
import { RouteLink } from '../../shared/components/RouteLink.tsx'
import { useKnowledgeQuery } from '../../shared/hooks/useKnowledgeQuery.ts'
import { useTheme } from '../../themes/useTheme.ts'
import './living-archive.css'

const statusTitle = {
  supported: 'A supported institutional account',
  'partially-supported': 'A partial institutional account',
  'insufficient-permissions': 'A record beyond this reader’s access',
  unsupported: 'No record supports this question',
} as const

export function LivingArchivePage() {
  const { theme, modeOptions, selectMode, selectTheme } = useTheme()
  const query = useKnowledgeQuery('identity-procurement')
  const [openFolio, setOpenFolio] = useState<string | null>(null)
  const canPresentClaims = query.result.status === 'supported' || query.result.status === 'partially-supported'
  const visibleClaims = canPresentClaims ? query.result.claims : []
  const citedDocumentIds = canPresentClaims ? [...new Set(query.result.citations.map((citation) => citation.documentId))] : []

  return (
    <main id="main-content" className="archive-page">
      <header className="archive-header">
        <RouteLink to={V2_ROUTES.home} className="archive-mark"><span>The living</span><strong>Knowledge Archive</strong></RouteLink>
        <p>Asteria Infrastructure Group / institutional record</p>
        <nav aria-label="V2 directions"><RouteLink to={V2_ROUTES.observatory}>Observatory</RouteLink><RouteLink to={V2_ROUTES.institutionalOs}>Institutional OS</RouteLink></nav>
      </header>

      <section className="archive-controls" aria-label="Archive controls">
        <fieldset><legend>Reader</legend>{query.model.identities.map((identity) => <label key={identity.id}><input type="radio" name="archive-identity" value={identity.id} checked={query.identityId === identity.id} onChange={() => query.setIdentityId(identity.id)} /><span>{identity.label}</span><small>{identity.role}</small></label>)}</fieldset>
        <div><label><span>Reading mode</span><select aria-label="Reading mode" value={theme.mode} onChange={(event) => selectMode(event.target.value as 'light' | 'dark')}><option value="light">Light mode</option><option value="dark">Dark mode</option></select></label><label><span>Color palette</span><select aria-label="Color palette" value={theme.id} onChange={(event) => selectTheme(event.target.value)}>{modeOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></div>
      </section>

      <article className="archive-dossier">
        <aside className="archive-margin"><span>Case 026</span><p>Supplier appointment</p><p>Project Atlas</p><time dateTime="2026-03-13">13 March 2026</time></aside>
        <div className="archive-story">
          <p className="archive-kicker">Decision record / evidence assembled for {query.model.identities.find((item) => item.id === query.identityId)?.label}</p>
          <h1>Why Nova Industrial was selected for Project Atlas</h1>
          <p className="archive-deck">The answer changes with the reader’s legitimate access. The record does not fill gaps with plausible prose.</p>

          <section className="archive-answer" data-status={query.result.status} aria-live="polite">
            <header><span>{query.result.status.replaceAll('-', ' ')}</span><strong>{statusTitle[query.result.status]}</strong></header>
            <p className="archive-answer__lead">{query.result.answer}</p>
            {visibleClaims.length > 0 && <ol>{visibleClaims.map((claim, index) => <li key={claim.id}><p>{claim.text}<sup>{index + 1}</sup></p><small>{claim.citationIds.length} current source passage{claim.citationIds.length === 1 ? '' : 's'}</small></li>)}</ol>}
            {visibleClaims.length === 0 && <blockquote>Absence is shown as absence. A restricted source is not paraphrased, guessed, or exposed.</blockquote>}
          </section>

          <section className="archive-folios" aria-labelledby="folios-title">
            <header><p className="archive-kicker">References</p><h2 id="folios-title">The source folios</h2><p>Open a folio to read the exact passage used in the account above.</p></header>
            {citedDocumentIds.length > 0 ? <ol>{citedDocumentIds.map((documentId, index) => { const document = query.model.documents.find((item) => item.id === documentId); const evidence = query.result.evidence.find((item) => item.document.id === documentId); if (!document || !evidence) return null; const open = openFolio === documentId; return <li key={documentId} className={open ? 'is-open' : ''}><button type="button" aria-expanded={open} onClick={() => setOpenFolio(open ? null : documentId)}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{document.title}</strong><small>{document.versionLabel} / {evidence.passage.locator}</small></div><i aria-hidden="true">{open ? '−' : '+'}</i></button>{open && <div className="archive-folio__reading"><blockquote>{evidence.passage.text}</blockquote><p>Owned by {query.model.departments.find((item) => item.id === document.ownerDepartmentId)?.name}; synchronized from {query.model.repositories.find((item) => item.id === document.repositoryId)?.name}.</p></div>}</li> })}</ol> : <p className="archive-no-folios">No accessible source folio can be attached to this response.</p>}
          </section>

          <section className="archive-chronology" aria-labelledby="chronology-title"><header><p className="archive-kicker">Version history</p><h2 id="chronology-title">The recommendation changed as the evidence changed.</h2></header><ol>{query.model.documents.filter((document) => document.versionFamilyId === 'version-family-atlas-evaluation').map((document) => <li key={document.id} data-current={document.status === 'current'}><time dateTime={document.createdAt}>{document.createdAt}</time><div><strong>{document.versionLabel}</strong><p>{document.passages[0]?.text}</p></div><span>{document.status === 'current' ? 'eligible evidence' : 'preserved / excluded'}</span></li>)}</ol></section>

          <section className="archive-query-note"><div><p className="archive-kicker">Test the boundary</p><h2>Ask beyond the archive.</h2><p>The system should refuse when the record cannot support the question.</p></div><button type="button" onClick={query.tryUnsupported}>Ask about Atlas operating cost in 2030</button><button type="button" onClick={query.restoreCanonical}>Return to the decision record</button></section>
        </div>
      </article>
    </main>
  )
}
