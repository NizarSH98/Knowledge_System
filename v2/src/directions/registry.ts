export type DirectionId = 'observatory' | 'institutional-os' | 'living-archive'

export interface DirectionDefinition {
  readonly id: DirectionId
  readonly index: '01' | '02' | '03'
  readonly name: string
  readonly route: string
  readonly metaphor: string
  readonly spatialModel: string
  readonly navigationModel: string
  readonly dominantInteraction: string
  readonly webGpuDependency: 'central' | 'secondary' | 'material'
  readonly paletteIds: readonly string[]
}

export const directions: readonly DirectionDefinition[] = [
  {
    id: 'observatory',
    index: '01',
    name: 'Knowledge Observatory',
    route: '/v2/observatory',
    metaphor: 'The organization as an observable information universe.',
    spatialModel: 'Semantic scales with clustered, level-of-detail transitions.',
    navigationModel: 'Instrument modes, identity, time, and query controls.',
    dominantInteraction: 'Trace an answer through evidence in space.',
    webGpuDependency: 'central',
    paletteIds: ['night-instrument', 'deep-cobalt', 'polar-instrument', 'graphite-spectral'],
  },
  {
    id: 'institutional-os',
    index: '02',
    name: 'Institutional OS',
    route: '/v2/os',
    metaphor: 'An operating layer for organizational knowledge.',
    spatialModel: 'DOM-first workspace with answer, provenance, and trace regions.',
    navigationModel: 'Domain rail, command input, inspectors, and event trace.',
    dominantInteraction: 'Operate an answer workspace and inspect every claim.',
    webGpuDependency: 'secondary',
    paletteIds: ['black-cobalt', 'warm-white-ink', 'steel-teal', 'oxide-paper'],
  },
  {
    id: 'living-archive',
    index: '03',
    name: 'Living Archive',
    route: '/v2/archive',
    metaphor: 'A living institutional record with weight, history, and ownership.',
    spatialModel: 'Editorial record layers that assemble into an evidence dossier.',
    navigationModel: 'Records, references, history layers, and marginal navigation.',
    dominantInteraction: 'Gather records into a visibly footnoted case.',
    webGpuDependency: 'material',
    paletteIds: ['ivory-oxblood', 'charcoal-brass', 'bone-cobalt', 'forest-parchment'],
  },
]
