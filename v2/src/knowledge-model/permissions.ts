import type { DocumentRecord, Identity } from './types.ts'

export function canAccessDocument(
  identity: Identity,
  document: DocumentRecord,
): boolean {
  const grantedGroups = new Set(identity.permissionGroupIds)
  return document.accessGroupIds.some((groupId) => grantedGroups.has(groupId))
}

export function filterPermittedDocuments(
  identity: Identity,
  documents: readonly DocumentRecord[],
): readonly DocumentRecord[] {
  return documents.filter((document) => canAccessDocument(identity, document))
}
