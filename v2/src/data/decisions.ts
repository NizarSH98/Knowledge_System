import type { Decision } from '../knowledge-model/types.ts'

export const decisions: readonly Decision[] = [
  {
    id: 'decision-atlas-supplier',
    title: 'Select Nova Industrial for the Atlas materials-handling package',
    madeAt: '2026-03-14',
    projectId: 'project-atlas',
    outcome:
      'Nova Industrial was selected after the current evaluation combined technical compliance, the required delivery window, lifecycle support, and a revised commercial offer.',
    meetingId: 'meeting-atlas-gate-3',
    supportingDocumentIds: [
      'doc-atlas-evaluation-v4',
      'doc-atlas-gate-3-minutes',
      'doc-atlas-delivery-requirement',
      'doc-nova-revised-quotation',
      'doc-atlas-supplier-comparison',
    ],
  },
  {
    id: 'decision-beacon-controls',
    title: 'Approve the phased handover readiness plan for Beacon',
    madeAt: '2026-02-20',
    projectId: 'project-beacon',
    outcome: 'The phased handover sequence was approved with resource and assurance actions assigned before operational acceptance.',
    meetingId: 'meeting-beacon-controls',
    supportingDocumentIds: ['doc-routine-002', 'doc-routine-017'],
  },
]
