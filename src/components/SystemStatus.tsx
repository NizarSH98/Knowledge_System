import { useEffect, useRef } from 'react'
import { onNarrativeChange } from '../experience/systems/sceneState'

const LABELS: Record<string, string> = {
  fragmented: 'sys · fragmented',
  indexing: 'sys · indexing',
  permissioned: 'sys · permissioned',
  retrieving: 'sys · retrieving',
  grounded: 'sys · grounded',
  boundary: 'sys · boundary defined',
  calm: 'sys · stable',
}

/**
 * Reflects the current narrative state of the visual simulation.
 * Not a live service indicator — purely a reading aid, hence aria-hidden.
 */
export function SystemStatus() {
  const rootRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(
    () =>
      onNarrativeChange((state) => {
        if (labelRef.current) labelRef.current.textContent = LABELS[state] ?? state
        rootRef.current?.setAttribute('data-state', state)
      }),
    [],
  )

  return (
    <div ref={rootRef} className="sys-status" aria-hidden="true" data-state="fragmented">
      <span className="sys-status-dot" />
      <span ref={labelRef}>sys · fragmented</span>
    </div>
  )
}
