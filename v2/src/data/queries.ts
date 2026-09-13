import type { QueryDefinition } from '../knowledge-model/types.ts'

export const CANONICAL_QUESTION =
  'Why was Nova Industrial selected for Project Atlas?'

export const UNSUPPORTED_QUESTION =
  'What will Project Atlas cost to operate in 2030?'

export const queries: readonly QueryDefinition[] = [
  {
    id: 'query-atlas-supplier-selection',
    canonicalText: CANONICAL_QUESTION,
    aliases: [
      'Why did Asteria choose Nova for Atlas?',
      'Explain the Atlas supplier decision.',
    ],
    keywords: ['nova', 'industrial', 'atlas', 'supplier', 'selected', 'selection'],
    claims: [
      {
        id: 'claim-compliant',
        text: 'Nova satisfied every mandatory technical and safety criterion in the final evaluation.',
        evidenceKeys: ['atlas-technical-compliance', 'atlas-supplier-comparison'],
        minimumEvidenceCount: 1,
      },
      {
        id: 'claim-delivery',
        text: 'Its confirmed 14-week delivery met the commissioning window; the other finalist could not meet that date.',
        evidenceKeys: ['atlas-delivery-requirement', 'atlas-technical-compliance'],
        minimumEvidenceCount: 2,
      },
      {
        id: 'claim-commercial',
        text: 'A revised quotation reduced Nova’s evaluated total while preserving the required support package.',
        evidenceKeys: ['atlas-revised-quotation', 'atlas-supplier-comparison'],
        minimumEvidenceCount: 2,
      },
      {
        id: 'claim-recorded-decision',
        text: 'The cross-functional Gate 3 review recorded a unanimous recommendation to appoint Nova Industrial.',
        evidenceKeys: ['atlas-gate-minutes'],
        minimumEvidenceCount: 1,
      },
    ],
    minimumSupportedClaims: 3,
  },
]
