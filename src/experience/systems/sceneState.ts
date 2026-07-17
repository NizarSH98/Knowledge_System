/**
 * Mutable bridge between the GSAP scroll director (DOM side) and the
 * three.js scene (render loop side). GSAP writes plain numbers here on
 * scroll; useFrame reads them. No React state is involved per frame.
 */

export type NarrativeState =
  | 'fragmented'
  | 'indexing'
  | 'permissioned'
  | 'retrieving'
  | 'grounded'
  | 'boundary'
  | 'calm'

export const sceneState = {
  /** 0 = scattered fragments, 1 = aligned lattice */
  order: 0,
  /** visibility of permission membranes */
  permission: 0,
  /** progress of the retrieval pulse chapter */
  retrieval: 0,
  /** answer surface + citation tethers */
  grounded: 0,
  /** action-boundary ring beyond the read-only core */
  expansion: 0,
  /** final-section stabilisation */
  calm: 0,
  /** brief chromatic disruption for conflicting/superseded versions */
  conflict: 0,
  /** camera progress 0..1 along the authored path */
  camT: 0,
  /** 1 while the hero composition (lattice offset right) should hold */
  heroWeight: 1,
  /** true while opaque editorial sections fully cover the canvas */
  covered: false,

  pointerX: 0,
  pointerY: 0,
  pointerSpeed: 0,

  narrative: 'fragmented' as NarrativeState,
}

type NarrativeListener = (state: NarrativeState) => void
const narrativeListeners = new Set<NarrativeListener>()

export function setNarrative(state: NarrativeState): void {
  if (sceneState.narrative === state) return
  sceneState.narrative = state
  narrativeListeners.forEach((fn) => fn(state))
}

export function onNarrativeChange(fn: NarrativeListener): () => void {
  narrativeListeners.add(fn)
  fn(sceneState.narrative)
  return () => narrativeListeners.delete(fn)
}
