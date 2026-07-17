import { finalCta } from '../../content/copy'
import { assessmentMailto } from '../../config/site'
import { MagneticButton } from '../controls/MagneticButton'

export function FinalCta() {
  return (
    <section id="assessment" className="section final" aria-labelledby="final-title">
      <div className="final-inner" data-reveal>
        <h2 id="final-title">{finalCta.title}</h2>
        <p className="final-support">{finalCta.support}</p>
        <div className="final-action">
          <MagneticButton href={assessmentMailto()} variant="primary" large>
            {finalCta.cta}
          </MagneticButton>
        </div>
        <p className="final-microcopy">{finalCta.microcopy}</p>
      </div>
    </section>
  )
}
