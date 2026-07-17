/**
 * Adaptive quality: an initial tier is estimated from coarse device
 * characteristics (no fingerprinting), then a frame-rate monitor may
 * step the tier down at runtime. Appliers registered by the canvas
 * receive tier changes and adjust DPR / draw counts / fluid usage live.
 */

export type QualityTier = 'high' | 'balanced' | 'reduced'

export type QualityProfile = {
  tier: QualityTier
  maxDpr: number
  fragments: number
  particles: number
  fluid: boolean
}

const PROFILES: Record<QualityTier, QualityProfile> = {
  high: { tier: 'high', maxDpr: 2, fragments: 240, particles: 1300, fluid: true },
  balanced: { tier: 'balanced', maxDpr: 1.5, fragments: 170, particles: 850, fluid: true },
  reduced: { tier: 'reduced', maxDpr: 1, fragments: 100, particles: 400, fluid: false },
}

/** Buffers are allocated at the maximum size; tiers only reduce draw counts. */
export const PROFILE_MAX = PROFILES.high

function estimateTier(): QualityTier {
  const touch = window.matchMedia('(pointer: coarse)').matches
  const narrow = window.innerWidth < 900
  if (touch || narrow) return 'reduced'
  const nav = navigator as Navigator & { deviceMemory?: number }
  const mem = nav.deviceMemory ?? 8
  const cores = navigator.hardwareConcurrency ?? 8
  if (mem >= 8 && cores >= 8 && window.devicePixelRatio <= 2.5) return 'high'
  return 'balanced'
}

let current: QualityProfile = PROFILES[estimateTier()]

type Applier = (profile: QualityProfile) => void
const appliers = new Set<Applier>()

export function getQuality(): QualityProfile {
  return current
}

export function onQualityChange(fn: Applier): () => void {
  appliers.add(fn)
  return () => appliers.delete(fn)
}

export function degradeQuality(): boolean {
  const next: QualityTier | null =
    current.tier === 'high' ? 'balanced' : current.tier === 'balanced' ? 'reduced' : null
  if (!next) return false
  current = PROFILES[next]
  appliers.forEach((fn) => fn(current))
  return true
}
