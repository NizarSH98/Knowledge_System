import { fit } from '../../content/copy'

export function Fit() {
  return (
    <section id="fit" className="section fit surface-light" aria-labelledby="fit-title">
      <div className="section-inner">
        <header className="section-head" data-reveal>
          <span className="section-no" aria-hidden="true">{fit.number}</span>
          <h2 id="fit-title">{fit.title}</h2>
        </header>
        <div className="fit-cols">
          <div className="fit-col fit-col--strong">
            <h3>{fit.strongTitle}</h3>
            <ul className="fit-list">
              {fit.strong.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="fit-col fit-col--weak">
            <h3>{fit.weakTitle}</h3>
            <ul className="fit-list">
              {fit.weak.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="fit-note">{fit.note}</p>
      </div>
    </section>
  )
}
