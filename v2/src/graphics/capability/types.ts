export type GraphicsBackend = 'webgpu' | 'webgl2' | 'static'
export type QualityTier = 'high' | 'balanced' | 'reduced' | 'static'

export interface GraphicsCapabilities {
  readonly backend: GraphicsBackend
  readonly webGpuAvailable: boolean
  readonly webGl2Available: boolean
  readonly reducedMotion: boolean
  readonly touchPrimary: boolean
  readonly hardwareConcurrency: number | null
  readonly deviceMemoryGb: number | null
}

export interface QualityDecision {
  readonly tier: QualityTier
  readonly maxDevicePixelRatio: number
  readonly dataDensity: number
  readonly postprocessingEnabled: boolean
  readonly computeEnabled: boolean
  readonly reason: string
}
