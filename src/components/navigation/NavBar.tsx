import { useEffect, useRef, useState } from 'react'
import { nav } from '../../content/copy'
import { assessmentMailto } from '../../config/site'
import { MagneticButton } from '../controls/MagneticButton'
import { getTheme, onThemeChange, toggleTheme } from '../../theme/theme'

function ThemeToggle() {
  const [theme, setTheme] = useState(getTheme)
  useEffect(() => onThemeChange(setTheme), [])
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      onClick={() => setTheme(toggleTheme())}
    >
      <span className="theme-toggle-glyph" aria-hidden="true" />
      {theme === 'light' ? 'dark' : 'light'}
    </button>
  )
}

function Wordmark() {
  return (
    <a href="#top" className="wordmark" aria-label="Knowledge Systems — back to top">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2 L22 12 L12 22 L2 12 Z" stroke="currentColor" strokeWidth="1.4" />
        <path d="M12 7 L17 12 L12 17 L7 12 Z" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      </svg>
      <span>
        <b>Knowledge</b> <span>Systems</span>
      </span>
    </a>
  )
}

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        setScrolled(window.scrollY > 24)
        const max = document.documentElement.scrollHeight - window.innerHeight
        const p = max > 0 ? window.scrollY / max : 0
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${p.toFixed(4)})`
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuBtnRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav-inner">
        <Wordmark />
        <nav aria-label="Primary">
          <ul className="nav-links">
            {nav.links.map((l) => (
              <li key={l.href}>
                <a className="nav-link" href={l.href}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
        <div className="nav-cta-slot">
          <MagneticButton href={assessmentMailto()} variant="primary">
            {nav.cta}
          </MagneticButton>
        </div>
        <button
          ref={menuBtnRef}
          type="button"
          className="nav-menu-btn"
          aria-expanded={open}
          aria-controls="nav-overlay"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      <div className="nav-progress" aria-hidden="true">
        <div ref={progressRef} className="nav-progress-bar" />
      </div>
      <div id="nav-overlay" className={`nav-overlay${open ? ' open' : ''}`}>
        <nav aria-label="Mobile">
          <ul>
            {nav.links.map((l) => (
              <li key={l.href}>
                <a className="nav-link" href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-overlay-cta">
          <a href={assessmentMailto()} className="btn btn-primary" onClick={() => setOpen(false)}>
            <span className="btn-node" aria-hidden="true" />
            {nav.cta}
          </a>
        </div>
        <div className="nav-overlay-theme">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
