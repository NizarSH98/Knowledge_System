import { Component, lazy, Suspense, useEffect, useMemo, useState } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { NavBar } from './components/navigation/NavBar'
import { Hero } from './components/sections/Hero'
import { Problem } from './components/sections/Problem'
import { InsideSystem } from './components/sections/InsideSystem'
import { Outcomes } from './components/sections/Outcomes'
import { Engagement } from './components/sections/Engagement'
import { Principles } from './components/sections/Principles'
import { Fit } from './components/sections/Fit'
import { Founder } from './components/sections/Founder'
import { FinalCta } from './components/sections/FinalCta'
import { Footer } from './components/sections/Footer'
import { SystemStatus } from './components/SystemStatus'
import { detectExperienceMode, demoteToStatic } from './hooks/useExperienceMode'
import { initScrollDirector } from './experience/systems/scrollDirector'

const ExperienceCanvas = lazy(() => import('./experience/canvas/ExperienceCanvas'))

class CanvasBoundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('WebGL experience failed; using static fallback.', error, info)
    this.props.onFail()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function App() {
  const initialMode = useMemo(detectExperienceMode, [])
  const [mode, setMode] = useState(initialMode)

  useEffect(() => {
    if (mode.reducedMotion) return
    const cleanup = initScrollDirector(mode)
    return cleanup
  }, [mode])

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <NavBar />
      <main id="main">
        <Hero />
        <Problem />
        <InsideSystem />
        <Outcomes />
        <Engagement />
        <Principles />
        <Fit />
        <Founder />
        <FinalCta />
      </main>
      <Footer />
      <SystemStatus />
      <div className="grain" aria-hidden="true" />
      {mode.webgl ? (
        <CanvasBoundary
          onFail={() => {
            demoteToStatic()
            setMode(detectExperienceMode())
          }}
        >
          <Suspense fallback={null}>
            <ExperienceCanvas mode={mode} />
          </Suspense>
        </CanvasBoundary>
      ) : null}
    </>
  )
}
