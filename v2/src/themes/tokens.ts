export const SEMANTIC_COLOR_TOKENS = [
  'background',
  'surface',
  'surfaceRaised',
  'text',
  'textMuted',
  'primary',
  'evidence',
  'current',
  'restricted',
  'superseded',
  'warning',
  'relationship',
  'border',
  'focus',
  'hover',
  'selection',
] as const

export type SemanticColorToken = (typeof SEMANTIC_COLOR_TOKENS)[number]
export type SemanticColorMap = Readonly<Record<SemanticColorToken, string>>
export type ThemeMode = 'light' | 'dark'

export interface GraphicsTheme {
  readonly background: string
  readonly surface: string
  readonly knowledge: string
  readonly relationship: string
  readonly evidence: string
  readonly restricted: string
  readonly superseded: string
  readonly selection: string
  readonly postprocessingCharacter: 'clean' | 'cool' | 'material' | 'paper' | 'warm'
}

export interface ThemeDefinition {
  readonly id: string
  readonly name: string
  readonly mode: ThemeMode
  readonly character: string
  readonly colors: SemanticColorMap
  readonly graphics: GraphicsTheme
}
