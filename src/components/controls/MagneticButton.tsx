import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { detectExperienceMode } from '../../hooks/useExperienceMode'

type Props = {
  href: string
  variant: 'primary' | 'secondary'
  large?: boolean
  className?: string
  download?: string
  children: ReactNode
}

/**
 * Weighted magnetic attraction. The anchor itself never moves its hit
 * target semantics: keyboard focus, touch, and reduced motion all see
 * a plain link. Attraction radius is small and the pull is damped.
 */
export function MagneticButton({ href, variant, large, className, download, children }: Props) {
  const wrap = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const mode = detectExperienceMode()
    const el = wrap.current
    if (!el || mode.touch || mode.reducedMotion) return

    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let active = false

    const tick = () => {
      cx += (tx - cx) * 0.12
      cy += (ty - cy) * 0.12
      el.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`
      if (Math.abs(cx - tx) > 0.05 || Math.abs(cy - ty) > 0.05 || active) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = 0
        el.style.transform = ''
      }
    }

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const mx = e.clientX - (r.left + r.width / 2)
      const my = e.clientY - (r.top + r.height / 2)
      const dist = Math.hypot(mx, my)
      const radius = Math.max(r.width, 110)
      if (dist < radius) {
        active = true
        const pull = (1 - dist / radius) * 0.32
        tx = mx * pull
        ty = my * pull
      } else {
        active = false
        tx = 0
        ty = 0
      }
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onLeave = () => {
      active = false
      tx = 0
      ty = 0
      if (!raf) raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <span ref={wrap} className="magnetic">
      <a
        href={href}
        download={download}
        className={`btn btn-${variant}${large ? ' btn-large' : ''}${className ? ` ${className}` : ''}`}
      >
        <span className="btn-node" aria-hidden="true" />
        {children}
      </a>
    </span>
  )
}
