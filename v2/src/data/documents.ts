import type { DocumentRecord, SourceKind } from '../knowledge-model/types.ts'
import { projects } from './projects.ts'

const atlasEvidenceDocuments: readonly DocumentRecord[] = [
  {
    id: 'doc-atlas-evaluation-v2',
    title: 'Atlas Supplier Evaluation',
    kind: 'assessment',
    repositoryId: 'repo-procurement',
    ownerDepartmentId: 'dept-procurement',
    ownerPersonId: 'person-4-02',
    projectIds: ['project-atlas'],
    versionFamilyId: 'version-family-atlas-evaluation',
    version: 2,
    versionLabel: 'v2',
    status: 'superseded',
    supersededById: 'doc-atlas-evaluation-v3',
    accessGroupIds: ['group-procurement', 'group-atlas-core'],
    createdAt: '2026-02-18',
    lastSynchronizedAt: '2026-03-14T10:40:00Z',
    passages: [
      {
        id: 'passage-atlas-evaluation-v2-summary',
        locator: 'Section 6 · Preliminary recommendation',
        evidenceKey: 'atlas-obsolete-evaluation',
        text: 'Preliminary scoring places Meridian Fabrication first. Nova Industrial remains non-compliant with the requested delivery date. This recommendation predates revised quotations and delivery confirmations.',
      },
    ],
  },
  {
    id: 'doc-atlas-evaluation-v3',
    title: 'Atlas Supplier Evaluation',
    kind: 'assessment',
    repositoryId: 'repo-procurement',
    ownerDepartmentId: 'dept-procurement',
    ownerPersonId: 'person-4-02',
    projectIds: ['project-atlas'],
    versionFamilyId: 'version-family-atlas-evaluation',
    version: 3,
    versionLabel: 'v3',
    status: 'superseded',
    supersedesId: 'doc-atlas-evaluation-v2',
    supersededById: 'doc-atlas-evaluation-v4',
    accessGroupIds: ['group-procurement', 'group-atlas-core'],
    createdAt: '2026-03-05',
    lastSynchronizedAt: '2026-03-14T10:40:00Z',
    passages: [
      {
        id: 'passage-atlas-evaluation-v3-summary',
        locator: 'Section 6 · Draft recommendation',
        evidenceKey: 'atlas-obsolete-evaluation',
        text: 'Nova Industrial now leads technically, but its commercial clarification and final manufacturing slot are still open. No award recommendation is made in this draft.',
      },
    ],
  },
  {
    id: 'doc-atlas-evaluation-v4',
    title: 'Atlas Supplier Evaluation',
    kind: 'assessment',
    repositoryId: 'repo-procurement',
    ownerDepartmentId: 'dept-procurement',
    ownerPersonId: 'person-4-02',
    projectIds: ['project-atlas'],
    versionFamilyId: 'version-family-atlas-evaluation',
    version: 4,
    versionLabel: 'v4 · current',
    status: 'current',
    supersedesId: 'doc-atlas-evaluation-v3',
    accessGroupIds: ['group-procurement', 'group-atlas-core'],
    createdAt: '2026-03-13',
    lastSynchronizedAt: '2026-03-14T10:40:00Z',
    passages: [
      {
        id: 'passage-atlas-evaluation-v4-compliance',
        locator: 'Section 4.2 · Mandatory criteria',
        evidenceKey: 'atlas-technical-compliance',
        text: 'Nova Industrial passed all mandatory technical and safety criteria. Its confirmed manufacturing plan provides delivery in 14 weeks, within the Atlas commissioning constraint.',
      },
      {
        id: 'passage-atlas-evaluation-v4-recommendation',
        locator: 'Section 6 · Final recommendation',
        evidenceKey: 'atlas-final-recommendation',
        text: 'The evaluation panel recommends Nova Industrial based on compliant scope, confirmed delivery, lifecycle support, and the final evaluated commercial position.',
      },
    ],
  },
  {
    id: 'doc-atlas-supplier-comparison',
    title: 'Atlas Final Supplier Comparison',
    kind: 'supplier-record',
    repositoryId: 'repo-suppliers',
    ownerDepartmentId: 'dept-procurement',
    ownerPersonId: 'person-4-04',
    projectIds: ['project-atlas'],
    versionFamilyId: 'version-family-atlas-comparison',
    version: 1,
    versionLabel: 'v1 · current',
    status: 'current',
    accessGroupIds: ['group-procurement'],
    createdAt: '2026-03-13',
    lastSynchronizedAt: '2026-03-14T09:10:00Z',
    passages: [
      {
        id: 'passage-atlas-comparison-score',
        locator: 'Table 3 · Evaluated position',
        evidenceKey: 'atlas-supplier-comparison',
        text: 'Nova Industrial ranked first after normalization of compliant scope, delivery risk, support coverage, and evaluated total. Meridian Fabrication ranked second because its earliest confirmed delivery missed the required window.',
      },
    ],
  },
  {
    id: 'doc-atlas-gate-3-minutes',
    title: 'Atlas Gate 3 Supplier Review Minutes',
    kind: 'meeting-minutes',
    repositoryId: 'repo-meetings',
    ownerDepartmentId: 'dept-operations',
    ownerPersonId: 'person-2-01',
    projectIds: ['project-atlas'],
    versionFamilyId: 'version-family-atlas-gate-3-minutes',
    version: 1,
    versionLabel: 'approved record',
    status: 'current',
    accessGroupIds: ['group-all-employees'],
    createdAt: '2026-03-12',
    lastSynchronizedAt: '2026-03-12T17:20:00Z',
    passages: [
      {
        id: 'passage-atlas-gate-3-decision',
        locator: 'Decision 03',
        evidenceKey: 'atlas-gate-minutes',
        text: 'Operations, Engineering, Procurement, and Finance unanimously recommended appointing Nova Industrial, subject to receipt of the revised quotation already requested.',
      },
    ],
  },
  {
    id: 'doc-atlas-delivery-requirement',
    title: 'Atlas Delivery and Commissioning Requirement',
    kind: 'project-record',
    repositoryId: 'repo-projects',
    ownerDepartmentId: 'dept-operations',
    ownerPersonId: 'person-2-03',
    projectIds: ['project-atlas'],
    versionFamilyId: 'version-family-atlas-delivery',
    version: 2,
    versionLabel: 'v2 · current',
    status: 'current',
    accessGroupIds: ['group-all-employees', 'group-operations'],
    createdAt: '2026-03-08',
    lastSynchronizedAt: '2026-03-14T08:05:00Z',
    passages: [
      {
        id: 'passage-atlas-delivery-window',
        locator: 'Requirement DR-07',
        evidenceKey: 'atlas-delivery-requirement',
        text: 'The materials-handling package must arrive no later than 22 June 2026 to protect the planned commissioning outage. A supplier plan beyond 14 weeks is not acceptable.',
      },
    ],
  },
  {
    id: 'doc-nova-revised-quotation',
    title: 'Nova Industrial Revised Quotation · Atlas',
    kind: 'quotation',
    repositoryId: 'repo-procurement',
    ownerDepartmentId: 'dept-procurement',
    ownerPersonId: 'person-4-02',
    projectIds: ['project-atlas'],
    versionFamilyId: 'version-family-nova-atlas-quotation',
    version: 2,
    versionLabel: 'revision B · current',
    status: 'current',
    accessGroupIds: ['group-procurement'],
    createdAt: '2026-03-13',
    lastSynchronizedAt: '2026-03-13T15:55:00Z',
    passages: [
      {
        id: 'passage-nova-revised-quotation',
        locator: 'Commercial clarification 2',
        evidenceKey: 'atlas-revised-quotation',
        text: 'Nova Industrial reduced the evaluated total by 6.2 percent while retaining commissioning support, critical spares, and the confirmed 14-week delivery plan.',
      },
    ],
  },
  {
    id: 'doc-atlas-cost-breakdown',
    title: 'Atlas Confidential Evaluated Cost Breakdown',
    kind: 'finance',
    repositoryId: 'repo-finance',
    ownerDepartmentId: 'dept-finance',
    ownerPersonId: 'person-5-02',
    projectIds: ['project-atlas'],
    versionFamilyId: 'version-family-atlas-cost-breakdown',
    version: 1,
    versionLabel: 'v1 · current',
    status: 'current',
    accessGroupIds: ['group-finance', 'group-procurement'],
    createdAt: '2026-03-13',
    lastSynchronizedAt: '2026-03-14T02:00:00Z',
    passages: [
      {
        id: 'passage-atlas-cost-breakdown',
        locator: 'Schedule 2 · Evaluated costs',
        text: 'Restricted line-item pricing, contingency allocation, and internal budget variance for the Atlas supplier award.',
      },
    ],
  },
]

