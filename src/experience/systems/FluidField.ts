import * as THREE from 'three'
import { fluidUpdateFrag, fluidUpdateVert } from '../shaders'

/**
 * Low-resolution ping-pong feedback field driven by pointer velocity.
 * R stores ink pressure, GB stores velocity. Cheap by construction:
 * one 96×96 half-float pass per frame, hero only.
 */
export class FluidField {
  private rtA: THREE.WebGLRenderTarget
  private rtB: THREE.WebGLRenderTarget
  private scene: THREE.Scene
  private camera: THREE.OrthographicCamera
  private material: THREE.ShaderMaterial
  private lastPoint = new THREE.Vector2(0.5, 0.5)

  constructor() {
    const opts: THREE.RenderTargetOptions = {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    }
    this.rtA = new THREE.WebGLRenderTarget(96, 96, opts)
    this.rtB = new THREE.WebGLRenderTarget(96, 96, opts)
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.material = new THREE.ShaderMaterial({
      vertexShader: fluidUpdateVert,
      fragmentShader: fluidUpdateFrag,
      uniforms: {
        uPrev: { value: this.rtA.texture },
        uPoint: { value: new THREE.Vector2(0.5, 0.5) },
        uVel: { value: new THREE.Vector2(0, 0) },
        uDt: { value: 0.016 },
        uAspect: { value: 1 },
      },
      depthTest: false,
      depthWrite: false,
    })
    this.scene = new THREE.Scene()
    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material))
  }

  get texture(): THREE.Texture {
    return this.rtA.texture
  }

  update(renderer: THREE.WebGLRenderer, pointerX: number, pointerY: number, dt: number): void {
    const u = this.material.uniforms
    const px = pointerX * 0.5 + 0.5
    // pointerY is screen-down-positive; texture v runs bottom-up, so flip
    const py = 1 - (pointerY * 0.5 + 0.5)
    u.uPrev.value = this.rtA.texture
    ;(u.uVel.value as THREE.Vector2).set(px - this.lastPoint.x, py - this.lastPoint.y)
    ;(u.uPoint.value as THREE.Vector2).set(px, py)
    u.uDt.value = Math.min(dt, 0.05)
    u.uAspect.value = window.innerWidth / Math.max(window.innerHeight, 1)
    this.lastPoint.set(px, py)

    const prevTarget = renderer.getRenderTarget()
    renderer.setRenderTarget(this.rtB)
    renderer.render(this.scene, this.camera)
    renderer.setRenderTarget(prevTarget)

    const tmp = this.rtA
    this.rtA = this.rtB
    this.rtB = tmp
  }

  dispose(): void {
    this.rtA.dispose()
    this.rtB.dispose()
    this.material.dispose()
  }
}
