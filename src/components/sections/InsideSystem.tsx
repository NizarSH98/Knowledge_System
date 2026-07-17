import { insideSystem } from '../../content/copy'
import { TextMask } from '../typography/TextMask'
import { detectExperienceMode } from '../../hooks/useExperienceMode'

function ChapterBlock({ chapter }: { chapter: (typeof insideSystem.chapters)[number] }) {
  return (
    <article className="inside-chapter">
      <span className="mono-label" aria-hidden="true">
        {chapter.index}
      </span>
      <h3>{chapter.title}</h3>
      <p>{chapter.body}</p>
      <ul className="annotations" aria-hidden="true">
        {chapter.annotations.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    </article>
  )
}

export function InsideSystem() {
  const mode = detectExperienceMode()

  return (
    <section id="how-it-works" className="inside" aria-labelledby="inside-title">
      <div className="inside-intro">
        <div className="inside-intro-inner">
          <span className="section-no" aria-hidden="true">{insideSystem.number}</span>
          <div data-reveal>
            <h2 id="inside-title">{insideSystem.title}</h2>
            <p className="prose">{insideSystem.intro}</p>
          </div>
        </div>
      </div>

      <TextMask word={insideSystem.maskWord} />

      {mode.cinematic ? (
        <div className="inside-stage-wrap" style={{ height: `${insideSystem.chapters.length * 110 + 100}svh` }}>
          <div className="inside-stage">
            <div className="inside-chapters">
              {insideSystem.chapters.map((c) => (
                <ChapterBlock key={c.index} chapter={c} />
              ))}
            </div>
            <div className="inside-rail" aria-hidden="true">
              {insideSystem.chapters.map((c) => (
                <span key={c.index} className="inside-rail-tick" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="inside-stacked">
          {insideSystem.chapters.map((c) => (
            <ChapterBlock key={c.index} chapter={c} />
          ))}
        </div>
      )}
    </section>
  )
}
