import { useMemo } from 'react'
import type { Identity, KnowledgeModel, RetrievalResult } from '../../knowledge-model/types.ts'
import {
  atlasProjection,
  evidenceProjection,
  entitySummary,
  organizationProjection,
  type ObservatoryNode,
  type ObservatoryScale,
  type QueryStage,
} from './model.ts'

interface ObservatoryMapProps {
  readonly model: KnowledgeModel
  readonly identity: Identity
  readonly scale: ObservatoryScale
  readonly queryStage: QueryStage
  readonly result: RetrievalResult
  readonly selectedEntityId: string | null
  readonly onSelect: (entityId: string | null) => void
}

function nodeShape(node: ObservatoryNode) {
  if (node.concealed) {
    return (
      <g className="space-node__concealed">
        <circle r="7" />
        <path d="M-3.5 -3.5 3.5 3.5M3.5 -3.5-3.5 3.5" />
      </g>
    )
  }
  if (node.kind === 'department') return <circle r="76" className="space-node__field" />
  if (node.kind === 'project') return <rect x="-10" y="-10" width="20" height="20" rx="2" transform="rotate(45)" />
  if (node.kind === 'repository') return <rect x="-7" y="-7" width="14" height="14" />
  if (node.kind === 'decision') return <path d="M0-13 13 0 0 13-13 0Z" />
  if (node.kind === 'person') return <circle r="5" />
  if (node.kind === 'passage') return <rect x="-9" y="-3" width="18" height="6" rx="3" />
  return <circle r={node.queryRelevant ? 4 : 2.5} />
}

function labelVisible(node: ObservatoryNode, scale: ObservatoryScale, selected: boolean): boolean {
  if (node.concealed) return false
  if (selected || node.entityId === 'project-atlas') return true
  if (scale === 'organization') return node.kind === 'department' || node.kind === 'repository'
  if (node.kind === 'document') return selected || (scale === 'evidence' && node.queryRelevant)
  if (node.kind === 'passage' || node.kind === 'person') return selected
  return true
}

