import type { GraphicsBackend, GraphicsCapabilities } from './types.ts'

type NavigatorWithGraphicsHints = Navigator & {
  readonly deviceMemory?: number
}

function webGl2Available(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) !== null
  } catch {
    return false
  }
}

function requestedBackend(): GraphicsBackend | null {
  const value = new URLSearchParams(window.location.search).get('v2renderer')
  if (value === 'static') return 'static'
  if (value === 'webgl') return 'webgl2'
  if (value === 'webgpu') return 'webgpu'
  return null
}

export function detectGraphicsCapabilities(): GraphicsCapabilities {
  const graphicsNavigator = navigator as NavigatorWithGraphicsHints
  const hasWebGpu = Boolean(navigator.gpu)
  const hasWebGl2 = webGl2Available()
  const forcedBackend = requestedBackend()
  const backend: GraphicsBackend = forcedBackend === 'static'
    ? 'static'
    : forcedBackend === 'webgpu' && hasWebGpu
      ? 'webgpu'
      : forcedBackend === 'webgl2' && hasWebGl2
        ? 'webgl2'
        : hasWebGpu
          ? 'webgpu'
          : hasWebGl2
            ? 'webgl2'
            : 'static'

  return {
    backend,
    webGpuAvailable: hasWebGpu,
    webGl2Available: hasWebGl2,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    touchPrimary: window.matchMedia('(pointer: coarse)').matches,
    hardwareConcurrency: Number.isFinite(graphicsNavigator.hardwareConcurrency)
      ? graphicsNavigator.hardwareConcurrency
      : null,
    deviceMemoryGb: typeof graphicsNavigator.deviceMemory === 'number'
      ? graphicsNavigator.deviceMemory
      : null,
  }
}
