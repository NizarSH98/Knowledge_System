import { useMemo, useState, type FormEvent } from 'react'
import { asteriaKnowledgeModel } from '../../data/asteria.ts'
import { CANONICAL_QUESTION, UNSUPPORTED_QUESTION } from '../../data/queries.ts'
import { retrieveKnowledge } from '../../knowledge-model/retrieval.ts'

export function QueryProbe() {
  const [identityId, setIdentityId] = useState('identity-general')
  const [draftQuestion, setDraftQuestion] = useState(CANONICAL_QUESTION)
  const [submittedQuestion, setSubmittedQuestion] = useState(CANONICAL_QUESTION)
  const result = useMemo(
    () => retrieveKnowledge(asteriaKnowledgeModel, submittedQuestion, identityId),
    [identityId, submittedQuestion],
  )

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    setSubmittedQuestion(draftQuestion.trim())
  }

  return (
    <section className="query-probe" aria-labelledby="query-probe-title">
      <div className="query-probe__intro">
        <p className="eyebrow">Shared model probe</p>
        <h2 id="query-probe-title">Permission changes behavior, not labels.</h2>
        <p>This neutral diagnostic will be reinterpreted independently by each candidate direction.</p>
      </div>

      <form onSubmit={submit} className="query-probe__form">
        <label htmlFor="probe-identity">Identity</label>
        <select id="probe-identity" value={identityId} onChange={(event) => setIdentityId(event.target.value)}>
          {asteriaKnowledgeModel.identities.map((identity) => (
            <option key={identity.id} value={identity.id}>{identity.label}</option>
          ))}
        </select>
        <label htmlFor="probe-question">Question</label>
        <div className="query-input-row">
          <input id="probe-question" value={draftQuestion} onChange={(event) => setDraftQuestion(event.target.value)} />
          <button type="submit">Run query</button>
        </div>
        <button
          className="text-button"
          type="button"
          onClick={() => {
            setDraftQuestion(UNSUPPORTED_QUESTION)
            setSubmittedQuestion(UNSUPPORTED_QUESTION)
          }}
        >
          Try the unsupported question
        </button>
      </form>

      <div className="query-result" aria-live="polite" data-status={result.status}>
        <div className="query-result__status">
          <span>Status</span>
          <strong data-testid="query-status">{result.status.replaceAll('-', ' ')}</strong>
        </div>
        <p>{result.answer}</p>
        {result.claims.length > 0 && (
          <ol className="claim-list">
            {result.claims.map((claim) => (
              <li key={claim.id}>
                {claim.text}
                <small>{claim.citationIds.length} linked {claim.citationIds.length === 1 ? 'passage' : 'passages'}</small>
              </li>
            ))}
          </ol>
        )}
        <div className="trace-strip" aria-label="Retrieval trace">
          {result.trace.operations.map((operation) => <span key={operation}>{operation}</span>)}
        </div>
      </div>
    </section>
  )
}
