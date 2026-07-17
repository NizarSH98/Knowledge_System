import { problem } from '../../content/copy'

export function Problem() {
  return (
    <section id="problem" className="section problem" aria-labelledby="problem-title">
      <div className="section-inner">
        <header className="section-head" data-reveal>
          <span className="section-no" aria-hidden="true">{problem.number}</span>
          <div>
            <h2 id="problem-title" className="visually-hidden">
              {problem.title}
            </h2>
            <p className="problem-lede">{problem.lede}</p>
          </div>
        </header>
        <div className="problem-field">
          <div className="problem-spine" aria-hidden="true" />
          {problem.consequences.map((c) => (
            <article key={c.id} className="problem-item">
              <span className="mono-label" aria-hidden="true">
                {c.id}
              </span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