interface RoutineTemplate {
  readonly code: string
  readonly title: string
  readonly kind: SourceKind
  readonly departmentId: string
  readonly repositoryId: string
  readonly accessGroupIds: readonly string[]
  readonly locator: string
  readonly summary: (projectName: string, projectCode: string) => string
}

const routineTemplates: readonly RoutineTemplate[] = [
  {
    code: 'WDR',
    title: 'Weekly Delivery Report',
    kind: 'project-record',
    departmentId: 'dept-operations',
    repositoryId: 'repo-projects',
    accessGroupIds: ['group-all-employees'],
    locator: 'Delivery summary',
    summary: (projectName) => `${projectName} remains within the approved delivery sequence. Two interface actions are open and assigned to the site coordination team.`,
  },
  {
    code: 'HOV',
    title: 'Handover Readiness Register',
    kind: 'project-record',
    departmentId: 'dept-operations',
    repositoryId: 'repo-projects',
    accessGroupIds: ['group-operations'],
    locator: 'Readiness overview',
    summary: (projectName) => `The ${projectName} handover register records accepted systems, outstanding evidence packs, responsible owners, and target closure dates.`,
  },
  {
    code: 'MOB',
    title: 'Site Mobilization Plan',
    kind: 'procedure',
    departmentId: 'dept-operations',
    repositoryId: 'repo-projects',
    accessGroupIds: ['group-operations'],
    locator: 'Section 3 · Mobilization sequence',
    summary: (projectName) => `${projectName} mobilization is sequenced through access approval, welfare setup, permit induction, temporary services, and supervisor sign-off.`,
  },
  {
    code: 'DBN',
    title: 'Design Basis Note',
    kind: 'project-record',
    departmentId: 'dept-engineering',
    repositoryId: 'repo-engineering',
    accessGroupIds: ['group-engineering'],
    locator: 'Section 2 · Design basis',
    summary: (projectName) => `The ${projectName} design basis records governing loads, operating envelopes, applicable standards, boundary conditions, and unresolved assumptions.`,
  },
  {
    code: 'INT',
    title: 'Technical Interface Register',
    kind: 'project-record',
    departmentId: 'dept-engineering',
    repositoryId: 'repo-engineering',
    accessGroupIds: ['group-engineering', 'group-operations'],
    locator: 'Open interfaces',
    summary: (projectName) => `${projectName} has three active cross-discipline interfaces awaiting confirmed connection data before design release.`,
  },
  {
    code: 'TQ',
    title: 'Technical Query Log',
    kind: 'decision-log',
    departmentId: 'dept-engineering',
    repositoryId: 'repo-engineering',
    accessGroupIds: ['group-engineering'],
    locator: 'Current query status',
    summary: (_projectName, projectCode) => `${projectCode} technical queries are recorded with discipline owner, response date, design impact, and the drawing revision that closes each item.`,
  },
  {
    code: 'ASR',
    title: 'Engineering Assurance Review',
    kind: 'assessment',
    departmentId: 'dept-engineering',
    repositoryId: 'repo-engineering',
    accessGroupIds: ['group-engineering', 'group-safety'],
    locator: 'Assurance conclusion',
    summary: (projectName) => `${projectName} may proceed to the next design gate once the noted maintainability evidence and independent calculation check are closed.`,
  },
  {
    code: 'SDD',
    title: 'Supplier Due Diligence Record',
    kind: 'supplier-record',
    departmentId: 'dept-procurement',
    repositoryId: 'repo-suppliers',
    accessGroupIds: ['group-procurement'],
    locator: 'Due diligence outcome',
    summary: (projectName) => `Due diligence for a ${projectName} bidder covers beneficial ownership, insurance, capacity, conflicts, sanctions screening, and reference checks.`,
  },
  {
    code: 'BCL',
    title: 'Bid Clarification Log',
    kind: 'supplier-record',
    departmentId: 'dept-procurement',
    repositoryId: 'repo-procurement',
    accessGroupIds: ['group-procurement'],
    locator: 'Clarification status',
    summary: (projectName) => `${projectName} commercial and technical clarifications are separated, assigned, and closed before the final comparison is issued.`,
  },
  {
    code: 'PO',
    title: 'Purchase Order Change Record',
    kind: 'contract',
    departmentId: 'dept-procurement',
    repositoryId: 'repo-procurement',
    accessGroupIds: ['group-procurement', 'group-finance'],
    locator: 'Change summary',
    summary: (projectName) => `The ${projectName} change record preserves the original instruction, supplier response, evaluated effect, delegated approval, and issued order revision.`,
  },
  {
    code: 'CST',
    title: 'Monthly Cost Report',
    kind: 'finance',
    departmentId: 'dept-finance',
    repositoryId: 'repo-finance',
    accessGroupIds: ['group-finance'],
    locator: 'Management summary',
    summary: (projectName) => `${projectName} actuals, commitments, approved changes, forecast-to-complete, and contingency movements are reconciled to the reporting cut-off.`,
  },
  {
    code: 'VAR',
    title: 'Forecast Variance Commentary',
    kind: 'finance',
    departmentId: 'dept-finance',
    repositoryId: 'repo-finance',
    accessGroupIds: ['group-finance', 'group-executive'],
    locator: 'Variance narrative',
    summary: (projectName) => `${projectName} forecast movements are attributed to approved scope, schedule effects, currency exposure, and remaining risk allowance.`,
  },
  {
    code: 'INV',
    title: 'Invoice Approval Record',
    kind: 'finance',
    departmentId: 'dept-finance',
    repositoryId: 'repo-finance',
    accessGroupIds: ['group-finance'],
    locator: 'Approval evidence',
    summary: (projectName) => `${projectName} invoice approval records receipt evidence, contract entitlement, tax review, cost coding, and delegated authority.`,
  },
  {
    code: 'RAMS',
    title: 'Method Statement Review',
    kind: 'safety',
    departmentId: 'dept-safety',
    repositoryId: 'repo-safety',
    accessGroupIds: ['group-safety', 'group-operations'],
    locator: 'Review disposition',
    summary: (projectName) => `${projectName} work may begin after lifting boundaries, energy isolation, rescue arrangements, and supervisor briefings are evidenced.`,
  },
  {
    code: 'OBS',
    title: 'Safety Observation Summary',
    kind: 'safety',
    departmentId: 'dept-safety',
    repositoryId: 'repo-safety',
    accessGroupIds: ['group-all-employees'],
    locator: 'Learning summary',
    summary: (projectName) => `${projectName} observations identify repeated housekeeping and access-route themes; local corrective actions have named owners and due dates.`,
  },
  {
    code: 'QAR',
    title: 'Quality Audit Action Register',
    kind: 'safety',
    departmentId: 'dept-safety',
    repositoryId: 'repo-safety',
    accessGroupIds: ['group-safety'],
    locator: 'Open actions',
    summary: (projectName) => `${projectName} audit actions track the requirement, objective evidence, accountable owner, planned correction, and effectiveness review.`,
  },
  {
    code: 'RSP',
    title: 'Project Resource Plan',
    kind: 'project-record',
    departmentId: 'dept-people',
    repositoryId: 'repo-people',
    accessGroupIds: ['group-people', 'group-operations-leads'],
    locator: 'Capacity summary',
    summary: (projectName) => `${projectName} role demand is mapped by month against confirmed assignments, recruitment dependencies, leave, and handover coverage.`,
  },
  {
    code: 'IND',
    title: 'Project Induction Checklist',
    kind: 'procedure',
    departmentId: 'dept-people',
    repositoryId: 'repo-people',
    accessGroupIds: ['group-all-employees'],
    locator: 'Required acknowledgements',
    summary: (projectName) => `${projectName} starters acknowledge project scope, information handling, escalation routes, site rules, and role-specific training.`,
  },
  {
    code: 'GTE',
    title: 'Portfolio Gate Review Memorandum',
    kind: 'decision-log',
    departmentId: 'dept-executive',
    repositoryId: 'repo-governance',
    accessGroupIds: ['group-executive', 'group-operations-leads'],
    locator: 'Gate decision',
    summary: (projectName) => `${projectName} gate status records the decision, conditions, accountable executive, accepted exposure, and evidence required at the next review.`,
  },
  {
    code: 'RSK',
    title: 'Portfolio Risk Committee Brief',
    kind: 'assessment',
    departmentId: 'dept-executive',
    repositoryId: 'repo-governance',
    accessGroupIds: ['group-executive'],
    locator: 'Risk committee summary',
    summary: (projectName) => `${projectName} material exposures are summarized with trend, control effectiveness, decision owner, and the next review trigger.`,
  },
]

