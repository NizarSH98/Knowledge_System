import { useEffect, useMemo, useRef, useState } from 'react'
import { CANONICAL_QUESTION, asteriaKnowledgeModel } from '../../data/index.ts'
import { canAccessDocument } from '../../knowledge-model/permissions.ts'
import { retrieveKnowledge } from '../../knowledge-model/retrieval.ts'
import type { Identity } from '../../knowledge-model/types.ts'
import { RouteLink } from '../../shared/components/RouteLink.tsx'
import { useTheme } from '../../themes/useTheme.ts'
import { V2_ROUTES } from '../../app/routes.ts'
import type { ObservatoryScale, QueryStage } from './model.ts'
import { ObservatoryMap } from './ObservatoryMap.tsx'
import { QuerySequence } from './QuerySequence.tsx'
import { SourceInspector } from './SourceInspector.tsx'
import { VersionRail } from './VersionRail.tsx'
import './observatory.css'

const scaleDefinitions: readonly { readonly id: ObservatoryScale; readonly label: string; readonly detail: string }[] = [
  { id: 'organization', label: 'Organization', detail: 'departments / repositories / projects' },
  { id: 'relationship', label: 'Relationship', detail: 'people / decisions / record groups' },
  { id: 'evidence', label: 'Evidence', detail: 'documents / passages / versions / citations' },
]

