import type { KnowledgeModel, RetrievalResult } from '../../knowledge-model/types.ts'

interface SourceInspectorProps {
  readonly model: KnowledgeModel
  readonly result: RetrievalResult
  readonly documentId: string | null
  readonly onClose: () => void
}

export function SourceInspector({ model, result, documentId, onClose }: SourceInspectorProps) {
  const document = documentId ? model.documents.find((item) => item.id === documentId) : undefined
  const ranked = document ? result.evidence.filter((item) => item.document.id === document.id) : []
  const repository = document ? model.repositories.find((item) => item.id === document.repositoryId) : undefined
  const owner = document ? model.departments.find((item) => item.id === document.ownerDepartmentId) : undefined
  const decision = document ? model.decisions.find((item) => item.supportingDocumentIds.includes(document.id)) : undefined
  const project = decision ? model.projects.find((item) => item.id === decision.projectId) : undefined

  return (
    <aside className={`source-inspector ${document ? 'is-open' : ''}`} aria-live="polite" aria-label="Source influence inspector">
      <header>
        <p className="instrument-label">Reverse provenance</p>
        <button type="button" onClick={onClose}>Close</button>
      </header>
      {document ? (
        <>
          <span className="source-inspector__kind">{document.kind} / {document.versionLabel}</span>
          <h2>{document.title}</h2>
          <dl>
            <div><dt>Repository</dt><dd>{repository?.name}</dd></div>
            <div><dt>Owner</dt><dd>{owner?.name}</dd></div>
            <div><dt>State</dt><dd>{document.status}</dd></div>
            <div><dt>Ranked passages</dt><dd>{ranked.length}</dd></div>
          </dl>
          {ranked.map(({ passage, rank }) => (
            <blockquote key={passage.id}>
              <span>Evidence {String(rank).padStart(2, '0')} / {passage.locator}</span>
              <p>{passage.text}</p>
            </blockquote>
          ))}
          {decision && project ? (
            <div className="influence-chain" aria-label="What this record influences">
              <div><span>Source</span><strong>{document.title}</strong></div>
              <i><span>supports</span></i>
              <div><span>Decision</span><strong>Nova selection decision</strong></div>
              <i><span>affects</span></i>
              <div><span>Project</span><strong>{project.name} procurement</strong></div>
            </div>
          ) : (
            <p className="source-inspector__quiet">No declared downstream decision is connected to this source.</p>
          )}
        </>
      ) : (
        <p className="source-inspector__quiet">Choose a cited source to reverse the evidence path and inspect what it influences.</p>
      )}
    </aside>
  )
}
