import { assessmentMailto } from '../../config/site.ts'
import { directions, type DirectionDefinition } from '../../directions/registry.ts'
import { RouteLink } from '../../shared/components/RouteLink.tsx'
import { useTheme } from '../../themes/useTheme.ts'
import { ConceptPreview } from '../components/ConceptPreview.tsx'
import { PaletteSelector } from '../components/PaletteSelector.tsx'

const capabilities = [
  ['Ask', 'Ask questions across organizational knowledge using natural language. Answers stay grounded in available company information.'],
  ['Explore', 'Understand how projects, people, decisions, suppliers, records, and events connect instead of treating every file in isolation.'],
  ['Verify', 'Follow important statements back to supporting records and passages. If the information is insufficient, the system says so.'],
  ['Remember', 'Preserve decisions, evidence, changes, and historical context when projects end or people move on.'],
  ['Act', 'Add controlled AI agents only after the knowledge foundation is reliable, with defined approval, logging, and rollback.'],
] as const

const engagementSteps = [
  ['01', 'Discovery', 'Understand the business problem, users, information environment, systems, constraints, and desired outcome.'],
  ['02', 'Assessment', 'Evaluate the data, integrations, security requirements, AI opportunities, and what should actually be built.'],
  ['03', 'Knowledge pilot', 'Implement one bounded real-world use case with reliable retrieval, citations, context, permissions, and measurable acceptance criteria.'],
  ['04', 'Production system', 'Expand a successful pilot across the repositories, teams, workflows, and knowledge domains where it creates value.'],
  ['05', 'Controlled AI agents', 'Introduce approved actions on top of the established knowledge layer—deliberately, visibly, and with human control.'],
] as const

const directionCopy: Readonly<Record<DirectionDefinition['id'], {
  readonly name: string
  readonly title: string
  readonly body: string
  readonly link: string
}>> = {
  observatory: {
    name: 'Knowledge Observatory',
    title: 'See how the organization connects.',
    body: 'Explore projects, people, documents, decisions, evidence, and relationships. Start with the organization and move toward the exact evidence behind an answer.',
    link: 'Open Knowledge Observatory',
  },
  'institutional-os': {
    name: 'Institutional Workspace',
    title: 'Work directly with organizational knowledge.',
    body: 'Ask questions, investigate records, compare evidence, inspect sources, and understand what supports a conclusion in an everyday workspace.',
    link: 'Open Institutional Workspace',
  },
  'living-archive': {
    name: 'Living Archive',
    title: 'Understand not only what was decided, but why.',
    body: 'Follow decisions through their evidence, history, revisions, ownership, and organizational context instead of storing another disconnected final document.',
    link: 'Open Living Archive',
  },
}

function DemonstrationCard({ direction }: { readonly direction: DirectionDefinition }) {
  const copy = directionCopy[direction.id]

  return (
    <article className="demo-card">
      <div className="demo-card__visual" aria-hidden="true">
        <span>{direction.index}</span>
        <ConceptPreview directionId={direction.id} />
      </div>
      <div className="demo-card__copy">
        <p className="section-label">{copy.name}</p>
        <h3>{copy.title}</h3>
        <p>{copy.body}</p>
        <RouteLink to={direction.route}>{copy.link}<span aria-hidden="true">↗</span></RouteLink>
      </div>
    </article>
  )
}

