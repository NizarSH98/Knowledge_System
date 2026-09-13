import { canAccessDocument } from '../../knowledge-model/permissions.ts'
import type {
  DocumentRecord,
  Identity,
  KnowledgeModel,
  RecordStatus,
} from '../../knowledge-model/types.ts'

export type ObservatoryScale = 'organization' | 'relationship' | 'evidence'
export type ObservatoryNodeKind = 'department' | 'repository' | 'project' | 'person' | 'decision' | 'document' | 'passage'
export type QueryStage = 'idle' | 'records' | 'candidates' | 'permissions' | 'versions' | 'evidence' | 'resolved'

export interface ObservatoryNode {
  readonly id: string
  readonly entityId: string | null
  readonly label: string
  readonly shortLabel: string
  readonly kind: ObservatoryNodeKind
  readonly x: number
  readonly y: number
  readonly clusterId: string | null
  readonly accessible: boolean
  readonly concealed: boolean
  readonly status: RecordStatus | 'active' | 'complete' | 'paused' | 'neutral'
  readonly queryRelevant: boolean
}

export interface ObservatoryEdge {
  readonly id: string
  readonly sourceId: string
  readonly targetId: string
  readonly predicate: string
  readonly queryRelevant: boolean
}

export interface ObservatoryProjection {
  readonly nodes: readonly ObservatoryNode[]
  readonly edges: readonly ObservatoryEdge[]
}

export const departmentCenters: Readonly<Record<string, readonly [number, number]>> = {
  'dept-executive': [178, 162],
  'dept-operations': [424, 130],
  'dept-engineering': [707, 150],
  'dept-procurement': [982, 205],
  'dept-finance': [984, 500],
  'dept-safety': [704, 574],
  'dept-people': [326, 558],
}

const projectPositions: readonly [number, number][] = [
  [600, 350], [497, 282], [618, 252], [732, 286], [790, 366],
  [724, 452], [604, 476], [484, 450], [414, 360], [525, 362],
  [671, 355], [558, 210], [816, 256], [830, 470], [410, 476],
]

function orbitPosition(
  center: readonly [number, number],
  index: number,
  count: number,
  innerRadius: number,
  ringStep: number,
): readonly [number, number] {
  const ring = Math.floor(index / Math.max(8, Math.ceil(count / 3)))
  const angle = index * 2.399963229728653
  const radius = innerRadius + ring * ringStep + (index % 3) * 3
  return [center[0] + Math.cos(angle) * radius, center[1] + Math.sin(angle) * radius]
}

function documentNode(
  document: DocumentRecord,
  identity: Identity,
  x: number,
  y: number,
  index: number,
): ObservatoryNode {
  const accessible = canAccessDocument(identity, document)
  const queryRelevant = document.projectIds.includes('project-atlas') && document.passages.some(
    (passage) => passage.evidenceKey?.startsWith('atlas-'),
  )
  return {
    id: accessible ? `node-${document.id}` : `node-concealed-${index}`,
    entityId: accessible ? document.id : null,
    label: accessible ? document.title : 'Restricted record',
    shortLabel: accessible ? document.versionLabel : 'Access required',
    kind: 'document',
    x,
    y,
    clusterId: document.ownerDepartmentId,
    accessible,
    concealed: !accessible,
    status: document.status,
    queryRelevant,
  }
}

