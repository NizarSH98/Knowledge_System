import type { Person } from '../knowledge-model/types.ts'
import { departments } from './organization.ts'
import { projects } from './projects.ts'

const firstNames = [
  'Amal',
  'Theo',
  'Mina',
  'Sofia',
  'Idris',
  'Leila',
  'Jonas',
  'Nadia',
  'Ravi',
  'Elena',
  'Samir',
  'Marta',
] as const

const familyNames = [
  'Vale',
  'Rowan',
  'Sayegh',
  'Keller',
  'Nouri',
  'Marin',
  'Bennett',
  'Okafor',
  'Haddad',
  'Petrov',
  'Costa',
  'Ibrahim',
  'Chen',
  'Dubois',
  'Rahman',
  'Varga',
  'Silva',
  'Lind',
] as const

const rolesByDepartment: Readonly<Record<string, readonly string[]>> = {
  'dept-executive': [
    'Managing Director',
    'Portfolio Director',
    'Chief of Staff',
    'Governance Manager',
  ],
  'dept-operations': [
    'Operations Director',
    'Program Manager',
    'Project Manager',
    'Project Coordinator',
  ],
  'dept-engineering': [
    'Engineering Director',
    'Lead Systems Engineer',
    'Mechanical Engineer',
    'Controls Engineer',
  ],
  'dept-procurement': [
    'Procurement Director',
    'Senior Procurement Officer',
    'Category Manager',
    'Commercial Analyst',
  ],
  'dept-finance': [
    'Finance Director',
    'Commercial Controller',
    'Project Accountant',
    'Financial Analyst',
  ],
  'dept-safety': [
    'Safety & Quality Director',
    'Safety Manager',
    'Quality Engineer',
    'Field Safety Advisor',
  ],
  'dept-people': [
    'People Director',
    'People Operations Manager',
    'Workplace Coordinator',
    'Records Administrator',
  ],
}

const groupByDepartment: Readonly<Record<string, string>> = {
  'dept-executive': 'group-executive',
  'dept-operations': 'group-operations',
  'dept-engineering': 'group-engineering',
  'dept-procurement': 'group-procurement',
  'dept-finance': 'group-finance',
  'dept-safety': 'group-safety',
  'dept-people': 'group-people',
}

function assignedProjects(departmentId: string, offset: number): readonly string[] {
  const eligible = projects.filter((project) => project.departmentIds.includes(departmentId))
  const first = eligible[offset % eligible.length]
  const second = eligible[(offset + 2) % eligible.length]
  return [...new Set([first?.id, second?.id].filter((id): id is string => Boolean(id)))]
}

export const people: readonly Person[] = departments.flatMap(
  (department, departmentIndex) => {
    const roles = rolesByDepartment[department.id]
    const departmentGroup = groupByDepartment[department.id]

    if (!roles || !departmentGroup) {
      throw new Error(`Missing people configuration for ${department.id}`)
    }

    return firstNames.map((firstName, personIndex) => {
      const projectIds = assignedProjects(department.id, personIndex)
      const permissionGroupIds = ['group-all-employees', departmentGroup]

      if (projectIds.includes('project-atlas')) permissionGroupIds.push('group-atlas-core')
      if (department.id === 'dept-operations' && personIndex < 3) {
        permissionGroupIds.push('group-operations-leads')
      }

      return {
        id: `person-${departmentIndex + 1}-${String(personIndex + 1).padStart(2, '0')}`,
        name: `${firstName} ${familyNames[(departmentIndex * 5 + personIndex) % familyNames.length]}`,
        role: roles[personIndex % roles.length] ?? 'Specialist',
        departmentId: department.id,
        projectIds,
        permissionGroupIds,
      }
    })
  },
)
