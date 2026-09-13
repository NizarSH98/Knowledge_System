import { useMemo, useState, type FormEvent } from 'react'
import { asteriaKnowledgeModel, CANONICAL_QUESTION, UNSUPPORTED_QUESTION } from '../../data/index.ts'
import { retrieveKnowledge } from '../../knowledge-model/retrieval.ts'

export function useKnowledgeQuery(initialIdentityId = 'identity-general') {
  const [identityId, setIdentityId] = useState(initialIdentityId)
  const [draftQuestion, setDraftQuestion] = useState(CANONICAL_QUESTION)
  const [submittedQuestion, setSubmittedQuestion] = useState(CANONICAL_QUESTION)
  const result = useMemo(
    () => retrieveKnowledge(asteriaKnowledgeModel, submittedQuestion, identityId),
    [identityId, submittedQuestion],
  )

  function submit(event?: FormEvent<HTMLFormElement>): void {
    event?.preventDefault()
    setSubmittedQuestion(draftQuestion.trim())
  }

  function tryUnsupported(): void {
    setDraftQuestion(UNSUPPORTED_QUESTION)
    setSubmittedQuestion(UNSUPPORTED_QUESTION)
  }

  function restoreCanonical(): void {
    setDraftQuestion(CANONICAL_QUESTION)
    setSubmittedQuestion(CANONICAL_QUESTION)
  }

  return {
    model: asteriaKnowledgeModel,
    identityId,
    setIdentityId,
    draftQuestion,
    setDraftQuestion,
    result,
    submit,
    tryUnsupported,
    restoreCanonical,
  }
}
