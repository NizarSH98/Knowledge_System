import type { Department, Repository } from '../knowledge-model/types.ts'

export const organization = {
  id: 'org-asteria',
  name: 'Asteria Infrastructure Group',
  description:
    'A fictional 84-person infrastructure consultancy used only to demonstrate permission-aware organizational retrieval.',
  synthetic: true,
} as const

export const departments: readonly Department[] = [
  {
    id: 'dept-executive',
    name: 'Executive Office',
    mandate: 'Portfolio direction, governance, and institutional risk.',
  },
  {
    id: 'dept-operations',
    name: 'Operations',
    mandate: 'Project delivery, field coordination, and operating procedures.',
  },
  {
    id: 'dept-engineering',
    name: 'Engineering',
    mandate: 'Technical design, assurance, and systems integration.',
  },
  {
    id: 'dept-procurement',
    name: 'Procurement',
    mandate: 'Supplier evaluation, contracting, and commercial compliance.',
  },
  {
    id: 'dept-finance',
    name: 'Finance',
    mandate: 'Financial control, forecasting, and management reporting.',
  },
  {
    id: 'dept-safety',
    name: 'Safety & Quality',
    mandate: 'Safety assurance, quality systems, and incident learning.',
  },
  {
    id: 'dept-people',
    name: 'People & Administration',
    mandate: 'People operations, workplace services, and records.',
  },
]

export const repositories: readonly Repository[] = [
  {
    id: 'repo-projects',
    name: 'Project Library',
    system: 'Document management system',
    ownerDepartmentId: 'dept-operations',
    syncCadence: 'Every 30 minutes',
  },
  {
    id: 'repo-procurement',
    name: 'Procurement Vault',
    system: 'Controlled file repository',
    ownerDepartmentId: 'dept-procurement',
    syncCadence: 'On source change',
  },
  {
    id: 'repo-finance',
    name: 'Finance Records',
    system: 'Financial document store',
    ownerDepartmentId: 'dept-finance',
    syncCadence: 'Nightly',
  },
  {
    id: 'repo-engineering',
    name: 'Engineering Register',
    system: 'Technical records system',
    ownerDepartmentId: 'dept-engineering',
    syncCadence: 'Every hour',
  },
  {
    id: 'repo-meetings',
    name: 'Meeting Record',
    system: 'Team workspace',
    ownerDepartmentId: 'dept-operations',
    syncCadence: 'Every hour',
  },
  {
    id: 'repo-safety',
    name: 'Safety & Quality Manual',
    system: 'Quality management system',
    ownerDepartmentId: 'dept-safety',
    syncCadence: 'On source change',
  },
  {
    id: 'repo-suppliers',
    name: 'Supplier Register',
    system: 'Vendor management system',
    ownerDepartmentId: 'dept-procurement',
    syncCadence: 'Nightly',
  },
  {
    id: 'repo-people',
    name: 'People Directory',
    system: 'HR information system',
    ownerDepartmentId: 'dept-people',
    syncCadence: 'Nightly',
  },
  {
    id: 'repo-governance',
    name: 'Governance Archive',
    system: 'Records management system',
    ownerDepartmentId: 'dept-executive',
    syncCadence: 'Daily',
  },
]