export function ObservatoryMap({
  model,
  identity,
  scale,
  queryStage,
  result,
  selectedEntityId,
  onSelect,
}: ObservatoryMapProps) {
  const projection = useMemo(
    () => scale === 'organization'
      ? organizationProjection(model, identity)
      : scale === 'relationship'
        ? atlasProjection(model, identity)
        : evidenceProjection(model, identity),
    [identity, model, scale],
  )
  const nodeById = new Map(projection.nodes.map((node) => [node.id, node]))
  const queryActive = queryStage !== 'idle'
  const evidenceIds = new Set(result.evidence.map(({ document }) => document.id))
  const selectedNode = selectedEntityId
    ? projection.nodes.find((node) => node.entityId === selectedEntityId)
    : undefined
  const summary = entitySummary(model, selectedEntityId)
  const atlasPeople = model.people.filter((person) => person.projectIds.includes('project-atlas')).length
  const atlasRecords = model.documents.filter((document) => document.projectIds.includes('project-atlas')).length
  const atlasRepositories = new Set(model.documents.filter((document) => document.projectIds.includes('project-atlas')).map((document) => document.repositoryId)).size
  const concealedCount = projection.nodes.filter((node) => node.concealed).length

  return (
    <section className={`observatory-space observatory-space--${scale}`} aria-labelledby="space-title">
      <header className="space-header">
        <div>
          <p className="instrument-label">Information space / {scale}</p>
          <h2 id="space-title">
            {scale === 'organization' ? 'Asteria, structurally observed' : scale === 'relationship' ? 'Project Atlas relationship field' : 'Atlas evidence field'}
          </h2>
        </div>
        <div className="space-legend" aria-label="Map legend">
          <span><i data-kind="department" />Department field</span>
          <span><i data-kind="project" />Project</span>
          <span><i data-kind="repository" />Repository</span>
          <span><i data-kind="document" />Record</span>
        </div>
      </header>

      <div className="space-stage">
        <svg viewBox="0 0 1200 700" role="img" aria-labelledby="space-map-title space-map-description">
          <title id="space-map-title">Semantic map of Asteria Infrastructure Group knowledge</title>
          <desc id="space-map-description">Departments form stable fields. Projects sit between the departments that deliver them. Repositories orbit their owners and documents remain grouped by owning department. Project Atlas can be inspected at relationship and evidence scales.</desc>
          <defs>
            <pattern id="access-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
              <line x1="0" y1="0" x2="0" y2="10" />
            </pattern>
          </defs>

          <g className="space-grid" aria-hidden="true">
            <path d="M60 115H1140M60 350H1140M60 585H1140" />
            <path d="M200 50V650M600 50V650M1000 50V650" />
            <circle cx="600" cy="350" r="258" />
          </g>

          {scale !== 'organization' && concealedCount > 0 ? (
            <g className="access-horizon" aria-label={`${concealedCount} project records are beyond this identity's access horizon`}>
              <path d="M1018 116 Q1126 350 1018 584 L1190 642V60Z" />
              <text x="1088" y="92">ACCESS HORIZON</text>
              <text x="1088" y="112">{String(concealedCount).padStart(2, '0')} unresolved</text>
            </g>
          ) : null}

          <g className="space-edges" aria-hidden="true">
            {projection.edges.map((edge) => {
              const source = nodeById.get(edge.sourceId)
              const target = nodeById.get(edge.targetId)
              if (!source || !target) return null
              return (
                <line
                  key={edge.id}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  className={queryActive && edge.queryRelevant ? 'is-query-path' : ''}
                />
              )
            })}
          </g>

          <g className="space-nodes">
            {projection.nodes.map((node) => {
              const selected = node.entityId === selectedEntityId
              const evidence = node.entityId ? evidenceIds.has(node.entityId) : false
              const dimmed = queryActive && queryStage !== 'records' && !node.queryRelevant && node.entityId !== 'project-atlas'
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x} ${node.y})`}
                  className={[
                    'space-node', `space-node--${node.kind}`, `space-node--${node.status}`,
                    node.queryRelevant ? 'is-query-relevant' : '', evidence ? 'is-evidence' : '',
                    selected ? 'is-selected' : '', dimmed ? 'is-dimmed' : '', node.concealed ? 'is-concealed' : '',
                  ].filter(Boolean).join(' ')}
                  role="button"
                  tabIndex={node.kind === 'document' && !node.accessible ? -1 : 0}
                  aria-label={`${node.label}, ${node.kind}${node.status !== 'neutral' ? `, ${node.status}` : ''}`}
                  onClick={() => node.accessible && onSelect(node.entityId)}
                  onKeyDown={(event) => {
                    if (node.accessible && (event.key === 'Enter' || event.key === ' ')) {
                      event.preventDefault()
                      onSelect(node.entityId)
                    }
                  }}
                >
                  {nodeShape(node)}
                  {labelVisible(node, scale, selected) ? (
                    <text
                      className="space-node__label"
                      y={node.kind === 'department' ? -88 : node.kind === 'project' && scale === 'evidence' ? -18 : 22}
                      textAnchor="middle"
                    >
                      {node.kind === 'repository' || (node.kind === 'decision' && !selected) || (node.kind === 'document' && scale === 'evidence' && !selected) ? node.shortLabel : node.label}
                    </text>
                  ) : null}
                  {node.kind === 'department' ? (
                    <text className="space-node__count" y="4" textAnchor="middle">
                      {String(
                        scale === 'organization'
                          ? model.documents.filter((document) => document.ownerDepartmentId === node.entityId).length
                          : model.people.filter((person) => person.departmentId === node.entityId && person.projectIds.includes('project-atlas')).length,
                      ).padStart(2, '0')}
                    </text>
                  ) : null}
                </g>
              )
            })}
          </g>

          {selectedNode?.entityId === 'project-atlas' ? (
            <g className="focus-lens" aria-hidden="true">
              <circle cx={selectedNode.x} cy={selectedNode.y} r={scale === 'organization' ? 92 : 118} />
              <path d={`M${selectedNode.x - 112} ${selectedNode.y}H${selectedNode.x + 112}M${selectedNode.x} ${selectedNode.y - 112}V${selectedNode.y + 112}`} />
            </g>
          ) : null}
        </svg>

        <aside className={`focus-readout ${selectedEntityId ? 'is-open' : ''}`} aria-live="polite">
          <div className="focus-readout__head">
            <p className="instrument-label">Focus lens</p>
            {selectedEntityId ? (
              <button type="button" onClick={() => onSelect(null)} aria-label="Close focus lens">Close</button>
            ) : null}
          </div>
          {selectedEntityId === 'project-atlas' ? (
            <>
              <strong>Project Atlas</strong>
              <span>ATL-26 / active</span>
              <dl className="lens-metrics">
                <div><dt>People</dt><dd>{atlasPeople}</dd></div>
                <div><dt>Decisions</dt><dd>{model.decisions.filter((decision) => decision.projectId === 'project-atlas').length}</dd></div>
                <div><dt>Records</dt><dd>{atlasRecords}</dd></div>
                <div><dt>Repositories</dt><dd>{atlasRepositories}</dd></div>
                <div><dt>Current evidence</dt><dd>{result.evidence.length}</dd></div>
                <div><dt>Restricted</dt><dd>{result.restrictedCandidateCount}</dd></div>
                <div><dt>Superseded</dt><dd>{result.supersededCandidateCount}</dd></div>
              </dl>
            </>
          ) : selectedNode ? (
            <>
              <strong>{selectedNode.label}</strong>
              <span>{selectedNode.kind}</span>
              <dl className="entity-summary">
                {summary.map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}
              </dl>
            </>
          ) : (
            <>
              <strong>No local field selected</strong>
              <span>Select a department, project, repository, person, decision, or accessible record.</span>
            </>
          )}
        </aside>
      </div>
    </section>
  )
}
