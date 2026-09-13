import type { KnowledgeModel, Relationship } from './types.ts'

export interface GraphNeighbor {
  readonly entityId: string
  readonly relationship: Relationship
  readonly direction: 'incoming' | 'outgoing'
}

export function neighborsOf(
  model: KnowledgeModel,
  entityId: string,
): readonly GraphNeighbor[] {
  return model.relationships.flatMap<GraphNeighbor>((relationship) => {
    if (relationship.sourceId === entityId) {
      return [{ entityId: relationship.targetId, relationship, direction: 'outgoing' as const }]
    }
    if (relationship.targetId === entityId) {
      return [{ entityId: relationship.sourceId, relationship, direction: 'incoming' as const }]
    }
    return []
  })
}

export function relationshipsBetween(
  model: KnowledgeModel,
  firstEntityId: string,
  secondEntityId: string,
): readonly Relationship[] {
  return model.relationships.filter(
    (relationship) =>
      (relationship.sourceId === firstEntityId && relationship.targetId === secondEntityId) ||
      (relationship.sourceId === secondEntityId && relationship.targetId === firstEntityId),
  )
}
