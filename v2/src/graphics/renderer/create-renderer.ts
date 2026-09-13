import type { GraphicsCapabilities, QualityDecision } from '../capability/types.ts'
import type { ThemeDefinition } from '../../themes/tokens.ts'
import type { RendererAdapter } from './types.ts'

interface CreateRendererOptions {
  readonly host: HTMLElement
  readonly theme: ThemeDefinition
  readonly quality: QualityDecision
  readonly capabilities: GraphicsCapabilities
  readonly onFrameDuration?: (durationMs: number) => void
}

export async function createRenderer(
  options: CreateRendererOptions,
): Promise<RendererAdapter | null> {
  if (options.quality.tier === 'static' || options.capabilities.backend === 'static') return null

  const { ThreeRendererAdapter } = await import('./three-adapter.ts')

  const mount = (forceWebGl: boolean) => ThreeRendererAdapter.create({
      host: options.host,
      theme: options.theme,
      quality: options.quality,
      reducedMotion: options.capabilities.reducedMotion,
      forceWebGl,
      onFrameDuration: options.onFrameDuration,
    })

  try {
    return await mount(options.capabilities.backend === 'webgl2')
  } catch (error) {
    if (options.capabilities.backend === 'webgpu' && options.capabilities.webGl2Available) {
      try {
        return await mount(true)
      } catch (fallbackError) {
        console.warn(
          'V2 WebGPU and WebGL renderers were unavailable; continuing with the static representation.',
          error,
          fallbackError,
        )
        return null
      }
    }
    console.warn('V2 renderer unavailable; continuing with static representation.', error)
    return null
  }
}
