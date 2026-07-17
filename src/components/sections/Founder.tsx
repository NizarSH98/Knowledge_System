import { founder } from '../../content/copy'

export function Founder() {
  return (
    <section id="founder" className="section founder" aria-labelledby="founder-title">
      <div className="founder-inner">
        <span className="section-no" aria-hidden="true">{founder.number}</span>
        <div data-reveal>
          <h2 id="founder-title" className="kicker">
            {founder.title}
          </h2>
          <p className="founder-body">{founder.body}</p>
          <p className="founder-note">{founder.note}</p>
        </div>
      </div>
    </section>
  )
}
