import { lazy, Suspense, useEffect } from 'react'
import { directions } from '../directions/registry.ts'
import { assessmentMailto, CONTACT_EMAIL } from '../config/site.ts'
import { RouteLink } from '../shared/components/RouteLink.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { routeHref, useRoute } from './router.ts'
import { V2_ROUTES } from './routes.ts'

const ObservatoryPage = lazy(async () => {
  const module = await import('../directions/observatory/ObservatoryPage.tsx')
  return { default: module.ObservatoryPage }
})

const InstitutionalOSPage = lazy(async () => {
  const module = await import('../directions/institutional-os/InstitutionalOSPage.tsx')
  return { default: module.InstitutionalOSPage }
})

const LivingArchivePage = lazy(async () => {
  const module = await import('../directions/living-archive/LivingArchivePage.tsx')
  return { default: module.LivingArchivePage }
})

const ComparePlaceholderPage = lazy(async () => {
  const module = await import('./pages/ComparePlaceholderPage.tsx')
  return { default: module.ComparePlaceholderPage }
})

export function V2App() {
  const route = useRoute()
  const direction = directions.find((candidate) => candidate.route === route)
  const homeHref = routeHref(V2_ROUTES.home)

  useEffect(() => {
    document.title = direction
      ? `${direction.name} · Knowledge Systems`
      : route === V2_ROUTES.compare
        ? 'Compare the Knowledge Systems demonstration'
        : 'Knowledge Systems · Organizational Knowledge Infrastructure for AI'
  }, [direction, route])

  return (
    <div className={`v2-shell${direction ? ` v2-shell--${direction.id}` : ''}`}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="shell-header">
        <RouteLink className="wordmark" to={V2_ROUTES.home} aria-label="Knowledge Systems V2 home">
          <span>Knowledge</span><span>Systems</span>
        </RouteLink>
        <nav aria-label="Primary navigation">
          <a href={`${homeHref}#system`}>What it does</a>
          <a href={`${homeHref}#approach`}>How we work</a>
          <a href={`${homeHref}#demonstration`}>Demonstration</a>
          <a href={`${homeHref}#trust`}>Trust</a>
        </nav>
        <a className="shell-assessment" href={assessmentMailto()}>Assess a workflow</a>
      </header>

      <Suspense fallback={<main id="main-content" className="route-loading"><p>Preparing exploration…</p></main>}>
        {direction?.id === 'observatory' ? (
          <ObservatoryPage />
        ) : direction?.id === 'institutional-os' ? (
          <InstitutionalOSPage />
        ) : direction?.id === 'living-archive' ? (
          <LivingArchivePage />
        ) : route === V2_ROUTES.compare ? (
          <ComparePlaceholderPage />
        ) : (
          <HomePage />
        )}
      </Suspense>

      <footer className="shell-footer">
        <div><strong>Knowledge Systems</strong><p>Private organizational knowledge infrastructure for AI.</p></div>
        <div><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a><p>The demonstration uses synthetic organizations, people, projects, suppliers, and records.</p></div>
      </footer>
    </div>
  )
}