export function HomePage() {
  const { theme, options, selectTheme } = useTheme()

  return (
    <main id="main-content" className="company-home">
      <section className="company-hero" aria-labelledby="company-hero-title">
        <p className="section-label">Private organizational knowledge infrastructure for AI</p>
        <h1 id="company-hero-title">Turn what your organization knows into something it can actually use.</h1>
        <div className="company-hero__summary">
          <p>Knowledge Systems turns scattered company information into an AI-powered knowledge infrastructure that people can search, understand, verify, and eventually act through.</p>
          <div className="cta-row">
            <a className="button button--primary" href="#demonstration">Explore the demonstration</a>
            <a className="button button--secondary" href={assessmentMailto()}>Assess a Knowledge Workflow</a>
          </div>
        </div>
      </section>

      <section className="example-story" aria-labelledby="example-title">
        <div>
          <p className="section-label">A concrete example</p>
          <h2 id="example-title">One question. The decision behind it.</h2>
        </div>
        <blockquote>
          “Why was this supplier selected for Project Atlas?”
        </blockquote>
        <p>A project manager should not need to reconstruct the answer from folders and old emails. Knowledge Systems can connect the evaluation, meeting record, quotation, project requirement, and later revisions—with links back to every supporting source.</p>
        <div className="example-story__sources" aria-label="Example evidence sources">
          <span>Evaluation</span><span>Meeting record</span><span>Quotation</span><span>Project requirement</span><span>Version history</span>
        </div>
      </section>

      <section id="problem" className="problem-section page-section" aria-labelledby="problem-title">
        <header>
          <p className="section-label">The problem</p>
          <h2 id="problem-title">Your organization already has the knowledge. The problem is finding and using it.</h2>
        </header>
        <div className="problem-section__body">
          <p>Important information is spread across shared drives, document systems, emails, reports, spreadsheets, project folders, and individual experience.</p>
          <ul>
            <li>Employees spend time searching instead of working.</li>
            <li>Previous decisions become difficult to understand.</li>
            <li>Knowledge disappears when people leave.</li>
            <li>Teams recreate work that already exists.</li>
            <li>Relationships between projects, records, people, and decisions remain hidden.</li>
            <li>General AI tools cannot reliably understand the organization behind the files.</li>
          </ul>
          <p className="problem-section__resolution">Knowledge Systems creates a usable layer across that information so the organization can work with what it already knows.</p>
        </div>
      </section>

      <section id="system" className="system-section page-section" aria-labelledby="system-title">
        <header>
          <p className="section-label">How it works</p>
          <h2 id="system-title">From company information to controlled AI capabilities.</h2>
          <p>Knowledge Systems connects information, context, and AI without hiding the evidence underneath.</p>
        </header>
        <ol className="system-flow" aria-label="Knowledge Systems architecture">
          <li><span>01</span><strong>Company sources</strong><small>Documents, records, systems, and approved data</small></li>
          <li><span>02</span><strong>Knowledge layer</strong><small>Entities, relationships, history, and access boundaries</small></li>
          <li><span>03</span><strong>AI interface</strong><small>Natural-language retrieval and investigation</small></li>
          <li><span>04</span><strong>Verified work</strong><small>Answers, exploration, citations, and institutional memory</small></li>
          <li><span>05</span><strong>Controlled agents</strong><small>Approved actions with safeguards and human oversight</small></li>
        </ol>
      </section>

      <section id="capabilities" className="capability-section page-section" aria-labelledby="capability-title">
        <header>
          <p className="section-label">More than document search</p>
          <h2 id="capability-title">Find the file. Understand the context. Preserve what matters.</h2>
        </header>
        <div className="capability-list">
          {capabilities.map(([name, description], index) => <article key={name}><span>{String(index + 1).padStart(2, '0')}</span><h3>{name}</h3><p>{description}</p></article>)}
        </div>
      </section>

      <section id="approach" className="approach-section page-section" aria-labelledby="approach-title">
        <header>
          <p className="section-label">A controlled path to production</p>
          <h2 id="approach-title">Start with one real problem. Expand when it works.</h2>
          <p>We begin by understanding the organization—not by installing a generic chatbot and expecting it to understand the company automatically.</p>
        </header>
        <ol className="engagement-steps">
          {engagementSteps.map(([number, title, description]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></li>)}
        </ol>
        <a className="text-cta" href={assessmentMailto()}>Assess a Knowledge Workflow <span aria-hidden="true">→</span></a>
      </section>

      <section className="connection-section page-section" aria-labelledby="connection-title">
        <header>
          <p className="section-label">Information environment</p>
          <h2 id="connection-title">Designed around where your knowledge already lives.</h2>
          <p>Typical integration targets include cloud drives, document repositories, databases, internal applications, APIs, spreadsheets, and project systems.</p>
        </header>
        <div className="connection-groups">
          <div><strong>Files and repositories</strong><p>SharePoint, OneDrive, Google Drive, network drives, document management platforms</p></div>
          <div><strong>Structured information</strong><p>Databases, internal systems, approved APIs, registers, and reporting environments</p></div>
          <div><strong>Operational records</strong><p>Spreadsheets, project platforms, exported communications, technical and process records</p></div>
        </div>
        <p className="scope-note"><strong>Integration scope is confirmed during assessment.</strong> These are common targets, not a claim that every connector is already production-tested.</p>
      </section>

      <section id="demonstration" className="demonstration-section page-section" aria-labelledby="demonstration-title">
        <header>
          <p className="section-label">Interactive demonstration</p>
          <h2 id="demonstration-title">One knowledge foundation. Three ways to work with it.</h2>
          <p>The interfaces support the product story: understand relationships, work with knowledge, and preserve institutional context.</p>
        </header>
        <div className="demonstration-grid">{directions.map((direction) => <DemonstrationCard key={direction.id} direction={direction} />)}</div>
      </section>

      <section id="trust" className="trust-section page-section" aria-labelledby="trust-title">
        <header>
          <p className="section-label">Useful, inspectable, accountable</p>
          <h2 id="trust-title">Knowledge should remain connected to evidence and under organizational control.</h2>
        </header>
        <div className="trust-grid">
          <article><h3>Connected to evidence</h3><p>Important outputs can remain linked to citations, exact passages, ownership, version history, relationships, permissions, retrieval records, refusal states, and agent action logs.</p></article>
          <article><h3>Private by design</h3><p>Architecture can be designed around private cloud, customer-controlled deployment, existing identity systems, approved AI providers, or local models. The right model is determined during assessment.</p></article>
          <article><h3>Built for adoption</h3><p>Workflow discovery, use-case selection, workshops, implementation planning, and employee onboarding help the technology fit the work people actually need to accomplish.</p></article>
        </div>
      </section>

      <section className="final-cta" aria-labelledby="final-cta-title">
        <p className="section-label">A practical first step</p>
        <h2 id="final-cta-title">Start with one workflow where valuable knowledge already exists but is difficult to use.</h2>
        <p>We can assess the opportunity, define a bounded pilot, measure whether it works, and decide what should happen next.</p>
        <div className="cta-row"><a className="button button--primary" href={assessmentMailto()}>Assess a Knowledge Workflow</a><a className="button button--secondary" href="#demonstration">Explore the demonstration</a></div>
      </section>

      <section className="theme-library" aria-labelledby="theme-title">
        <header><p className="section-label">Display preferences</p><h2 id="theme-title">Choose a reading theme.</h2></header>
        <PaletteSelector value={theme.id} options={options} onChange={selectTheme} compact />
      </section>
    </main>
  )
}
