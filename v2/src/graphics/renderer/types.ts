import type { QualityDecision } from '../capability/types.ts'
import type { ThemeDefinition } from '../../themes/tokens.ts'

export interface RendererMountOptions {
  readonly host: HTMLElement
  readonly theme: ThemeDefinition
  readonly quality: QualityDecision
  readonly reducedMotion: boolean
  readonly forceWebGl: boolean
  readonly onFrameDuration: ((durationMs: number) => void) | undefined
}

export interface RendererAdapter {
  readonly backendLabel: string
  setTheme(theme: ThemeDefinition): void
  setQuality(quality: QualityDecision): void
  dispose(): void
}
