import type { Relationship } from '../knowledge-model/types.ts'
import { decisions } from './decisions.ts'
import { documents } from './documents.ts'
import { people } from './people.ts'
import { suppliers } from './suppliers.ts'

function relationship(
  sourceId: string,
  predicate: Relationship['predicate'],
  targetId: string,
  index: number,
): Relationship {
  return {
    id: `relationship-${predicate}-${String(index + 1).padStart(4, '0')}`,
    sourceId,
    predicate,
    targetId,
  }
}

const personProjectRelationships = people.flatMap((person, personIndex) =>
  person.projectIds.map((projectId, projectIndex) =>
    relationship(person.id, 'works_on', projectId, personIndex * 10 + projectIndex),
  ),
)

const personGroupRelationships = people.flatMap((person, personIndex) =>
  person.permissionGroupIds.map((groupId, groupIndex) =>
    relationship(person.id, 'member_of', groupId, 1000 + personIndex * 10 + groupIndex),
  ),
)

const projectDocumentRelationships = documents.flatMap((document, documentIndex) =>
  document.projectIds.map((projectId, projectIndex) =>
    relationship(projectId, 'references', document.id, 2000 + documentIndex * 10 + projectIndex),
  ),
)

const documentGroupRelationships = documents.flatMap((document, documentIndex) =>
  document.accessGroupIds.map((groupId, groupIndex) =>
    relationship(document.id, 'accessible_by', groupId, 4000 + documentIndex * 10 + groupIndex),
  ),
)

const supersessionRelationships = documents.flatMap((document, documentIndex) =>
  document.supersedesId
    ? [relationship(document.id, 'supersedes', document.supersedesId, 6000 + documentIndex)]
    : [],
)

const decisionRelationships = decisions.flatMap((decision, decisionIndex) => [
  relationship(decision.id, 'supported_by', decision.meetingId, 7000 + decisionIndex * 20),
  ...decision.supportingDocumentIds.map((documentId, documentIndex) =>
    relationship(
      decision.id,
      'supported_by',
      documentId,
      7001 + decisionIndex * 20 + documentIndex,
    ),
  ),
])

const supplierRelationships = suppliers.flatMap((supplier, supplierIndex) =>
  supplier.selectedProjectIds.map((projectId, projectIndex) =>
    relationship(
      supplier.id,
      'selected_for',
      projectId,
      8000 + supplierIndex * 10 + projectIndex,
    ),
  ),
)

export const relationships: readonly Relationship[] = [
  ...personProjectRelationships,
  ...personGroupRelationships,
  ...projectDocumentRelationships,
  ...documentGroupRelationships,
  ...supersessionRelationships,
  ...decisionRelationships,
  ...supplierRelationships,
]