export function organizationProjection(model: KnowledgeModel, identity: Identity): ObservatoryProjection {
  const nodes: ObservatoryNode[] = []
  const edges: ObservatoryEdge[] = []

  for (const department of model.departments) {
    const center = departmentCenters[department.id] ?? [600, 350]
    nodes.push({
      id: `node-${department.id}`,
      entityId: department.id,
      label: department.name,
      shortLabel: department.name.replace(' & ', ' / '),
      kind: 'department',
      x: center[0],
      y: center[1],
      clusterId: department.id,
      accessible: true,
      concealed: false,
      status: 'neutral',
      queryRelevant: department.id !== 'dept-people' && department.id !== 'dept-executive',
    })

    const departmentDocuments = model.documents.filter((document) => document.ownerDepartmentId === department.id)
    departmentDocuments.forEach((document, index) => {
      const position = orbitPosition(center, index, departmentDocuments.length, 24, 14)
      nodes.push(documentNode(document, identity, position[0], position[1], index + nodes.length))
    })
  }

  model.repositories.forEach((repository, index) => {
    const center = departmentCenters[repository.ownerDepartmentId] ?? [600, 350]
    const owned = model.repositories.filter((item) => item.ownerDepartmentId === repository.ownerDepartmentId)
    const localIndex = owned.findIndex((item) => item.id === repository.id)
    const angle = -0.7 + localIndex * 0.8
    const position: readonly [number, number] = [center[0] + Math.cos(angle) * 78, center[1] + Math.sin(angle) * 78]
    nodes.push({
      id: `node-${repository.id}`,
      entityId: repository.id,
      label: repository.name,
      shortLabel: `R${String(index + 1).padStart(2, '0')}`,
      kind: 'repository',
      x: position[0],
      y: position[1],
      clusterId: repository.ownerDepartmentId,
      accessible: true,
      concealed: false,
      status: 'neutral',
      queryRelevant: repository.id !== 'repo-people' && repository.id !== 'repo-governance',
    })
    edges.push({
      id: `edge-${repository.id}-owner`,
      sourceId: `node-${repository.id}`,
      targetId: `node-${repository.ownerDepartmentId}`,
      predicate: 'owned by',
      queryRelevant: false,
    })
  })

  model.projects.forEach((project, index) => {
    const [x, y] = projectPositions[index] ?? [600, 350]
    nodes.push({
      id: `node-${project.id}`,
      entityId: project.id,
      label: project.name,
      shortLabel: project.code,
      kind: 'project',
      x,
      y,
      clusterId: null,
      accessible: true,
      concealed: false,
      status: project.status,
      queryRelevant: project.id === 'project-atlas',
    })
    for (const departmentId of project.departmentIds) {
      edges.push({
        id: `edge-${project.id}-${departmentId}`,
        sourceId: `node-${project.id}`,
        targetId: `node-${departmentId}`,
        predicate: 'crosses',
        queryRelevant: project.id === 'project-atlas',
      })
    }
  })

  return { nodes, edges }
}

