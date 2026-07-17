import { principles } from '../../content/copy'

export function Principles() {
  return (
    <section id="principles" className="section principles surface-dark" aria-labelledby="principles-title">
      <div className="section-inner">
        <header className="section-head" data-reveal>
          <span className="section-no" aria-hidden="true">{principles.number}</span>
          <div>
            <h2 id="principles-title">{principles.title}</h2>
            <p className="principles-lede">{principles.lede}</p>
          </div>
        </header>
        <div className="principles-board frame">
          <span className="frame-tick" aria-hidden="true" />
          <div className="principles-grid">
            {principles.items.map((p) => (
              <article key={p.id} className="principle">
                <span className="mono-label" aria-hidden="true">
                  {p.id}
                </span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
