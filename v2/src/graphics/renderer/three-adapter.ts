import * as THREE from 'three/webgpu'
import { color } from 'three/tsl'
import type { ThemeDefinition } from '../../themes/tokens.ts'
import type { QualityDecision } from '../capability/types.ts'
import type { RendererAdapter, RendererMountOptions } from './types.ts'

interface SemanticNode {
  readonly mesh: THREE.Mesh
  readonly material: THREE.MeshBasicNodeMaterial
  readonly colorKey: keyof ThemeDefinition['graphics']
  readonly phase: number
}

export class ThreeRendererAdapter implements RendererAdapter {
  readonly backendLabel: string
  readonly #renderer: THREE.WebGPURenderer
  readonly #scene = new THREE.Scene()
  readonly #camera = new THREE.OrthographicCamera(-3.4, 3.4, 1.5, -1.5, 0.1, 10)
  readonly #nodes: SemanticNode[] = []
  readonly #connectionMaterial: THREE.MeshBasicNodeMaterial
  readonly #resizeObserver: ResizeObserver
  #quality: QualityDecision
  #disposed = false
  #visible = true
  #reducedMotion: boolean
  #previousFrameTime: number | null = null
  readonly #onFrameDuration: ((durationMs: number) => void) | undefined

  private constructor(options: RendererMountOptions, renderer: THREE.WebGPURenderer) {
    this.#renderer = renderer
    this.#quality = options.quality
    this.#reducedMotion = options.reducedMotion
    this.#onFrameDuration = options.onFrameDuration
    this.backendLabel = 'isWebGPUBackend' in renderer.backend
      ? 'WebGPU · Three.js backend'
      : 'WebGL 2 · Three.js backend'
    this.#camera.position.z = 4
    this.#scene.background = new THREE.Color(options.theme.graphics.background)

    const nodeDefinitions: readonly [number, keyof ThemeDefinition['graphics']][] = [
      [-2.5, 'knowledge'],
      [-1.25, 'relationship'],
      [0, 'superseded'],
      [1.25, 'evidence'],
      [2.5, 'selection'],
    ]

    for (const [index, [x, colorKey]] of nodeDefinitions.entries()) {
      const geometry = new THREE.CircleGeometry(index === 4 ? 0.26 : 0.18, 40)
      const material = new THREE.MeshBasicNodeMaterial()
      material.colorNode = color(options.theme.graphics[colorKey] as string)
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(x, 0, 0)
      this.#scene.add(mesh)
      this.#nodes.push({ mesh, material, colorKey, phase: index * 0.55 })
    }

    const connectionGeometry = new THREE.PlaneGeometry(5, 0.025)
    const connectionMaterial = new THREE.MeshBasicNodeMaterial()
    connectionMaterial.colorNode = color(options.theme.graphics.relationship)
    this.#connectionMaterial = connectionMaterial
    const connection = new THREE.Mesh(connectionGeometry, connectionMaterial)
    connection.position.z = -0.1
    this.#scene.add(connection)

    options.host.replaceChildren(renderer.domElement)
    renderer.domElement.className = 'foundation-canvas'
    renderer.domElement.dataset.v2Theme = options.theme.id
    this.#resizeObserver = new ResizeObserver(() => this.#resize(options.host))
    this.#resizeObserver.observe(options.host)
    document.addEventListener('visibilitychange', this.#handleVisibility)
    this.#resize(options.host)
    this.#startLoop()
  }

  static async create(options: RendererMountOptions): Promise<ThreeRendererAdapter> {
    const renderer = new THREE.WebGPURenderer({
      antialias: options.quality.tier !== 'reduced',
      alpha: false,
      forceWebGL: options.forceWebGl,
    })
    await renderer.init()
    return new ThreeRendererAdapter(options, renderer)
  }

  setTheme(theme: ThemeDefinition): void {
    this.#renderer.domElement.dataset.v2Theme = theme.id
    this.#scene.background = new THREE.Color(theme.graphics.background)
    for (const node of this.#nodes) {
      node.material.colorNode = color(theme.graphics[node.colorKey] as string)
      node.material.needsUpdate = true
    }
    this.#connectionMaterial.colorNode = color(theme.graphics.relationship)
    this.#connectionMaterial.needsUpdate = true
  }

  setQuality(quality: QualityDecision): void {
    this.#quality = quality
    this.#renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality.maxDevicePixelRatio))
  }

  dispose(): void {
    if (this.#disposed) return
    this.#disposed = true
    this.#renderer.setAnimationLoop(null)
    this.#resizeObserver.disconnect()
    document.removeEventListener('visibilitychange', this.#handleVisibility)
    this.#scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose()
        object.material.dispose()
      }
    })
    this.#renderer.dispose()
    this.#renderer.domElement.remove()
  }

  readonly #handleVisibility = (): void => {
    this.#visible = document.visibilityState === 'visible'
  }

  #resize(host: HTMLElement): void {
    const width = Math.max(host.clientWidth, 1)
    const height = Math.max(host.clientHeight, 1)
    this.#renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.#quality.maxDevicePixelRatio))
    this.#renderer.setSize(width, height, false)
    const aspect = width / height
    this.#camera.left = -1.5 * aspect
    this.#camera.right = 1.5 * aspect
    this.#camera.updateProjectionMatrix()
  }

  #startLoop(): void {
    this.#renderer.setAnimationLoop((time) => {
      if (this.#disposed || !this.#visible) return
      if (this.#previousFrameTime !== null) {
        const frameDuration = time - this.#previousFrameTime
        if (frameDuration > 0 && frameDuration < 1000) this.#onFrameDuration?.(frameDuration)
      }
      this.#previousFrameTime = time
      if (!this.#reducedMotion) {
        for (const node of this.#nodes) {
          const activation = (Math.sin(time * 0.0012 - node.phase) + 1) * 0.5
          const scale = 0.92 + activation * 0.18
          node.mesh.scale.setScalar(scale)
        }
      }
      this.#renderer.render(this.#scene, this.#camera)
    })
  }
}
