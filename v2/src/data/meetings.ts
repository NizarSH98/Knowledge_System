import type { Meeting } from '../knowledge-model/types.ts'

export const meetings: readonly Meeting[] = [
  {
    id: 'meeting-atlas-gate-3',
    title: 'Atlas Gate 3 Supplier Review',
    date: '2026-03-12',
    projectId: 'project-atlas',
    attendeeIds: ['person-2-01', 'person-3-02', 'person-4-01', 'person-5-02'],
    documentId: 'doc-atlas-gate-3-minutes',
  },
  {
    id: 'meeting-atlas-delivery',
    title: 'Atlas Delivery Constraint Review',
    date: '2026-03-08',
    projectId: 'project-atlas',
    attendeeIds: ['person-2-01', 'person-3-03', 'person-6-02'],
    documentId: 'doc-atlas-delivery-requirement',
  },
  {
    id: 'meeting-beacon-controls',
    title: 'Beacon Handover Readiness Review',
    date: '2026-02-19',
    projectId: 'project-beacon',
    attendeeIds: ['person-2-03', 'person-3-04'],
    documentId: 'doc-routine-002',
  },
]
