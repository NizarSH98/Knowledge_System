import { useEffect, useRef } from 'react'
import { detectExperienceMode } from '../../hooks/useExperienceMode'

/**
 * Kinetic typography: the word gains structure as the pointer
 * approaches — Fraunces' SOFT and WONK axes settle toward a precise
 * letterform. Static under touch / reduced motion.
 */
export function KineticWord({ children }: { children: string }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const mode = detectExperienceMode()
    const el = ref.current
    if (!el || mode.touch || mode.reducedMotion) return

    let raf = 0
    let current = 0
    let target = 0

    const tick = () => {
      current += (target - current) * 0.08
      const soft = 100 - current * 100
      const wonk = 1 - current
      const wght = 440 + current * 140
      el.style.fontVariationSettings = `'SOFT' ${soft.toFixed(1)}, 'WONK' ${wonk.toFixed(2)}, 'opsz' 60, 'wght' ${wght.toFixed(0)}`
      if (Math.abs(target - current) > 0.004) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = 0
      }
    }

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const d = Math.hypot(
        e.clientX - (r.left + r.width / 2),
        e.clientY - (r.top + r.height / 2),
      )
      target = 1 - Math.min(Math.max((d - 60) / 320, 0), 1)
      if (!raf) raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <em ref={ref} className="accent-word">
      {children}
    </em>
  )
}
