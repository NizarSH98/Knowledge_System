import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { sceneState, setNarrative } from './sceneState'
import type { ExperienceMode } from '../../hooks/useExperienceMode'

gsap.registerPlugin(ScrollTrigger)

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1)
  return t * t * (3 - 2 * t)
}

/**
 * Binds page scroll to the Knowledge Lattice. Every scene value is a
 * pure function of ScrollTrigger progress, so fast scrolling and
 * reversing can never strand the system in a broken state.
 */
export function initScrollDirector(mode: ExperienceMode): () => void {
  const prefersCinematic = mode.cinematic
  const ctx = gsap.context(() => {
    /* ── Entry sequence: progressive reveal, content usable immediately ── */
    const entry = gsap.timeline({ defaults: { ease: 'power3.out' } })
    entry
      .from('.hero-line > span', { yPercent: 105, duration: 0.95, stagger: 0.09, delay: 0.12 })
      .from('.hero-kicker', { autoAlpha: 0, duration: 0.6 }, 0.35)
      .from('.hero-support', { autoAlpha: 0, y: 14, duration: 0.7 }, 0.55)
      .from('.hero-actions', { autoAlpha: 0, y: 12, duration: 0.7 }, 0.7)
      .from('.hero-foot', { autoAlpha: 0, duration: 0.8 }, 0.9)
      .to('.hero-annotation', { autoAlpha: 1, duration: 0.5, stagger: 0.12 }, 1.0)

    /* ── Hero: fragments begin ordering as the visitor commits ── */
    ScrollTrigger.create({
      trigger: '#top',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
      onUpdate(self) {
        if (!prefersCinematic) return
        sceneState.order = self.progress * 0.3
        sceneState.camT = self.progress * 0.13
        sceneState.heroWeight = 1 - smoothstep(0.1, 0.75, self.progress)
      },
    })

    /* ── Pinned cinematic sequence ── */
    if (prefersCinematic) {
      const chapters = gsap.utils.toArray<HTMLElement>('.inside-stage .inside-chapter')
      const ticks = gsap.utils.toArray<HTMLElement>('.inside-rail-tick')
      const n = chapters.length

      // Long holds: each chapter is readable for ~70% of its window
      const chapterTl = gsap.timeline({ paused: true })
      chapters.forEach((el, i) => {
        const s = i / n
        const e = (i + 1) / n
        const w = e - s
        chapterTl.fromTo(
          el,
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: w * 0.14, ease: 'power2.out' },
          s + w * 0.01,
        )
        if (i < n - 1) {
          chapterTl.to(
            el,
            { autoAlpha: 0, y: -22, duration: w * 0.12, ease: 'power2.in' },
            e - w * 0.13,
          )
        }
      })

      ScrollTrigger.create({
        trigger: '.inside-stage-wrap',
        start: 'top top',
        end: 'bottom bottom',
        pin: '.inside-stage',
        // The wrapper's own height provides the scroll distance
        pinSpacing: false,
        scrub: 0.8,
        onUpdate(self) {
          const p = self.progress
          chapterTl.progress(p)

          // Scene state as pure functions of progress (reversal-safe)
          sceneState.order = Math.min(1, 0.3 + p * 2.4)
          sceneState.conflict = Math.exp(-Math.pow((p - 0.24) * 14, 2)) * 0.85
          sceneState.permission = smoothstep(0.34, 0.46, p)
          sceneState.retrieval = p < 0.5 ? 0 : Math.min((p - 0.5) / 0.17, 1)
          sceneState.grounded = smoothstep(0.68, 0.8, p)
          sceneState.expansion = smoothstep(0.85, 0.96, p)
          sceneState.camT = 0.13 + p * 0.74
          sceneState.heroWeight = 0

          const idx = Math.min(Math.floor(p * n), n - 1)
          ticks.forEach((t, i) => t.classList.toggle('active', i <= idx))

          setNarrative(
            p < 0.17 ? 'indexing'
            : p < 0.34 ? 'indexing'
            : p < 0.5 ? 'permissioned'
            : p < 0.68 ? 'retrieving'
            : p < 0.85 ? 'grounded'
            : 'boundary',
          )
        },
      })
    }

    /* ── Editorial interlude: canvas is covered, suspend rendering ── */
    ScrollTrigger.create({
      trigger: '#outcomes',
      start: 'top top',
      endTrigger: '#founder',
      end: 'bottom 85%',
      onToggle(self) {
        sceneState.covered = self.isActive
        document.documentElement.classList.toggle('canvas-covered', self.isActive)
      },
    })

    /* ── Final resolution: the lattice settles ── */
    ScrollTrigger.create({
      trigger: '#assessment',
      start: 'top 80%',
      end: 'center center',
      scrub: 0.6,
      onUpdate(self) {
        if (!prefersCinematic) return
        const p = self.progress
        sceneState.calm = p
        sceneState.camT = 0.87 + p * 0.13
        sceneState.grounded = Math.max(sceneState.grounded, p)
        sceneState.order = 1
        sceneState.expansion = Math.max(0.35, sceneState.expansion) * (1 - p * 0.4)
        if (p > 0.5) setNarrative('calm')
      },
    })

    /* ── Narrative chip for the pre-pin zone ── */
    ScrollTrigger.create({
      trigger: '#problem',
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => setNarrative('fragmented'),
      onEnterBack: () => setNarrative('fragmented'),
    })

    /* ── Status chip collides with footer text; hide it there too ── */
    ScrollTrigger.create({
      trigger: '.footer',
      start: 'top 92%',
      end: 'bottom bottom',
      onToggle(self) {
        if (self.isActive) document.documentElement.classList.add('canvas-covered')
        else if (!sceneState.covered) document.documentElement.classList.remove('canvas-covered')
      },
    })

    /* ── Section header reveals (selective, headers only).
       opacity (not autoAlpha): visibility:hidden would drop links
       inside revealed blocks out of the keyboard tab order. ── */
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 24,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%' },
      })
    })
  })

  return () => {
    ctx.revert()
    ScrollTrigger.getAll().forEach((st) => st.kill())
  }
}