export function atlasProjection(model: KnowledgeModel, identity: Identity): ObservatoryProjection {
  const nodes: ObservatoryNode[] = []
  const edges: ObservatoryEdge[] = []
  const localDepartmentCenters = new Map<string, readonly [number, number]>()
  const atlas = model.projects.find((project) => project.id === 'project-atlas')
  if (!atlas) return { nodes, edges }

  nodes.push({
    id: 'node-project-atlas', entityId: 'project-atlas', label: atlas.name, shortLabel: atlas.code,
    kind: 'project', x: 590, y: 350, clusterId: null, accessible: true, concealed: false,
    status: atlas.status, queryRelevant: true,
  })

  const departmentAngles = [-2.55, -1.9, -1.2, -0.52, 0.25]
  atlas.departmentIds.forEach((departmentId, index) => {
    const department = model.departments.find((item) => item.id === departmentId)
    if (!department) return
    const angle = departmentAngles[index] ?? 0
    const x = 590 + Math.cos(angle) * 285
    const y = 350 + Math.sin(angle) * 245
    localDepartmentCenters.set(department.id, [x, y])
    nodes.push({
      id: `node-${department.id}`, entityId: department.id, label: department.name,
      shortLabel: department.name, kind: 'department', x, y, clusterId: department.id,
      accessible: true, concealed: false, status: 'neutral', queryRelevant: true,
    })
    edges.push({
      id: `edge-atlas-${department.id}`, sourceId: 'node-project-atlas', targetId: `node-${department.id}`,
      predicate: 'project team', queryRelevant: true,
    })
  })

  const atlasPeople = model.people.filter((person) => person.projectIds.includes('project-atlas'))
  atlasPeople.forEach((person, index) => {
    const center = localDepartmentCenters.get(person.departmentId) ?? [590, 350]
    const departmentPeople = atlasPeople.filter((item) => item.departmentId === person.departmentId)
    const localIndex = departmentPeople.findIndex((item) => item.id === person.id)
    const angle = localIndex * 2.399963229728653
    const radius = 35 + (localIndex % 2) * 16
    nodes.push({
      id: `node-${person.id}`, entityId: person.id, label: person.name, shortLabel: person.name.split(' ')[0] ?? person.name,
      kind: 'person', x: center[0] + Math.cos(angle) * radius, y: center[1] + Math.sin(angle) * radius,
      clusterId: person.departmentId, accessible: true, concealed: false, status: 'neutral', queryRelevant: true,
    })
    edges.push({
      id: `edge-${person.id}-atlas`, sourceId: `node-${person.id}`, targetId: 'node-project-atlas',
      predicate: 'works on', queryRelevant: true,
    })
  })

  const atlasDocuments = model.documents.filter((document) => document.projectIds.includes('project-atlas'))
  atlasDocuments.forEach((document, index) => {
    const accessible = canAccessDocument(identity, document)
    const column = accessible ? 0 : 1
    const localIndex = accessible
      ? atlasDocuments.slice(0, index).filter((item) => canAccessDocument(identity, item)).length
      : atlasDocuments.slice(0, index).filter((item) => !canAccessDocument(identity, item)).length
    const x = column === 0 ? 790 + (localIndex % 4) * 46 : 1065 + (localIndex % 2) * 34
    const y = 250 + Math.floor(localIndex / (column === 0 ? 4 : 2)) * 48
    const node = documentNode(document, identity, x, y, index)
    nodes.push(node)
    if (accessible) {
      edges.push({
        id: `edge-atlas-${document.id}`, sourceId: 'node-project-atlas', targetId: node.id,
        predicate: 'references', queryRelevant: node.queryRelevant,
      })
    }
  })

  const atlasDecision = model.decisions.find((decision) => decision.projectId === 'project-atlas')
  if (atlasDecision) {
    nodes.push({
      id: `node-${atlasDecision.id}`, entityId: atlasDecision.id, label: atlasDecision.title,
      shortLabel: 'Nova selection', kind: 'decision', x: 850, y: 122, clusterId: 'project-atlas',
      accessible: true, concealed: false, status: 'current', queryRelevant: true,
    })
    edges.push({
      id: `edge-${atlasDecision.id}-atlas`, sourceId: `node-${atlasDecision.id}`, targetId: 'node-project-atlas',
      predicate: 'affects', queryRelevant: true,
    })
  }

  return { nodes, edges }
}