const ownerPrefixByDepartment: Readonly<Record<string, number>> = {
  'dept-executive': 1,
  'dept-operations': 2,
  'dept-engineering': 3,
  'dept-procurement': 4,
  'dept-finance': 5,
  'dept-safety': 6,
  'dept-people': 7,
}

function recordDate(startedAt: string, index: number): string {
  const created = new Date(`${startedAt}T00:00:00Z`)
  created.setUTCDate(created.getUTCDate() + (Math.floor(index / projects.length) + 1) * 21 + (index % 9))
  return created.toISOString().slice(0, 10)
}

function buildRoutineDocument(index: number): DocumentRecord {
  const project = projects[index % projects.length]
  const template = routineTemplates[index % routineTemplates.length]

  if (!project || !template) {
    throw new Error(`Unable to generate routine document ${index}`)
  }

  const numericId = String(index + 1).padStart(3, '0')
  const ownerPrefix = ownerPrefixByDepartment[template.departmentId]

  if (!ownerPrefix) {
    throw new Error(`Missing document owner routing for ${template.departmentId}`)
  }

  return {
    id: `doc-routine-${numericId}`,
    title: `${project.name} · ${template.title} · ${project.code}-${template.code}-${numericId}`,
    kind: template.kind,
    repositoryId: template.repositoryId,
    ownerDepartmentId: template.departmentId,
    ownerPersonId: `person-${ownerPrefix}-${String((index % 12) + 1).padStart(2, '0')}`,
    projectIds: [project.id],
    versionFamilyId: `version-family-routine-${numericId}`,
    version: 1,
    versionLabel: 'v1 · current',
    status: 'current',
    accessGroupIds: template.accessGroupIds,
    createdAt: recordDate(project.startedAt, index),
    lastSynchronizedAt: `2026-09-1${index % 3}T${String(8 + (index % 10)).padStart(2, '0')}:00:00Z`,
    passages: [
      {
        id: `passage-routine-${numericId}`,
        locator: template.locator,
        text: template.summary(project.name, project.code),
      },
    ],
  }
}

const routineDocuments = Array.from(
  { length: 120 },
  (_, index) => buildRoutineDocument(index),
)

export const documents: readonly DocumentRecord[] = [
  ...atlasEvidenceDocuments,
  ...routineDocuments,
]
