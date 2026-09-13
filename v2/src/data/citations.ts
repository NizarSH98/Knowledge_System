export interface EvidenceDefinition {
  readonly key: string
  readonly label: string
  readonly description: string
}

export const evidenceDefinitions: readonly EvidenceDefinition[] = [
  {
    key: 'atlas-technical-compliance',
    label: 'Technical compliance',
    description: 'Current technical, safety, and delivery assessment.',
  },
  {
    key: 'atlas-final-recommendation',
    label: 'Final evaluation recommendation',
    description: 'Current award recommendation retained in the evidence set.',
  },
  {
    key: 'atlas-supplier-comparison',
    label: 'Supplier comparison',
    description: 'Normalized comparison of the compliant finalists.',
  },
  {
    key: 'atlas-delivery-requirement',
    label: 'Delivery requirement',
    description: 'The project constraint that made delivery timing material.',
  },
  {
    key: 'atlas-revised-quotation',
    label: 'Revised quotation',
    description: 'The final commercial revision from Nova Industrial.',
  },
  {
    key: 'atlas-gate-minutes',
    label: 'Decision meeting',
    description: 'The approved record of the cross-functional recommendation.',
  },
  {
    key: 'atlas-obsolete-evaluation',
    label: 'Superseded evaluation',
    description: 'Historical material retained for lineage but excluded from current answers.',
  },
]