export function ObservatoryPage() {
  const model = asteriaKnowledgeModel
  const { theme, modeOptions: themeOptions, selectMode, selectTheme } = useTheme()
  const [identityId, setIdentityId] = useState('identity-general')
  const [scale, setScale] = useState<ObservatoryScale>('organization')
  const [draftQuestion, setDraftQuestion] = useState(CANONICAL_QUESTION)
  const [submittedQuestion, setSubmittedQuestion] = useState(CANONICAL_QUESTION)
  const [queryStage, setQueryStage] = useState<QueryStage>('idle')
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null)
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null)
  const [selectedVersionId, setSelectedVersionId] = useState('doc-atlas-evaluation-v4')
  const timersRef = useRef<number[]>([])

  const identity = model.identities.find((item) => item.id === identityId) ?? model.identities[0] as Identity
  const result = useMemo(
    () => retrieveKnowledge(model, submittedQuestion, identity.id),
    [identity.id, model, submittedQuestion],
  )
  const accessibleDocuments = model.documents.filter((document) => canAccessDocument(identity, document)).length

  function clearQueryTimers() {
    for (const timer of timersRef.current) window.clearTimeout(timer)
    timersRef.current = []
  }

  useEffect(() => clearQueryTimers, [])

  useEffect(() => {
    if (!selectedSourceId) return
    const document = model.documents.find((item) => item.id === selectedSourceId)
    if (!document || !canAccessDocument(identity, document)) {
      setSelectedSourceId(null)
      setSelectedEntityId(null)
    }
  }, [identity, model.documents, selectedSourceId])

  function scheduleStage(stage: QueryStage, delay: number, nextScale?: ObservatoryScale) {
    const timer = window.setTimeout(() => {
      setQueryStage(stage)
      if (nextScale) setScale(nextScale)
    }, delay)
    timersRef.current.push(timer)
  }

  function runQuery() {
    clearQueryTimers()
    setSubmittedQuestion(draftQuestion)
    setSelectedSourceId(null)
    setSelectedEntityId('project-atlas')
    setScale('organization')
    setQueryStage('records')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setScale('evidence')
      setQueryStage('resolved')
      return
    }

    scheduleStage('candidates', 650, 'relationship')
    scheduleStage('permissions', 1350)
    scheduleStage('versions', 2050, 'evidence')
    scheduleStage('evidence', 2750)
    scheduleStage('resolved', 3500)
  }

  function selectSource(documentId: string) {
    setSelectedSourceId(documentId)
    setSelectedEntityId(documentId)
    setScale('evidence')
  }

  return (
    <main id="main-content" className={`observatory-page observatory-page--${queryStage}`}>
      <header className="observatory-masthead">
        <RouteLink className="observatory-mark" to={V2_ROUTES.home}>
          <span>Knowledge</span><strong>Observatory</strong>
        </RouteLink>
        <div className="observatory-masthead__status">
          <span><i className="status-pulse" /> Asteria index synchronized</span>
          <span>{model.documents.length} records</span>
          <span>{model.relationships.length} relations</span>
        </div>
        <nav aria-label="V2 directions">
          <RouteLink to={V2_ROUTES.home}>All directions</RouteLink>
          <RouteLink to={V2_ROUTES.compare}>Compare</RouteLink>
        </nav>
      </header>

      <section className="observatory-intro">
        <div>
          <p className="instrument-label">Asteria Infrastructure Group / synthetic index</p>
          <h1>Observe how an answer becomes knowable.</h1>
        </div>
        <p>
          An information instrument for organizational memory. Distance follows ownership,
          grouping follows operational context, and every bright path must terminate in evidence.
        </p>
      </section>

      <section className="instrument-controls" aria-label="Observatory controls">
        <label>
          <span>Identity</span>
          <select aria-label="Identity" value={identity.id} onChange={(event) => setIdentityId(event.target.value)}>
            {model.identities.map((item) => <option key={item.id} value={item.id}>{item.label} / {item.role}</option>)}
          </select>
        </label>
        <label>
          <span>Reading mode</span>
          <select aria-label="Reading mode" value={theme.mode} onChange={(event) => selectMode(event.target.value as 'light' | 'dark')}>
            <option value="light">Light mode</option>
            <option value="dark">Dark mode</option>
          </select>
        </label>
        <label>
          <span>Color palette</span>
          <select aria-label="Color palette" value={theme.id} onChange={(event) => selectTheme(event.target.value)}>
            {themeOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <div className="access-calibration">
          <span>Accessible index</span>
          <strong>{String(accessibleDocuments).padStart(3, '0')}<small> / {model.documents.length}</small></strong>
        </div>
        <div className="access-calibration">
          <span>Current query</span>
          <strong>{result.status.replaceAll('-', ' ')}</strong>
        </div>
      </section>

      <nav className="semantic-scale" aria-label="Semantic scale">
        {scaleDefinitions.map((definition, index) => (
          <button
            key={definition.id}
            type="button"
            className={scale === definition.id ? 'is-active' : ''}
            aria-pressed={scale === definition.id}
            onClick={() => setScale(definition.id)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{definition.label}</strong>
            <small>{definition.detail}</small>
          </button>
        ))}
      </nav>

      <ObservatoryMap
        model={model}
        identity={identity}
        scale={scale}
        queryStage={queryStage}
        result={result}
        selectedEntityId={selectedEntityId}
        onSelect={setSelectedEntityId}
      />

      <section className="observatory-workbench">
        <QuerySequence
          model={model}
          question={draftQuestion}
          result={result}
          stage={queryStage}
          onQuestionChange={setDraftQuestion}
          onSubmit={runQuery}
          onSelectSource={selectSource}
          onInspectEvidence={() => setScale('evidence')}
        />
        <SourceInspector
          model={model}
          result={result}
          documentId={selectedSourceId}
          onClose={() => setSelectedSourceId(null)}
        />
      </section>

      <VersionRail
        model={model}
        identity={identity}
        selectedVersionId={selectedVersionId}
        onSelect={setSelectedVersionId}
      />

      <section className="observatory-field-notes">
        <p className="instrument-label">Field notes</p>
        <div>
          <p><strong>Start broad.</strong> Select Project Atlas in the organization view to open a local focus field without losing the company around it.</p>
          <p><strong>Ask why.</strong> Run the prepared question and watch candidates pass through permissions and version state before claims resolve.</p>
          <p><strong>Reverse the path.</strong> Open any citation to see the repository, owner, passage, decision, and project it influences.</p>
        </div>
      </section>
    </main>
  )
}
