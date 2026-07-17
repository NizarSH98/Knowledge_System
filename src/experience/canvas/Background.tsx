import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { backgroundVert, backgroundFrag } from '../shaders'
import { sceneState } from '../systems/sceneState'
import { getQuality } from '../performance/quality'
import type { SharedUniforms } from './uniforms'

/**
 * Camera-locked backdrop: warm carbon gradient, vignette, dithering,
 * and the hero fluid field folded in as refracted light pressure.
 */
const FALLBACK_TEXTURE = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1)
FALLBACK_TEXTURE.needsUpdate = true

export function Background({
  uniforms,
  fluid,
}: {
  uniforms: SharedUniforms
  fluid: { texture: THREE.Texture } | null
}) {
  const ref = useRef<THREE.Mesh>(null)
  const geometry = useMemo(() => new THREE.PlaneGeometry(46, 26), [])
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: backgroundVert,
        fragmentShader: backgroundFrag,
        uniforms: {
          uTime: uniforms.uTime,
          uOrder: uniforms.uOrder,
          uCalm: uniforms.uCalm,
          uTheme: uniforms.uTheme,
          uFluidStrength: { value: 0 },
          uFluid: { value: FALLBACK_TEXTURE },
        },
        depthWrite: false,
        depthTest: false,
      }),
    [uniforms],
  )

  const dir = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ camera }) => {
    if (!ref.current) return
    camera.getWorldDirection(dir)
    ref.current.position.copy(camera.position).addScaledVector(dir, 16)
    ref.current.quaternion.copy(camera.quaternion)
    material.uniforms.uFluid.value = fluid?.texture ?? FALLBACK_TEXTURE
    material.uniforms.uFluidStrength.value = fluid && getQuality().fluid ? sceneState.heroWeight : 0
  })

  useEffect(() => () => {
    geometry.dispose()
    material.dispose()
  }, [geometry, material])

  return <mesh ref={ref} geometry={geometry} material={material} renderOrder={-10} frustumCulled={false} />
}
