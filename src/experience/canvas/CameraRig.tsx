import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { buildCameraPath } from '../systems/latticeData'
import { sceneState } from '../systems/sceneState'

/**
 * Follows the authored camera path as sceneState.camT moves 0→1.
 * Damping smooths scrub steps; pointer parallax applies only in the
 * hero and final compositions (heroWeight / calm), never mid-dive.
 */
export function CameraRig({ touch }: { touch: boolean }) {
  const camera = useThree((s) => s.camera)
  const path = useMemo(buildCameraPath, [])
  const smooth = useRef({ t: 0, px: 0, py: 0 })
  const pos = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])

  useFrame((_, dt) => {
    const s = smooth.current
    const k = Math.min(1, dt * 5.5)
    s.t += (sceneState.camT - s.t) * k

    path.pos.getPoint(THREE.MathUtils.clamp(s.t, 0, 1), pos)
    path.look.getPoint(THREE.MathUtils.clamp(s.t, 0, 1), look)

    const parallaxZone = Math.max(sceneState.heroWeight, sceneState.calm)
    const amp = touch ? 0 : 0.22 * parallaxZone
    const pk = Math.min(1, dt * 3)
    s.px += (sceneState.pointerX * amp - s.px) * pk
    s.py += (sceneState.pointerY * amp * 0.6 - s.py) * pk

    // pointerY is positive downward. Subtracting it corrects the vertical
    // response: pointer up → lattice rises, pointer down → lattice lowers.
    camera.position.set(pos.x - s.px, pos.y - s.py, pos.z)
    camera.lookAt(look)
  })

  return null
}
