import type { Identity, PermissionGroup } from '../knowledge-model/types.ts'

export const permissionGroups: readonly PermissionGroup[] = [
  {
    id: 'group-all-employees',
    name: 'All Employees',
    description: 'Material approved for the whole organization.',
  },
  {
    id: 'group-operations',
    name: 'Operations',
    description: 'Operational project records and delivery procedures.',
  },
  {
    id: 'group-operations-leads',
    name: 'Operations Leadership',
    description: 'Operational management and portfolio delivery records.',
  },
  {
    id: 'group-engineering',
    name: 'Engineering',
    description: 'Technical records and engineering assurance material.',
  },
  {
    id: 'group-procurement',
    name: 'Procurement',
    description: 'Commercial evaluations, quotations, and supplier records.',
  },
  {
    id: 'group-finance',
    name: 'Finance',
    description: 'Financial material with restricted commercial detail.',
  },
  {
    id: 'group-safety',
    name: 'Safety & Quality',
    description: 'Safety controls and quality management records.',
  },
  {
    id: 'group-atlas-core',
    name: 'Project Atlas Core Team',
    description: 'Cross-functional records for the Atlas delivery team.',
  },
  {
    id: 'group-executive',
    name: 'Executive Office',
    description: 'Board, risk, and institutional governance records.',
  },
  {
    id: 'group-people',
    name: 'People & Administration',
    description: 'Personnel and administrative material.',
  },
]

export const identities: readonly Identity[] = [
  {
    id: 'identity-general',
    label: 'General Employee',
    role: 'Project Coordinator',
    permissionGroupIds: ['group-all-employees'],
  },
  {
    id: 'identity-operations',
    label: 'Operations Manager',
    role: 'Operations Manager',
    permissionGroupIds: [
      'group-all-employees',
      'group-operations',
      'group-operations-leads',
      'group-atlas-core',
      'group-safety',
    ],
  },
  {
    id: 'identity-procurement',
    label: 'Procurement Officer',
    role: 'Senior Procurement Officer',
    permissionGroupIds: [
      'group-all-employees',
      'group-procurement',
      'group-atlas-core',
    ],
  },
]
