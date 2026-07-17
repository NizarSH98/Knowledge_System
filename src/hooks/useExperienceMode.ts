export type ExperienceMode = {
  webgl: boolean
  reducedMotion: boolean
  touch: boolean
  /** Full scroll-choreographed 3D experience */
  cinematic: boolean
}

let cached: ExperienceMode | null = null

function supportsWebGL(): boolean {
  if (new URLSearchParams(window.location.search).has('nowebgl')) return false
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    return gl !== null
  } catch {
    return false
  }
}

export function detectExperienceMode(): ExperienceMode {
  if (cached) return cached
  const reducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    new URLSearchParams(window.location.search).has('reducedmotion')
  const touch = window.matchMedia('(pointer: coarse)').matches
  const webgl = supportsWebGL()
  cached = { webgl, reducedMotion, touch, cinematic: webgl && !reducedMotion }

  const root = document.documentElement
  root.classList.toggle('reduced-motion', reducedMotion)
  root.classList.toggle('no-webgl', !webgl)
  root.classList.toggle('touch', touch)
  root.classList.toggle('cinematic', cached.cinematic)
  return cached
}

/** Allows the WebGL error boundary to demote the page to the static fallback. */
export function demoteToStatic(): void {
  cached = { webgl: false, reducedMotion: cached?.reducedMotion ?? false, touch: cached?.touch ?? false, cinematic: false }
  const root = document.documentElement
  root.classList.add('no-webgl')
  root.classList.remove('cinematic')
}
