import type {
  GraphicsCapabilities,
  QualityDecision,
  QualityTier,
} from '../capability/types.ts'

const qualityOrder: readonly QualityTier[] = ['high', 'balanced', 'reduced', 'static']

function forcedQuality(): QualityTier | null {
  const value = new URLSearchParams(window.location.search).get('v2quality')
  return qualityOrder.includes(value as QualityTier) ? value as QualityTier : null
}

function decision(tier: QualityTier, reason: string): QualityDecision {
  switch (tier) {
    case 'high':
      return { tier, maxDevicePixelRatio: 2, dataDensity: 1, postprocessingEnabled: true, computeEnabled: true, reason }
    case 'balanced':
      return { tier, maxDevicePixelRatio: 1.5, dataDensity: 0.7, postprocessingEnabled: true, computeEnabled: false, reason }
    case 'reduced':
      return { tier, maxDevicePixelRatio: 1.25, dataDensity: 0.4, postprocessingEnabled: false, computeEnabled: false, reason }
    case 'static':
      return { tier, maxDevicePixelRatio: 1, dataDensity: 0, postprocessingEnabled: false, computeEnabled: false, reason }
  }
}

export function staticQuality(reason: string): QualityDecision {
  return decision('static', reason)
}

export function selectInitialQuality(capabilities: GraphicsCapabilities): QualityDecision {
  const forced = forcedQuality()
  if (forced) {
    if (forced === 'static') return decision('static', 'Static tier requested in URL')
    if (capabilities.backend === 'static') return decision('static', 'No usable graphics backend')
    return decision(forced, `${forced} tier requested in URL`)
  }

  if (capabilities.backend === 'static') return decision('static', 'No usable graphics backend')
  if (capabilities.reducedMotion) return decision('reduced', 'Reduced motion preference')

  const enoughCpu = (capabilities.hardwareConcurrency ?? 4) >= 8
  const enoughMemory = (capabilities.deviceMemoryGb ?? 8) >= 8
  const wideViewport = window.innerWidth >= 1024

  if (
    capabilities.backend === 'webgpu' &&
    enoughCpu &&
    enoughMemory &&
    wideViewport &&
    !capabilities.touchPrimary
  ) {
    return decision('high', 'WebGPU and high-capability desktop signals')
  }

  if (window.innerWidth < 540 || capabilities.touchPrimary) {
    return decision('reduced', 'Compact or touch-primary viewport')
  }

  return decision('balanced', 'Compatible graphics backend with conservative effects')
}

export function lowerQuality(current: QualityDecision, reason: string): QualityDecision {
  const index = qualityOrder.indexOf(current.tier)
  const nextTier = qualityOrder[Math.min(index + 1, qualityOrder.length - 1)] ?? 'static'
  return decision(nextTier, reason)
}

export class AdaptiveQualityMonitor {
  readonly #samples: number[] = []
  #lastDowngradeAt = 0

  constructor(
    private current: QualityDecision,
    private readonly onDowngrade: (decision: QualityDecision) => void,
  ) {}

  sample(frameDurationMs: number, now = performance.now()): void {
    if (this.current.tier === 'static') return
    this.#samples.push(frameDurationMs)
    if (this.#samples.length > 90) this.#samples.shift()
    if (this.#samples.length < 60 || now - this.#lastDowngradeAt < 5000) return

    const average = this.#samples.reduce((total, value) => total + value, 0) / this.#samples.length
    if (average <= 30) return

    this.current = lowerQuality(this.current, `Sustained ${average.toFixed(1)} ms frame time`)
    this.#lastDowngradeAt = now
    this.#samples.length = 0
    this.onDowngrade(this.current)
  }
}
