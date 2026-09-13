import type { KnowledgeModel, RetrievalStatus } from './types.ts'
import { resolveProvenance } from './provenance.ts'
import { retrieveKnowledge } from './retrieval.ts'

export interface ModelValidationReport {
  readonly counts: {
    readonly departments: number
    readonly people: number
    readonly projects: number
    readonly documents: number
    readonly repositories: number
    readonly relationships: number
  }
  readonly scenarioStatuses: Readonly<Record<string, RetrievalStatus>>
  readonly errors: readonly string[]
}

function duplicateIds(ids: readonly string[]): readonly string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id)
    seen.add(id)
  }
  return [...duplicates]
}

export function validateKnowledgeModel(
  model: KnowledgeModel,
  canonicalQuestion: string,
  unsupportedQuestion: string,
): ModelValidationReport {
  const errors: string[] = []
  const entityIds = [
    model.organization.id,
    ...model.departments.map(({ id }) => id),
    ...model.permissionGroups.map(({ id }) => id),
    ...model.identities.map(({ id }) => id),
    ...model.people.map(({ id }) => id),
    ...model.projects.map(({ id }) => id),
    ...model.repositories.map(({ id }) => id),
    ...model.documents.map(({ id }) => id),
    ...model.meetings.map(({ id }) => id),
    ...model.decisions.map(({ id }) => id),
    ...model.suppliers.map(({ id }) => id),
  ]
  const knownIds = new Set(entityIds)

  for (const id of duplicateIds(entityIds)) errors.push(`Duplicate entity id: ${id}`)
  for (const id of duplicateIds(model.relationships.map(({ id }) => id))) {
    errors.push(`Duplicate relationship id: ${id}`)
  }

  for (const relationship of model.relationships) {
    if (!knownIds.has(relationship.sourceId)) {
      errors.push(`Unknown relationship source: ${relationship.sourceId}`)
    }
    if (!knownIds.has(relationship.targetId)) {
      errors.push(`Unknown relationship target: ${relationship.targetId}`)
    }
  }

  for (const document of model.documents) {
    if (!knownIds.has(document.repositoryId)) {
      errors.push(`Unknown repository on ${document.id}: ${document.repositoryId}`)
    }
    if (!knownIds.has(document.ownerDepartmentId)) {
      errors.push(`Unknown owner department on ${document.id}: ${document.ownerDepartmentId}`)
    }
    if (document.ownerPersonId && !knownIds.has(document.ownerPersonId)) {
      errors.push(`Unknown owner person on ${document.id}: ${document.ownerPersonId}`)
    }
    for (const projectId of document.projectIds) {
      if (!knownIds.has(projectId)) errors.push(`Unknown project on ${document.id}: ${projectId}`)
    }
    for (const groupId of document.accessGroupIds) {
      if (!knownIds.has(groupId)) errors.push(`Unknown access group on ${document.id}: ${groupId}`)
    }
    if (document.supersedesId && !knownIds.has(document.supersedesId)) {
      errors.push(`Unknown superseded document on ${document.id}: ${document.supersedesId}`)
    }
    if (document.supersededById && !knownIds.has(document.supersededById)) {
      errors.push(`Unknown replacement document on ${document.id}: ${document.supersededById}`)
    }
  }

  for (const meeting of model.meetings) {
    const meetingDocument = model.documents.find(({ id }) => id === meeting.documentId)
    if (!meetingDocument) {
      errors.push(`Unknown meeting document on ${meeting.id}: ${meeting.documentId}`)
    } else if (!meetingDocument.projectIds.includes(meeting.projectId)) {
      errors.push(`Meeting document ${meeting.documentId} is not linked to ${meeting.projectId}`)
    }
    for (const attendeeId of meeting.attendeeIds) {
      if (!knownIds.has(attendeeId)) errors.push(`Unknown attendee on ${meeting.id}: ${attendeeId}`)
    }
  }

  for (const decision of model.decisions) {
    if (!knownIds.has(decision.meetingId)) {
      errors.push(`Unknown meeting on ${decision.id}: ${decision.meetingId}`)
    }
    for (const documentId of decision.supportingDocumentIds) {
      if (!knownIds.has(documentId)) {
        errors.push(`Unknown supporting document on ${decision.id}: ${documentId}`)
      }
    }
  }

  const versionFamilyIds = [...new Set(model.documents.map(({ versionFamilyId }) => versionFamilyId))]
  for (const familyId of versionFamilyIds) {
    const currentCount = model.documents.filter(
      (document) => document.versionFamilyId === familyId && document.status === 'current',
    ).length
    if (currentCount !== 1) errors.push(`${familyId} has ${currentCount} current versions`)
  }

  if (model.people.length < 70 || model.people.length > 100) {
    errors.push(`Expected 70–100 people; found ${model.people.length}`)
  }
  if (model.departments.length < 6 || model.departments.length > 8) {
    errors.push(`Expected 6–8 departments; found ${model.departments.length}`)
  }
  if (model.projects.length < 10 || model.projects.length > 20) {
    errors.push(`Expected 10–20 projects; found ${model.projects.length}`)
  }
  if (model.documents.length < 100) {
    errors.push(`Expected at least 100 documents; found ${model.documents.length}`)
  }

  const general = retrieveKnowledge(model, canonicalQuestion, 'identity-general')
  const operations = retrieveKnowledge(model, canonicalQuestion, 'identity-operations')
  const procurement = retrieveKnowledge(model, canonicalQuestion, 'identity-procurement')
  const unsupported = retrieveKnowledge(model, unsupportedQuestion, 'identity-procurement')
  const scenarioStatuses = {
    general: general.status,
    operations: operations.status,
    procurement: procurement.status,
    unsupported: unsupported.status,
  } as const

  const expectedStatuses: typeof scenarioStatuses = {
    general: 'insufficient-permissions',
    operations: 'partially-supported',
    procurement: 'supported',
    unsupported: 'unsupported',
  }
  for (const [scenario, expected] of Object.entries(expectedStatuses)) {
    const actual = scenarioStatuses[scenario as keyof typeof scenarioStatuses]
    if (actual !== expected) errors.push(`${scenario} scenario is ${actual}; expected ${expected}`)
  }


  if (procurement.claims.length !== 4) {
    errors.push(`Procurement scenario supports ${procurement.claims.length} claims; expected 4`)
  }
  if (general.restrictedCandidateCount === 0) {
    errors.push('General scenario does not expose a concealed restriction state')
  }
  if (procurement.supersededCandidateCount < 2) {
    errors.push('Procurement scenario does not expose both superseded Atlas evaluations')
  }
  for (const citation of procurement.citations) {
    if (!resolveProvenance(model, citation)) {
      errors.push(`Citation does not resolve through provenance: ${citation.id}`)
    }
  }

  return {
    counts: {
      departments: model.departments.length,
      people: model.people.length,
      projects: model.projects.length,
      documents: model.documents.length,
      repositories: model.repositories.length,
      relationships: model.relationships.length,
    },
    scenarioStatuses,
    errors,
  }
}
