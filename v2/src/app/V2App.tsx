import { lazy, Suspense, useEffect } from 'react'
import { directions } from '../directions/registry.ts'
import { RouteLink } from '../shared/components/RouteLink.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { useRoute } from './router.ts'
import { V2_ROUTES } from './routes.ts'

const DirectionFoundationPage = lazy(async () => {
  const module = await import('./pages/DirectionFoundationPage.tsx')
  return { default: module.DirectionFoundationPage }
})

const ObservatoryPage = lazy(async () => {
  const module = await import('../directions/observatory/ObservatoryPage.tsx')
  return { default: module.ObservatoryPage }
})

const ComparePlaceholderPage = lazy(async () => {
  const module = await import('./pages/ComparePlaceholderPage.tsx')
  return { default: module.ComparePlaceholderPage }
})

export function V2App() {
  const route = useRoute()
  const direction = directions.find((candidate) => candidate.route === route)

  useEffect(() => {
    const label = direction?.name ?? (route === V2_ROUTES.compare ? 'Compare' : 'Exploration')
    document.title = `${label} · Knowledge Systems V2`
  }, [direction, route])

  return (
    <div className={`v2-shell${direction ? ` v2-shell--${direction.id}` : ''}`}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="shell-header">
        <RouteLink className="wordmark" to={V2_ROUTES.home} aria-label="Knowledge Systems V2 home">
          <span>Knowledge</span><span>Systems</span>
        </RouteLink>
        <nav aria-label="Exploration navigation">
          <RouteLink to={V2_ROUTES.home} aria-current={route === V2_ROUTES.home ? 'page' : undefined}>Directions</RouteLink>
          <RouteLink to={V2_ROUTES.compare} aria-current={route === V2_ROUTES.compare ? 'page' : undefined}>Compare</RouteLink>
        </nav>
      </header>

      <Suspense fallback={<main id="main-content" className="route-loading"><p>Preparing exploration…</p></main>}>
        {direction?.id === 'observatory' ? (
          <ObservatoryPage />
        ) : direction ? (
          <DirectionFoundationPage direction={direction} route={route} />
        ) : route === V2_ROUTES.compare ? (
          <ComparePlaceholderPage />
        ) : (
          <HomePage />
        )}
      </Suspense>

      <footer className="shell-footer">
        <p>Knowledge Systems V2 exploration</p>
        <p>All Asteria records, people, suppliers, and projects are synthetic.</p>
      </footer>
    </div>
  )
}
