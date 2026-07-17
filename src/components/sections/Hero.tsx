import { hero } from '../../content/copy'
import { assessmentMailto } from '../../config/site'
import { MagneticButton } from '../controls/MagneticButton'
import { KineticWord } from '../typography/KineticWord'
import { StaticLattice } from '../StaticLattice'

const ANNOTATIONS = [
  { top: '6%', left: '10%', text: 'SRC 001 — Operations Manual', em: 'v3.2', mod: '' },
  { top: '26%', left: '34%', text: 'SRC 002 — Research Archive', em: 'approved', mod: 'verified' },
  { top: '48%', left: '2%', text: 'Project Delta Decision Log', em: 'superseded', mod: 'restricted' },
  { top: '68%', left: '28%', text: 'SRC 007 — Field Report 024', em: 'current', mod: '' },
  { top: '88%', left: '12%', text: 'index', em: 'forming', mod: '' },
]

export function Hero() {
  return (
    <section id="top" className="section hero" aria-label="Introduction">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="kicker hero-kicker">{hero.kicker}</p>
          <h1>
            <span className="hero-line">
              <span>{hero.headlineA}</span>
            </span>
            <span className="hero-line">
              <span>
                {hero.headlineB} <KineticWord>{hero.headlineAccent}</KineticWord>
              </span>
            </span>
          </h1>
          <p className="hero-support">{hero.support}</p>
          <div className="hero-actions">
            <MagneticButton href={assessmentMailto()} variant="primary" large>
              {hero.primaryCta}
            </MagneticButton>
            <MagneticButton href="#how-it-works" variant="secondary" large>
              {hero.secondaryCta}
            </MagneticButton>
          </div>
        </div>
        <div className="hero-stage">
          <StaticLattice className="static-lattice" />
          <div className="hero-annotations" aria-hidden="true">
            {ANNOTATIONS.map((a) => (
              <span
                key={a.text}
                className={`hero-annotation${a.mod ? ` hero-annotation--${a.mod}` : ''}`}
                style={{ top: a.top, left: a.left }}
              >
                {a.text} — <em>{a.em}</em>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="hero-foot">
        <span className="scroll-hint">{hero.scrollHint}</span>
        <span className="hero-coord">KS · 33.88°N 35.5°E · demonstration data</span>
      </div>
    </section>
  )
}
