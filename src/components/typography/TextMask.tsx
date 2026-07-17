/**
 * Large text-reveal mask: a parchment surface with the word cut out,
 * so the fixed WebGL lattice behind the page is visible inside the
 * letterforms. Purely decorative — the section heading carries the
 * semantics — hence aria-hidden.
 */
export function TextMask({ word }: { word: string }) {
  return (
    <div className="mask-strip" aria-hidden="true">
      <svg viewBox="0 0 1200 250" preserveAspectRatio="xMidYMid meet">
        <defs>
          <mask id="ks-textmask" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="250">
            <rect width="1200" height="250" fill="#fff" />
            <text
              x="600"
              y="196"
              textAnchor="middle"
              fill="#000"
              style={{
                fontFamily: 'var(--font-editorial)',
                fontWeight: 640,
                fontSize: 218,
                letterSpacing: '0.01em',
              }}
              textLength="1140"
              lengthAdjust="spacingAndGlyphs"
            >
              {word}
            </text>
          </mask>
        </defs>
        <rect width="1200" height="250" fill="var(--mask-surface)" mask="url(#ks-textmask)" />
      </svg>
    </div>
  )
}
