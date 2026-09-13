import type { DirectionDefinition } from '../../directions/registry.ts'
import { useDirectionTheme } from '../../themes/useDirectionTheme.ts'
import type { V2Route } from '../routes.ts'
import { DirectionSwitcher } from '../components/DirectionSwitcher.tsx'
import { FoundationRenderer } from '../components/FoundationRenderer.tsx'
import { PaletteSelector } from '../components/PaletteSelector.tsx'
import { QueryProbe } from '../components/QueryProbe.tsx'

interface DirectionFoundationPageProps {
  readonly direction: DirectionDefinition
  readonly route: V2Route
}

export function DirectionFoundationPage({ direction, route }: DirectionFoundationPageProps) {
  const { theme, options, selectTheme } = useDirectionTheme(direction.id)

  return (
    <main id="main-content" className="foundation-page">
      <DirectionSwitcher currentRoute={route} />
      <header className="foundation-hero">
        <div>
          <p className="eyebrow">Direction {direction.index} · foundation preview</p>
          <h1>{direction.name}</h1>
          <p className="foundation-hero__metaphor">{direction.metaphor}</p>
        </div>
        <div className="not-designed-stamp">
          <span>Design surface</span>
          <strong>Intentionally withheld</strong>
          <small>Begins at its dedicated checkpoint</small>
        </div>
      </header>

      <PaletteSelector value={theme.id} options={options} onChange={selectTheme} />

      <div className="foundation-facts">
        <div><span>Spatial model</span><p>{direction.spatialModel}</p></div>
        <div><span>Navigation model</span><p>{direction.navigationModel}</p></div>
        <div><span>WebGPU role</span><p>{direction.webGpuDependency}</p></div>
      </div>

      <FoundationRenderer theme={theme} />
      <QueryProbe />
    </main>
  )
}