export function evidenceProjection(model: KnowledgeModel, identity: Identity): ObservatoryProjection {
  const nodes: ObservatoryNode[] = []
  const edges: ObservatoryEdge[] = []
  const atlasDocuments = model.documents.filter((document) =>
    document.projectIds.includes('project-atlas') && document.passages.some((passage) => passage.evidenceKey?.startsWith('atlas-')),
  )
  let accessibleIndex = 0
  let concealedIndex = 0

  atlasDocuments.forEach((document, documentIndex) => {
    const accessible = canAccessDocument(identity, document)
    if (!accessible) {
      const node = documentNode(document, identity, 1100, 245 + concealedIndex * 60, documentIndex)
      nodes.push(node)
      concealedIndex += 1
      return
    }

    const superseded = document.status !== 'current'
    const x = superseded ? 155 : 335 + (accessibleIndex % 3) * 170
    const y = superseded ? 220 + accessibleIndex * 92 : 175 + Math.floor(accessibleIndex / 3) * 175
    const documentSpatialNode: ObservatoryNode = {
      ...documentNode(document, identity, x, y, documentIndex),
      shortLabel: document.title.replace('Atlas ', '').replace('Nova Industrial ', 'Nova '),
    }
    nodes.push(documentSpatialNode)
    document.passages.forEach((passage, passageIndex) => {
      const passageNodeId = `node-${passage.id}`
      nodes.push({
        id: passageNodeId,
        entityId: document.id,
        label: passage.locator,
        shortLabel: `P${passageIndex + 1}`,
        kind: 'passage',
        x: x + 38 + passageIndex * 24,
        y: y + 34,
        clusterId: document.id,
        accessible: true,
        concealed: false,
        status: document.status,
        queryRelevant: Boolean(passage.evidenceKey),
      })
      edges.push({
        id: `edge-${document.id}-${passage.id}`,
        sourceId: documentSpatialNode.id,
        targetId: passageNodeId,
        predicate: 'contains',
        queryRelevant: Boolean(passage.evidenceKey),
      })
    })
    accessibleIndex += 1
  })

  nodes.push({
    id: 'node-decision-atlas-supplier', entityId: 'decision-atlas-supplier',
    label: 'Nova selection decision', shortLabel: 'Decision', kind: 'decision', x: 870, y: 350,
    clusterId: 'project-atlas', accessible: true, concealed: false, status: 'current', queryRelevant: true,
  })
  nodes.push({
    id: 'node-project-atlas', entityId: 'project-atlas', label: 'Project Atlas procurement', shortLabel: 'ATL-26',
    kind: 'project', x: 1010, y: 350, clusterId: null, accessible: true, concealed: false,
    status: 'active', queryRelevant: true,
  })

  nodes.filter((node) => node.kind === 'passage' && node.status === 'current').forEach((node) => {
    edges.push({
      id: `edge-${node.id}-decision`, sourceId: node.id, targetId: 'node-decision-atlas-supplier',
      predicate: 'supports', queryRelevant: true,
    })
  })
  edges.push({
    id: 'edge-decision-atlas-project', sourceId: 'node-decision-atlas-supplier', targetId: 'node-project-atlas',
    predicate: 'affects', queryRelevant: true,
  })

  return { nodes, edges }
}

export function entitySummary(model: KnowledgeModel, entityId: string | null): readonly [string, string][] {
  if (!entityId) return [['Access', 'Restricted contents cannot resolve for this identity']]
  const department = model.departments.find((item) => item.id === entityId)
  if (department) {
    return [
      ['Type', 'Department'],
      ['Mandate', department.mandate],
      ['People', String(model.people.filter((person) => person.departmentId === department.id).length)],
      ['Records', String(model.documents.filter((document) => document.ownerDepartmentId === department.id).length)],
    ]
  }
  const repository = model.repositories.find((item) => item.id === entityId)
  if (repository) return [['Type', repository.system], ['Owner', model.departments.find((item) => item.id === repository.ownerDepartmentId)?.name ?? 'Unknown'], ['Sync', repository.syncCadence]]
  const project = model.projects.find((item) => item.id === entityId)
  if (project) return [['Type', 'Project'], ['Code', project.code], ['Status', project.status], ['Brief', project.description]]
  const person = model.people.find((item) => item.id === entityId)
  if (person) return [['Type', 'Person'], ['Role', person.role], ['Department', model.departments.find((item) => item.id === person.departmentId)?.name ?? 'Unknown']]
  const decision = model.decisions.find((item) => item.id === entityId)
  if (decision) return [['Type', 'Decision'], ['Made', decision.madeAt], ['Outcome', decision.outcome]]
  const document = model.documents.find((item) => item.id === entityId)
  if (document) return [['Type', document.kind], ['Version', document.versionLabel], ['State', document.status], ['Synchronized', document.lastSynchronizedAt]]
  return [['Type', 'Knowledge entity']]
}
