import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { KnowledgeLattice } from '../scenes/KnowledgeLattice'
import { CameraRig } from './CameraRig'
import { Background } from './Background'
import { createSharedUniforms } from './uniforms'
import { FluidField } from '../systems/FluidField'
import { sceneState } from '../systems/sceneState'
import { degradeQuality, getQuality, onQualityChange } from '../performance/quality'
import { getTheme, onThemeChange } from '../../theme/theme'
import type { ExperienceMode } from '../../hooks/useExperienceMode'

const CLEAR_COLORS = { dark: '#0d0c0a', light: '#ece7db' }

const damp = (current: number, target: number, dt: number, lambda = 6) =>
  current + (target - current) * Math.min(1, dt * lambda)

/** Per-frame sync: sceneState (written by GSAP) → shared shader uniforms. */
function SceneSync({
  uniforms,
  fluid,
  frozen,
}: {
  uniforms: ReturnType<typeof createSharedUniforms>
  fluid: FluidField | null
  frozen: boolean
}) {
  const gl = useThree((s) => s.gl)
  const group = useRef<THREE.Group>(null)
  const layout = useRef({ x: 0, scale: 1 })

  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth
      layout.current.x = w >= 1240 ? 1.55 : w >= 980 ? 1.1 : 0
      layout.current.scale = w >= 980 ? 1 : 0.82
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const u = uniforms
    if (!frozen) u.uTime.value += dt

    // Cross-fade the whole scene palette when the theme toggles
    u.uTheme.value = damp(u.uTheme.value, getTheme() === 'light' ? 1 : 0, dt, 5)

    u.uOrder.value = damp(u.uOrder.value, sceneState.order, dt)
    u.uPermission.value = damp(u.uPermission.value, sceneState.permission, dt)
    u.uRetrieval.value = damp(u.uRetrieval.value, sceneState.retrieval, dt, 8)
    u.uGrounded.value = damp(u.uGrounded.value, sceneState.grounded, dt)
    u.uExpansion.value = damp(u.uExpansion.value, sceneState.expansion, dt)
    u.uCalm.value = damp(u.uCalm.value, sceneState.calm, dt)
    u.uConflict.value = damp(u.uConflict.value, sceneState.conflict, dt, 10)
    u.uPixelRatio.value = gl.getPixelRatio()

    if (fluid && getQuality().fluid && sceneState.heroWeight > 0.02 && !document.hidden) {
      fluid.update(gl, sceneState.pointerX, sceneState.pointerY, dt)
    }

    if (group.current) {
      const targetX = layout.current.x * sceneState.heroWeight
      group.current.position.x = damp(group.current.position.x, targetX, dt, 4)
      const s = layout.current.scale
      group.current.scale.set(s, s, s)
    }
  })

  return (
    <group ref={group}>
      <KnowledgeLattice uniforms={uniforms} />
    </group>
  )
}

/** Rolling FPS check; steps the quality tier down when the frame rate sags. */
function AdaptiveQuality() {
  const setDpr = useThree((s) => s.setDpr)
  const acc = useRef({ frames: 0, time: 0, settled: 0 })

  useEffect(() => {
    const off = onQualityChange((p) => {
      setDpr(Math.min(window.devicePixelRatio, p.maxDpr))
    })
    return off
  }, [setDpr])

  useFrame((_, dt) => {
    const a = acc.current
    a.frames += 1
    a.time += dt
    if (a.time >= 2.5) {
      const fps = a.frames / a.time
      a.frames = 0
      a.time = 0
      // Ignore the first window (shader compilation spikes)
      if (a.settled < 1) {
        a.settled += 1
        return
      }
      if (fps < 32) degradeQuality()
    }
  })
  return null
}

/** Keeps the renderer clear color aligned with CSS and cleans up its listener. */
function CanvasThemeSync() {
  const gl = useThree((s) => s.gl)
  useEffect(() => {
    const sync = (theme: 'light' | 'dark') => {
      gl.setClearColor(new THREE.Color(CLEAR_COLORS[theme]))
    }
    sync(getTheme())
    return onThemeChange(sync)
  }, [gl])
  return null
}

/** Suspends the frameloop while opaque editorial sections cover the canvas. */
function CoverGate() {
  const set = useThree((s) => s.set)
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    let paused = false
    const id = window.setInterval(() => {
      if (sceneState.covered !== paused) {
        paused = sceneState.covered
        set({ frameloop: paused ? 'never' : 'always' })
        if (!paused) invalidate()
      }
    }, 250)
    return () => window.clearInterval(id)
  }, [set, invalidate])
  return null
}

/** Static pose for prefers-reduced-motion: render briefly, then freeze. */
function StaticPose() {
  const set = useThree((s) => s.set)
  useEffect(() => {
    sceneState.order = 1
    sceneState.permission = 0.65
    sceneState.grounded = 1
    sceneState.calm = 1
    sceneState.camT = 0.02
    sceneState.heroWeight = 1
    const id = window.setTimeout(() => set({ frameloop: 'never' }), 2500)
    return () => window.clearTimeout(id)
  }, [set])
  return null
}

function PointerTracker() {
  useEffect(() => {
    let lastX = 0
    let lastY = 0
    let lastT = performance.now()
    const onMove = (e: PointerEvent) => {
      const now = performance.now()
      const dt = Math.max(now - lastT, 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      sceneState.pointerSpeed = Math.hypot(x - lastX, y - lastY) / dt
      sceneState.pointerX = x
      sceneState.pointerY = y
      lastX = x
      lastY = y
      lastT = now
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return null
}

export default function ExperienceCanvas({ mode }: { mode: ExperienceMode }) {
  const uniforms = useMemo(createSharedUniforms, [])
  const [fluid, setFluid] = useState<FluidField | null>(null)

  useEffect(() => {
    if (mode.touch || mode.reducedMotion || !getQuality().fluid) return
    const field = new FluidField()
    setFluid(field)
    return () => field.dispose()
  }, [mode])

  return (
    <div className="canvas-root" aria-hidden="true">
      <Canvas
        camera={{ fov: 50, near: 0.1, far: 60, position: [0, 0.35, 7.6] }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={[1, getQuality().maxDpr]}
      >
        <CanvasThemeSync />
        <SceneSync uniforms={uniforms} fluid={fluid} frozen={mode.reducedMotion} />
        <Background uniforms={uniforms} fluid={fluid} />
        <CameraRig touch={mode.touch} />
        <AdaptiveQuality />
        {mode.cinematic ? <CoverGate /> : null}
        {mode.reducedMotion ? <StaticPose /> : null}
      </Canvas>
      {!mode.touch && !mode.reducedMotion ? <PointerTracker /> : null}
    </div>
  )
}
