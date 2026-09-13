import { canAccessDocument } from './permissions.ts'
import type {
  Citation,
  DocumentRecord,
  ExcludedEvidence,
  Identity,
  KnowledgeModel,
  Passage,
  QueryDefinition,
  RankedEvidence,
  RetrievalResult,
  RetrievalStatus,
  SupportedClaim,
} from './types.ts'

interface Candidate {
  readonly document: DocumentRecord
  readonly passage: Passage
  readonly retrievalWeight: number
}

const UNSUPPORTED_ANSWER =
  'The approved sources in this demonstration do not support an answer to that question. No response has been inferred.'

function normalize(value: string): string {
  return value
    .toLocaleLowerCase('en')
    .replaceAll(/[^a-z0-9]+/g, ' ')
    .trim()
}

function matchQuery(
  definitions: readonly QueryDefinition[],
  question: string,
): QueryDefinition | undefined {
  const normalizedQuestion = normalize(question)

  return definitions.find((definition) => {
    const knownPhrasings = [definition.canonicalText, ...definition.aliases].map(normalize)
    if (knownPhrasings.includes(normalizedQuestion)) return true

    const matchingKeywords = definition.keywords.filter((keyword) =>
      normalizedQuestion.includes(normalize(keyword)),
    )
    return matchingKeywords.length >= 2
  })
}

function scorePassage(
  query: QueryDefinition,
  document: DocumentRecord,
  passage: Passage,
): number {
  const searchableText = normalize(`${document.title} ${passage.text}`)
  const keywordScore = query.keywords.reduce(
    (score, keyword) => score + (searchableText.includes(normalize(keyword)) ? 1 : 0),
    0,
  )
  const evidenceKeys = new Set(query.claims.flatMap((claim) => claim.evidenceKeys))
  const evidenceScore = passage.evidenceKey && evidenceKeys.has(passage.evidenceKey) ? 8 : 0
  const projectScore = document.projectIds.includes('project-atlas') ? 1 : 0

  return keywordScore + evidenceScore + projectScore
}

function candidatesFor(
  model: KnowledgeModel,
  query: QueryDefinition,
): readonly Candidate[] {
  return model.documents.flatMap((document) =>
    document.passages.flatMap((passage) => {
      const score = scorePassage(query, document, passage)
      return score >= 3 ? [{ document, passage, retrievalWeight: score }] : []
    }),
  )
}

function rankCandidates(candidates: readonly Candidate[]): readonly RankedEvidence[] {
  return candidates
    .toSorted((a, b) => {
      if (a.retrievalWeight !== b.retrievalWeight) {
        return b.retrievalWeight - a.retrievalWeight
      }
      const freshness = b.document.createdAt.localeCompare(a.document.createdAt)
      if (freshness !== 0) return freshness
      return a.passage.id.localeCompare(b.passage.id)
    })
    .map(({ document, passage }, index) => ({ document, passage, rank: index + 1 }))
}

function buildClaims(
  query: QueryDefinition,
  evidence: readonly RankedEvidence[],
): { readonly claims: readonly SupportedClaim[]; readonly citations: readonly Citation[] } {
  const claims: SupportedClaim[] = []
  const citations: Citation[] = []

  for (const claim of query.claims) {
    const matchingEvidence = evidence.filter(
      ({ passage }) => passage.evidenceKey && claim.evidenceKeys.includes(passage.evidenceKey),
    )
    const distinctEvidenceKeys = new Set(
      matchingEvidence.map(({ passage }) => passage.evidenceKey),
    )

    if (distinctEvidenceKeys.size < claim.minimumEvidenceCount) continue

    const claimCitations = matchingEvidence.map(({ document, passage }, citationIndex) => {
      const citation: Citation = {
        id: `citation-${claim.id}-${citationIndex + 1}`,
        claimId: claim.id,
        documentId: document.id,
        passageId: passage.id,
        locator: passage.locator,
      }
      citations.push(citation)
      return citation.id
    })

    claims.push({ id: claim.id, text: claim.text, citationIds: claimCitations })
  }

  return { claims, citations }
}

