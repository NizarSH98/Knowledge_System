import { resolveProvenance } from '../../knowledge-model/provenance.ts'
import type { KnowledgeModel, RetrievalResult } from '../../knowledge-model/types.ts'
import type { QueryStage } from './model.ts'

const stages: readonly { readonly id: QueryStage; readonly label: string; readonly operation: string }[] = [
  { id: 'records', label: 'Records', operation: 'organization indexed' },
  { id: 'candidates', label: 'Candidates', operation: 'relevant passages emerged' },
  { id: 'permissions', label: 'Accessible', operation: 'source permissions applied' },
  { id: 'versions', label: 'Current', operation: 'superseded versions separated' },
  { id: 'evidence', label: 'Supporting', operation: 'evidence threshold checked' },
  { id: 'resolved', label: 'Answer', operation: 'claims assembled with citations' },
]

interface QuerySequenceProps {
  readonly model: KnowledgeModel
  readonly question: string
  readonly result: RetrievalResult
  readonly stage: QueryStage
  readonly onQuestionChange: (question: string) => void
  readonly onSubmit: () => void
  readonly onSelectSource: (documentId: string) => void
  readonly onInspectEvidence: () => void
}

function stageCount(stage: QueryStage, model: KnowledgeModel, result: RetrievalResult): string {
  switch (stage) {
    case 'records': return String(model.documents.length)
    case 'candidates': return String(result.trace.candidatePassages).padStart(2, '0')
    case 'permissions': return String(Math.max(0, result.trace.candidatePassages - result.restrictedCandidateCount)).padStart(2, '0')
    case 'versions': return String(result.trace.rankedEvidenceCount).padStart(2, '0')
    case 'evidence': return String(result.trace.supportedClaimCount).padStart(2, '0')
    case 'resolved': return result.status === 'supported' ? '01' : '00'
    case 'idle': return String(model.documents.length)
  }
}

export function QuerySequence({
  model,
  question,
  result,
  stage,
  onQuestionChange,
  onSubmit,
  onSelectSource,
  onInspectEvidence,
}: QuerySequenceProps) {
  const activeIndex = stages.findIndex((item) => item.id === stage)
  const displayStage = stage === 'idle' ? stages[0] : stages[Math.max(activeIndex, 0)]
  const canPresentClaims = result.status === 'supported' || result.status === 'partially-supported'
  const visibleClaims = canPresentClaims ? result.claims : []
  const sourceCount = canPresentClaims ? new Set(result.citations.map((citation) => citation.documentId)).size : 0

  return (
    <section className="query-sequence" aria-labelledby="query-title">
      <header>
        <p className="instrument-label">Query instrument / Q-ATL-01</p>
        <h2 id="query-title">Ask the organization, then watch the evidence narrow.</h2>
      </header>

      <form
        className="observatory-query-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <label htmlFor="observatory-question">Question</label>
        <textarea
          id="observatory-question"
          value={question}
          onChange={(event) => onQuestionChange(event.target.value)}
          rows={2}
        />
        <button type="submit">Run evidence path</button>
      </form>

      <div className="query-readout" aria-live="polite">
        <div className="query-readout__number">
          <strong>{stageCount(displayStage?.id ?? 'records', model, result)}</strong>
          <span>{displayStage?.label ?? 'Records'}</span>
          <small>{stage === 'idle' ? 'Ready for a supported question' : displayStage?.operation}</small>
        </div>
        <ol className="query-stages" aria-label="Retrieval operations">
          {stages.map((item, index) => {
            const completed = stage === 'resolved' || (activeIndex >= 0 && index < activeIndex)
            const active = item.id === stage
            return (
              <li key={item.id} className={active ? 'is-active' : completed ? 'is-complete' : ''}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><strong>{item.label}</strong><small>{item.operation}</small></div>
              </li>
            )
          })}
        </ol>
      </div>

      {stage === 'resolved' ? (
        <article className={`answer-resolution answer-resolution--${result.status}`} data-testid="observatory-answer">
          <header>
            <div>
              <p className="instrument-label">Resolution / {result.status.replaceAll('-', ' ')}</p>
              <h3>{result.status === 'supported' ? 'Answer supported' : result.status === 'partially-supported' ? 'Partial answer' : result.status === 'insufficient-permissions' ? 'Access-limited refusal' : 'Unsupported question'}</h3>
            </div>
            <div className="answer-resolution__measure">
              <strong>{String(visibleClaims.length).padStart(2, '0')}</strong><span>claims</span>
              <strong>{String(sourceCount).padStart(2, '0')}</strong><span>sources</span>
            </div>
          </header>
          <p className="answer-resolution__answer">{result.answer}</p>

          {visibleClaims.length > 0 ? (
            <ol className="resolved-claims">
              {visibleClaims.map((claim, claimIndex) => (
                <li key={claim.id}>
                  <span>{String(claimIndex + 1).padStart(2, '0')}</span>
                  <div>
                    <p>{claim.text}</p>
                    <div className="citation-links" aria-label={`Citations for claim ${claimIndex + 1}`}>
                      {claim.citationIds.map((citationId) => {
                        const citation = result.citations.find((item) => item.id === citationId)
                        const provenance = citation ? resolveProvenance(model, citation) : undefined
                        if (!provenance) return null
                        return (
                          <button key={citationId} type="button" onClick={() => onSelectSource(provenance.document.id)}>
                            {provenance.document.title} / {provenance.document.versionLabel}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          ) : null}

          <footer>
            <span>{result.restrictedCandidateCount} beyond access horizon</span>
            <span>{result.supersededCandidateCount} superseded</span>
            {result.evidence.length > 0 ? <button type="button" onClick={onInspectEvidence}>Inspect evidence field</button> : null}
          </footer>
        </article>
      ) : null}
    </section>
  )
}
