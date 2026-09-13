import { useSyncExternalStore } from 'react'
import { V2_ROUTES, type V2Route } from './routes.ts'

const listeners = new Set<() => void>()

function emitRouteChange(): void {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  window.addEventListener('popstate', emitRouteChange)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) window.removeEventListener('popstate', emitRouteChange)
  }
}

function routeFromPathname(pathname: string): V2Route {
  const v2Index = pathname.lastIndexOf('/v2')
  const v2Path = v2Index >= 0 ? pathname.slice(v2Index).replace(/\/$/, '') : '/v2'
  const routes = Object.values(V2_ROUTES) as readonly V2Route[]
  return routes.includes(v2Path as V2Route) ? v2Path as V2Route : V2_ROUTES.home
}

function currentRoute(): V2Route {
  return routeFromPathname(window.location.pathname)
}

export function navigate(route: V2Route): void {
  if (currentRoute() === route) return
  const query = window.location.search
  window.history.pushState(null, '', `${route}${query}`)
  emitRouteChange()
  window.scrollTo({ top: 0, behavior: 'instant' })
}

export function useRoute(): V2Route {
  return useSyncExternalStore(subscribe, currentRoute, () => V2_ROUTES.home)
}