function resultStatus(
  query: QueryDefinition,
  supportedClaimCount: number,
  restrictedCandidateCount: number,
): RetrievalStatus {
  if (supportedClaimCount === query.claims.length) return 'supported'
  if (supportedClaimCount >= query.minimumSupportedClaims) return 'partially-supported'
  if (restrictedCandidateCount > 0) return 'insufficient-permissions'
  return 'unsupported'
}

function answerFor(status: RetrievalStatus, claims: readonly SupportedClaim[]): string {
  if (status === 'unsupported') return UNSUPPORTED_ANSWER
  if (status === 'insufficient-permissions') {
    return 'The sources available to this identity do not support a complete answer. Some candidate evidence is access-restricted; the system will not infer the missing basis.'
  }

  const prefix = status === 'supported'
    ? 'Nova Industrial was selected for Project Atlas because:'
    : 'The available current evidence supports part of the selection rationale:'
  return `${prefix} ${claims.map((claim) => claim.text).join(' ')}`
}

function unsupportedResult(question: string, identityId: string): RetrievalResult {
  return {
    status: 'unsupported',
    question,
    identityId,
    answer: UNSUPPORTED_ANSWER,
    claims: [],
    citations: [],
    evidence: [],
    excludedEvidence: [],
    restrictedCandidateCount: 0,
    supersededCandidateCount: 0,
    trace: {
      queryId: null,
      candidatePassages: 0,
      inaccessiblePassagesRemoved: 0,
      supersededPassagesRemoved: 0,
      rankedEvidenceCount: 0,
      supportedClaimCount: 0,
      operations: [
        'query interpreted',
        'no supported demonstration question matched',
        'response refused',
      ],
    },
  }
}

export function retrieveKnowledge(
  model: KnowledgeModel,
  question: string,
  identityId: string,
): RetrievalResult {
  const identity: Identity | undefined = model.identities.find((item) => item.id === identityId)
  if (!identity) throw new Error(`Unknown identity: ${identityId}`)

  const query = matchQuery(model.queries, question)
  if (!query) return unsupportedResult(question, identityId)

  const candidates = candidatesFor(model, query)
  const permitted = candidates.filter(({ document }) => canAccessDocument(identity, document))
  const inaccessible = candidates.filter(({ document }) => !canAccessDocument(identity, document))
  const superseded = permitted.filter(({ document }) => document.status !== 'current')
  const current = permitted.filter(({ document }) => document.status === 'current')
  const evidence = rankCandidates(current)
  const { claims, citations } = buildClaims(query, evidence)
  const status = resultStatus(query, claims.length, inaccessible.length)

  const restrictedExclusions: readonly ExcludedEvidence[] = inaccessible.map(({ document }) => ({
    documentId: null,
    title: null,
    reason: 'restricted',
    versionLabel: null,
  }))
  const supersededExclusions: readonly ExcludedEvidence[] = superseded.map(({ document }) => ({
    documentId: document.id,
    title: document.title,
    reason: 'superseded',
    versionLabel: document.versionLabel,
  }))

  return {
    status,
    question,
    identityId,
    answer: answerFor(status, claims),
    claims,
    citations,
    evidence,
    excludedEvidence: [...restrictedExclusions, ...supersededExclusions],
    restrictedCandidateCount: inaccessible.length,
    supersededCandidateCount: superseded.length,
    trace: {
      queryId: query.id,
      candidatePassages: candidates.length,
      inaccessiblePassagesRemoved: inaccessible.length,
      supersededPassagesRemoved: superseded.length,
      rankedEvidenceCount: evidence.length,
      supportedClaimCount: claims.length,
      operations: [
        'query interpreted',
        'candidate passages retrieved',
        'source permissions applied',
        'superseded versions excluded',
        'current evidence ranked',
        status === 'supported' ? 'supported response assembled' :
          status === 'partially-supported' ? 'partial response assembled' :
            'response refused',
      ],
    },
  }
}
