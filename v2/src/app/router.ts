import { useSyncExternalStore } from 'react'
import { V2_ROUTES, type V2Route } from './routes.ts'

const listeners = new Set<() => void>()
const routeValues = Object.values(V2_ROUTES) as readonly V2Route[]

function deploymentBase(): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return base === '' ? '' : base
}

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
  const base = deploymentBase()
  const withoutBase = base && (pathname === base || pathname.startsWith(`${base}/`))
    ? pathname.slice(base.length)
    : pathname
  const normalized = withoutBase === '' ? '/' : withoutBase.replace(/\/$/, '') || '/'
  return routeValues.includes(normalized as V2Route) ? normalized as V2Route : V2_ROUTES.home
}

function currentRoute(): V2Route {
  return routeFromPathname(window.location.pathname)
}

export function navigate(route: V2Route): void {
  if (currentRoute() === route) return
  const query = window.location.search
  window.history.pushState(null, '', `${routeHref(route)}${query}`)
  emitRouteChange()
  window.scrollTo({ top: 0, behavior: 'instant' })
}

export function routeHref(route: V2Route): string {
  const base = deploymentBase()
  if (route === V2_ROUTES.home) return `${base || ''}/`
  return `${base}${route}`
}

export function useRoute(): V2Route {
  return useSyncExternalStore(subscribe, currentRoute, () => V2_ROUTES.home)
}
