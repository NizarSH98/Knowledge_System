import { useEffect, useRef, useState } from 'react'
import { detectGraphicsCapabilities } from '../../graphics/capability/detect.ts'
import type { GraphicsCapabilities, QualityDecision } from '../../graphics/capability/types.ts'
import { AdaptiveQualityMonitor, selectInitialQuality, staticQuality } from '../../graphics/quality/quality.ts'
import { createRenderer } from '../../graphics/renderer/create-renderer.ts'
import type { RendererAdapter } from '../../graphics/renderer/types.ts'
import type { ThemeDefinition } from '../../themes/tokens.ts'

interface FoundationRendererProps {
  readonly theme: ThemeDefinition
}

export function FoundationRenderer({ theme }: FoundationRendererProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const adapterRef = useRef<RendererAdapter | null>(null)
  const qualityMonitorRef = useRef<AdaptiveQualityMonitor | null>(null)
  const [capabilities] = useState<GraphicsCapabilities>(() => detectGraphicsCapabilities())
  const [quality, setQuality] = useState<QualityDecision>(() => selectInitialQuality(capabilities))
  const [backendLabel, setBackendLabel] = useState(
    capabilities.backend === 'static' ? 'Static · DOM/SVG' : 'Initializing renderer…',
  )

  useEffect(() => {
    qualityMonitorRef.current = new AdaptiveQualityMonitor(quality, setQuality)
    return () => {
      qualityMonitorRef.current = null
    }
  }, [quality])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let cancelled = false
    setBackendLabel(quality.tier === 'static' ? 'Static · DOM/SVG' : 'Initializing renderer…')

    void createRenderer({
      host,
      theme,
      quality,
      capabilities,
      onFrameDuration: (durationMs) => qualityMonitorRef.current?.sample(durationMs),
    }).then((adapter) => {
      if (cancelled) {
        adapter?.dispose()
        return
      }
      adapterRef.current = adapter
      setBackendLabel(adapter?.backendLabel ?? 'Static · DOM/SVG')
      if (!adapter && quality.tier !== 'static') {
        setQuality(staticQuality('Runtime renderer initialization failed'))
      }
    })

    return () => {
      cancelled = true
      adapterRef.current?.dispose()
      adapterRef.current = null
    }
  }, [capabilities, quality])

  useEffect(() => {
    adapterRef.current?.setTheme(theme)
  }, [theme])

  return (
    <section className="renderer-foundation" aria-labelledby="renderer-foundation-title">
      <div className="renderer-foundation__head">
        <div>
          <p className="eyebrow">Renderer foundation</p>
          <h2 id="renderer-foundation-title">One result, progressive representations</h2>
        </div>
        <dl className="runtime-status" aria-label="Graphics runtime">
          <div><dt>Backend</dt><dd data-testid="backend-status">{backendLabel}</dd></div>
          <div><dt>Quality</dt><dd>{quality.tier}</dd></div>
          <div><dt>Motion</dt><dd>{capabilities.reducedMotion ? 'Reduced' : 'Standard'}</dd></div>
        </dl>
      </div>

      <div className="pipeline-visual">
        <div ref={hostRef} className="foundation-canvas-host" aria-hidden="true" />
        <ol className="pipeline-steps" aria-label="Equivalent structured retrieval representation">
          <li>Sources</li>
          <li>Permissions</li>
          <li>Versions</li>
          <li>Evidence</li>
          <li>Answer</li>
        </ol>
      </div>
      <p className="foundation-note">
        The canvas mirrors this five-stage system. It carries no exclusive information and can disappear without changing the workflow.
      </p>
    </section>
  )
}
