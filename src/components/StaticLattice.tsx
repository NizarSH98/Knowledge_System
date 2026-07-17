/**
 * Static SVG rendition of the Knowledge Lattice: the WebGL fallback
 * (and the basis of the OG image). Sources on two rings, permission
 * membrane, answer surface with citation tethers, action boundary.
 * Colors come from CSS classes so both themes render correctly.
 */
export function StaticLattice({ className }: { className?: string }) {
  const sourceLabels = [
    'OPS MANUAL', 'RESEARCH', 'FIELD REPORT', 'PROCUREMENT', 'MAINTENANCE', 'DECISION LOG',
    'SAFETY', 'HR HANDBOOK', 'SITE SURVEY', 'CONTRACTS', 'TRAINING', 'INCIDENTS', 'BUDGET', 'MINUTES',
  ]
  const inner = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 + 0.35
    return { x: 300 + Math.cos(a) * 95, y: 300 + Math.sin(a) * 95, cited: i % 2 === 0, label: sourceLabels[i] }
  })
  const outer = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2
    return { x: 300 + Math.cos(a) * 168, y: 300 + Math.sin(a) * 168, restricted: i % 3 === 0, label: sourceLabels[i + 6] }
  })

  return (
    <svg viewBox="0 0 600 600" className={className} role="img" aria-label="Diagram of the knowledge lattice: approved sources connected inside a permission boundary, with citation lines from a grounded answer back to its sources">
      {/* action boundary — dashed, outside the trusted core */}
      <circle className="sl-accent" cx="300" cy="300" r="264" fill="none" strokeWidth="1" strokeDasharray="4 9" opacity="0.55" />
      {/* permission membrane */}
      <circle className="sl-struct" cx="300" cy="300" r="205" fill="none" strokeWidth="0.8" opacity="0.3" />
      <circle className="sl-accent" cx="300" cy="300" r="205" fill="none" strokeWidth="0.6" strokeDasharray="2 6" opacity="0.5" />

      {inner.map((n, i) => (
        <line key={`li${i}`} className="sl-struct" x1="300" y1="300" x2={n.x} y2={n.y} strokeWidth="0.6" opacity="0.25" />
      ))}
      {outer.map((n, i) => (
        <line key={`lo${i}`} className="sl-struct" x1={inner[i % 6].x} y1={inner[i % 6].y} x2={n.x} y2={n.y} strokeWidth="0.5" opacity="0.18" />
      ))}

      {/* citation tethers to the answer surface */}
      {inner.filter((n) => n.cited).map((n, i) => (
        <line key={`c${i}`} className="sl-spectral" x1="300" y1="392" x2={n.x} y2={n.y} strokeWidth="1" opacity="0.75" />
      ))}

      {/* grounded answer — text without a card plate */}
      <text className="sl-text sl-answer" x="300" y="382" textAnchor="middle">GROUNDED ANSWER</text>
      <text className="sl-text sl-detail" x="300" y="397" textAnchor="middle">3 verified citations</text>
      <circle className="sl-spectral-fill" cx="342" cy="380" r="2.2" />
      <circle className="sl-spectral-fill" cx="342" cy="392" r="2.2" />

      {/* semantic core */}
      <text className="sl-text sl-core" x="300" y="296" textAnchor="middle">TRUSTED KNOWLEDGE</text>
      <text className="sl-text sl-detail" x="300" y="312" textAnchor="middle">permission aware</text>

      {inner.map((n, i) => (
        <text
          key={`ni${i}`}
          className={n.cited ? 'sl-text sl-source sl-source--cited' : 'sl-text sl-source'}
          x={n.x}
          y={n.y}
          textAnchor="middle"
          opacity="0.9"
        >{n.label}</text>
      ))}
      {outer.map((n, i) => (
        <text
          key={`no${i}`}
          className={n.restricted ? 'sl-text sl-source sl-source--restricted' : 'sl-text sl-source'}
          x={n.x}
          y={n.y}
          textAnchor="middle"
          opacity="0.8"
        >{n.label}</text>
      ))}
    </svg>
  )
}
