import type { DocumentRecord } from './types.ts'

export function currentDocuments(
  documents: readonly DocumentRecord[],
): readonly DocumentRecord[] {
  return documents.filter((document) => document.status === 'current')
}

export function versionHistory(
  documents: readonly DocumentRecord[],
  versionFamilyId: string,
): readonly DocumentRecord[] {
  return documents
    .filter((document) => document.versionFamilyId === versionFamilyId)
    .toSorted((a, b) => b.version - a.version)
}

export function currentVersion(
  documents: readonly DocumentRecord[],
  versionFamilyId: string,
): DocumentRecord | undefined {
  return versionHistory(documents, versionFamilyId).find(
    (document) => document.status === 'current',
  )
}
