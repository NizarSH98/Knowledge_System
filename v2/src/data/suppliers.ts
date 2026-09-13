import type { Supplier } from '../knowledge-model/types.ts'

export const suppliers: readonly Supplier[] = [
  {
    id: 'supplier-nova',
    name: 'Nova Industrial',
    summary: 'Fictional industrial equipment supplier selected for Project Atlas.',
    selectedProjectIds: ['project-atlas'],
  },
  {
    id: 'supplier-meridian',
    name: 'Meridian Fabrication',
    summary: 'Fictional shortlisted fabricator with a longer delivery schedule.',
    selectedProjectIds: [],
  },
  {
    id: 'supplier-cairn',
    name: 'Cairn Technical Works',
    summary: 'Fictional regional supplier retained for maintenance frameworks.',
    selectedProjectIds: ['project-meridian'],
  },
  {
    id: 'supplier-solace',
    name: 'Solace Controls',
    summary: 'Fictional controls integrator used on Project Beacon.',
    selectedProjectIds: ['project-beacon'],
  },
  {
    id: 'supplier-verdant',
    name: 'Verdant Safety Systems',
    summary: 'Fictional safety equipment provider used on Project Lumen.',
    selectedProjectIds: ['project-lumen'],
  },
]
