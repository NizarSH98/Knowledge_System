import { directions } from '../../directions/registry.ts'
import type { V2Route } from '../routes.ts'
import { RouteLink } from '../../shared/components/RouteLink.tsx'

interface DirectionSwitcherProps {
  readonly currentRoute: V2Route
}

export function DirectionSwitcher({ currentRoute }: DirectionSwitcherProps) {
  return (
    <nav className="direction-switcher" aria-label="Development direction switcher">
      <span>Direction</span>
      {directions.map((direction) => (
        <RouteLink
          key={direction.id}
          to={direction.route as V2Route}
          aria-current={currentRoute === direction.route ? 'page' : undefined}
        >
          <b>{direction.index}</b> {direction.name}
        </RouteLink>
      ))}
    </nav>
  )
}
