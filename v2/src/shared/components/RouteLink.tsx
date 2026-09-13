import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { navigate, routeHref } from '../../app/router.ts'
import type { V2Route } from '../../app/routes.ts'

interface RouteLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  readonly to: V2Route
}

export function RouteLink({ to, onClick, ...props }: RouteLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>): void {
    onClick?.(event)
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) return

    event.preventDefault()
    navigate(to)
  }

  return <a href={routeHref(to)} onClick={handleClick} {...props} />
}
