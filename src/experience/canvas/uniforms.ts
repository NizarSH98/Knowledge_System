import * as THREE from 'three'
import { getTheme } from '../../theme/theme'

export type SharedUniforms = {
  uTime: THREE.IUniform<number>
  uOrder: THREE.IUniform<number>
  uPermission: THREE.IUniform<number>
  uRetrieval: THREE.IUniform<number>
  uGrounded: THREE.IUniform<number>
  uExpansion: THREE.IUniform<number>
  uCalm: THREE.IUniform<number>
  uConflict: THREE.IUniform<number>
  uPulseOrigin: THREE.IUniform<THREE.Vector3>
  uPixelRatio: THREE.IUniform<number>
  /** 0 = dark instrument palette · 1 = light paper palette */
  uTheme: THREE.IUniform<number>
  [key: string]: THREE.IUniform
}

export function createSharedUniforms(): SharedUniforms {
  return {
    uTime: { value: 0 },
    uOrder: { value: 0 },
    uPermission: { value: 0 },
    uRetrieval: { value: 0 },
    uGrounded: { value: 0 },
    uExpansion: { value: 0 },
    uCalm: { value: 0 },
    uConflict: { value: 0 },
    uPulseOrigin: { value: new THREE.Vector3(0, -0.2, 2.3) },
    uPixelRatio: { value: 1 },
    uTheme: { value: getTheme() === 'light' ? 1 : 0 },
  }
}
