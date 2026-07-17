import { outcomes } from '../../content/copy'

export function Outcomes() {
  return (
    <section id="outcomes" className="section outcomes surface-light" aria-labelledby="outcomes-title">
      <div className="section-inner">
        <header className="section-head" data-reveal>
          <span className="section-no" aria-hidden="true">{outcomes.number}</span>
          <div>
            <h2 id="outcomes-title">{outcomes.title}</h2>
            <p className="outcomes-lede">{outcomes.lede}</p>
          </div>
        </header>
        <div className="outcomes-grid">
          {outcomes.items.map((o) => (
            <article key={o.id} className="outcome">
              <div className="outcome-meta">
                <span className="mono-label" aria-hidden="true">
                  {o.id}
                </span>
                <span className="outcome-tag">{o.tag}</span>
              </div>
              <h3>{o.title}</h3>
              <p>{o.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
