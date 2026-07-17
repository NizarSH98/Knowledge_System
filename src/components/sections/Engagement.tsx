import { engagement } from '../../content/copy'

export function Engagement() {
  return (
    <section id="engagement" className="section engagement surface-dark" aria-labelledby="engagement-title">
      <div className="section-inner">
        <header className="section-head" data-reveal>
          <span className="section-no" aria-hidden="true">{engagement.number}</span>
          <div>
            <h2 id="engagement-title">{engagement.title}</h2>
            <p className="engagement-lede">{engagement.lede}</p>
          </div>
        </header>
        <ol className="phases">
          {engagement.phases.map((p, i) => (
            <li key={p.index} className={`phase${p.current ? ' phase--current' : ''}`}>
              {i === 3 ? (
                <span className="phase-gate" aria-hidden="true">
                  action boundary
                </span>
              ) : null}
              <div className="phase-head">
                <span className="mono-label">{p.index}</span>
                <span className="phase-status">{p.status}</span>
              </div>
              <h3>{p.title}</h3>
              <p className="phase-purpose">{p.purpose}</p>
              <dl>
                <div>
                  <dt>Boundary</dt>
                  <dd>{p.boundary}</dd>
                </div>
                <div>
                  <dt>Output</dt>
                  <dd>{p.output}</dd>
                </div>
                <div>
                  <dt>Decision</dt>
                  <dd>{p.decision}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
