import type {
  Citation,
  DocumentRecord,
  KnowledgeModel,
  Passage,
} from './types.ts'

export interface ProvenanceChain {
  readonly citation: Citation
  readonly passage: Passage
  readonly document: DocumentRecord
  readonly repositoryName: string
  readonly ownerDepartmentName: string
}

export function resolveProvenance(
  model: KnowledgeModel,
  citation: Citation,
): ProvenanceChain | undefined {
  const document = model.documents.find((item) => item.id === citation.documentId)
  const passage = document?.passages.find((item) => item.id === citation.passageId)
  const repository = document
    ? model.repositories.find((item) => item.id === document.repositoryId)
    : undefined
  const department = document
    ? model.departments.find((item) => item.id === document.ownerDepartmentId)
    : undefined

  if (!document || !passage || !repository || !department) return undefined

  return {
    citation,
    passage,
    document,
    repositoryName: repository.name,
    ownerDepartmentName: department.name,
  }
}
