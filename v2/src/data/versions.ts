import { documents } from './documents.ts'

export interface VersionFamilySummary {
  readonly id: string
  readonly documentIds: readonly string[]
  readonly currentDocumentId: string | null
}

const familyIds = [...new Set(documents.map((document) => document.versionFamilyId))]

export const versionFamilies: readonly VersionFamilySummary[] = familyIds.map(
  (familyId) => {
    const familyDocuments = documents
      .filter((document) => document.versionFamilyId === familyId)
      .toSorted((a, b) => a.version - b.version)

    return {
      id: familyId,
      documentIds: familyDocuments.map((document) => document.id),
      currentDocumentId:
        familyDocuments.find((document) => document.status === 'current')?.id ?? null,
    }
  },
)
