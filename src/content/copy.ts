export const nav = {
  wordmark: 'Knowledge Systems',
  links: [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Outcomes', href: '#outcomes' },
    { label: 'Engagement', href: '#engagement' },
    { label: 'Principles', href: '#principles' },
  ],
  cta: 'Request Assessment',
}

export const hero = {
  kicker: 'Private knowledge systems for complex organizations.',
  headlineA: 'Your company already contains the answers.',
  headlineB: 'The problem is finding the right one—with',
  headlineAccent: 'evidence.',
  support:
    'Knowledge Systems turns approved company information into a private, permission-aware knowledge layer—so teams can retrieve grounded answers, follow every answer back to its source, and expand toward controlled automation only when the foundation is trusted.',
  primaryCta: 'Request a Knowledge Assessment',
  secondaryCta: 'Explore the System',
  scrollHint: 'Scroll to enter the system',
}

export const problem = {
  number: '01',
  title: 'The growing knowledge problem',
  lede: 'As organizations grow, knowledge does not simply disappear. It becomes distributed across files, repositories, versions, teams, permissions, and individual memory.',
  consequences: [
    {
      id: 'SRCH',
      title: 'Search produces incomplete results',
      body: 'Each repository answers only for itself. Nothing answers for the organization.',
    },
    {
      id: 'VERS',
      title: 'Old versions remain plausible',
      body: 'A superseded procedure reads exactly like a current one—until someone follows it.',
    },
    {
      id: 'PERM',
      title: 'Access rules become difficult to preserve',
      body: 'Every new tool that copies information is a place where permissions quietly stop applying.',
    },
    {
      id: 'ORIG',
      title: 'Answers lose their origin',
      body: 'A summary circulates. The document it came from—and its owner—do not.',
    },
    {
      id: 'PPLE',
      title: 'Experienced people become the index',
      body: 'The fastest retrieval system in most organizations is a person who is often in a meeting.',
    },
  ],
}

export type Chapter = {
  index: string
  title: string
  body: string
  annotations: string[]
}

export const insideSystem = {
  number: '02',
  maskWord: 'EVIDENCE',
  title: 'Inside the Knowledge System',
  intro:
    'A knowledge system is not a chatbot placed on top of your files. It is an architecture. Scroll to move through it.',
  chapters: [
    {
      index: '2.1',
      title: 'Approved sources, ingested with identity',
      body: 'The system connects only to repositories your organization explicitly approves. Every document is parsed with its origin, owner, and version attached—identity is never stripped away for convenience.',
      annotations: ['SRC 001 — Operations Manual — v3.2', 'SRC 002 — Research Archive — approved', 'SRC 003 — Field Report 024 — current'],
    },
    {
      index: '2.2',
      title: 'Indexed for meaning and for words',
      body: 'Content is indexed twice: a keyword index for exact language, a semantic index for meaning. Versions are tracked so that superseded material can be found—but never mistaken for current.',
      annotations: ['IDX — keyword + semantic', 'Project Delta Decision Log — superseded', 'refresh — on source change'],
    },
    {
      index: '2.3',
      title: 'Permissions travel with the knowledge',
      body: 'Access boundaries from the source systems are preserved inside the knowledge layer. A viewer only retrieves from material they could already open. Restricted regions remain present—but do not resolve.',
      annotations: ['Safety Procedure — restricted', 'Procurement Policy — finance group', 'ACL — inherited from source'],
    },
    {
      index: '2.4',
      title: 'Retrieval, ranking, and refusal',
      body: 'A question becomes a query pulse through the lattice. Candidates are gathered, reranked, and filtered. When the approved material cannot support an answer, the system says so instead of improvising.',
      annotations: ['candidates — 14', 'reranked — 3', 'refusal — when unsupported'],
    },
    {
      index: '2.5',
      title: 'Answers grounded in citations',
      body: 'Every answer keeps a visible tether to the passages that support it. Anyone can follow the citation back to the approved source, its owner, and its version.',
      annotations: ['answer — grounded', 'citations — 3 attached', 'trace — source · owner · version'],
    },
    {
      index: '2.6',
      title: 'Audited today. Actions later—behind a boundary.',
      body: 'Every retrieval is logged and evaluable. Capabilities that act—drafting, updating, filing—sit behind a separate boundary, and are introduced only as individually approved modules after the read-only layer has earned trust.',
      annotations: ['log — retained per policy', 'eval — before expansion', 'action boundary — closed by default'],
    },
  ] satisfies Chapter[],
}

export const outcomes = {
  number: '03',
  title: 'What this changes in practice',
  lede: 'Outcomes, not features. Each one is a property your organization can verify.',
  items: [
    {
      id: 'OUT-01',
      title: 'Answers with provenance',
      body: 'Every useful response points back to the approved material supporting it. If a claim cannot be traced, it is not an answer—it is a guess.',
      tag: 'citation-grounded',
    },
    {
      id: 'OUT-02',
      title: 'Permissions remain meaningful',
      body: 'Retrieval respects identity and source access. The knowledge layer never becomes a side door around the access model you already govern.',
      tag: 'permission-aware',
    },
    {
      id: 'OUT-03',
      title: 'Knowledge stays connected to change',
      body: 'Versions, supersession, removal, and access revocation are treated as system events—so yesterday’s document cannot quietly answer today’s question.',
      tag: 'synchronized',
    },
    {
      id: 'OUT-04',
      title: 'One bounded workflow first',
      body: 'The system starts where value can actually be tested: one team, one workflow, a limited set of approved sources. Not the entire company at once.',
      tag: 'bounded pilot',
    },
    {
      id: 'OUT-05',
      title: 'Trust before action',
      body: 'Read-only retrieval is evaluated before any autonomous capability is considered. Actions are a separate decision, never a default.',
      tag: 'read-only first',
    },
    {
      id: 'OUT-06',
      title: 'A defensible path to expansion',
      body: 'Sources, teams, and controlled modules are added only after written acceptance—so every stage of growth has a record of why it was allowed.',
      tag: 'change-controlled',
    },
  ],
}

export const engagement = {
  number: '04',
  title: 'The engagement pathway',
  lede: 'Four phases. Each ends with a decision that is yours to make. The restraint is the point.',
  phases: [
    {
      index: 'PHASE 1',
      status: 'entry point',
      title: 'Knowledge Assessment',
      purpose: 'Understand your sources, owners, permissions, workflows, and risks—and locate the highest-value bounded use case.',
      boundary: 'Analysis only. Nothing is connected, ingested, or changed.',
      output: 'A written recommendation and a defined pilot scope.',
      decision: 'You decide whether the proposed pilot is worth running.',
      current: true,
    },
    {
      index: 'PHASE 2',
      status: 'read-only',
      title: 'Private Read-Only Pilot',
      purpose: 'One bounded team and workflow, with a limited number of approved sources, retrieving citation-grounded answers under permission filtering.',
      boundary: 'Read-only. No autonomous changes to any system.',
      output: 'A working private pilot with evaluation results, administration, refresh behavior, and handover.',
      decision: 'You accept the pilot in writing—or you do not expand.',
      current: false,
    },
    {
      index: 'PHASE 3',
      status: 'after acceptance',
      title: 'Production Expansion',
      purpose: 'Add approved departments, repositories, identity integration, monitoring, backups, and operational hardening.',
      boundary: 'Still read-only. Every added source is individually approved.',
      output: 'A production knowledge layer with operational ownership defined.',
      decision: 'You decide if—and where—controlled actions would be worth introducing.',
      current: false,
    },
    {
      index: 'PHASE 4',
      status: 'separately approved',
      title: 'Controlled Agent Modules',
      purpose: 'Introduce actions only as separately approved modules, each with defined systems, permissions, and prohibited actions.',
      boundary: 'Every module has approval points, validation, logging, retries, and rollback behavior.',
      output: 'Narrow, auditable automation where the evidence supports it.',
      decision: 'Each module is a new decision. None are bundled.',
      current: false,
    },
  ],
}

export const principles = {
  number: '05',
  title: 'Principles and guardrails',
  lede: 'These are operating constraints the system is built around—not aspirations.',
  items: [
    { id: 'P-01', title: 'Approved sources only', body: 'The system reads nothing your organization has not explicitly connected.' },
    { id: 'P-02', title: 'Source-level permissions', body: 'Access boundaries are inherited from the systems that own them.' },
    { id: 'P-03', title: 'Least-privilege access', body: 'Every credential the system holds is scoped to the minimum required.' },
    { id: 'P-04', title: 'Citation-grounded responses', body: 'Answers cite approved material or state that they cannot.' },
    { id: 'P-05', title: 'Human approval where actions matter', body: 'No consequential action executes without a person accountable for it.' },
    { id: 'P-06', title: 'Evaluation before expansion', body: 'Growth follows measured retrieval quality, not enthusiasm.' },
    { id: 'P-07', title: 'Logging and traceability', body: 'Retrievals and actions leave a record that can be audited.' },
    { id: 'P-08', title: 'Customer-controlled deployment', body: 'Where the system runs, and what it touches, are your decisions.' },
    { id: 'P-09', title: 'Clear exclusions and change control', body: 'What the system must not do is written down, and changes are versioned.' },
    { id: 'P-10', title: 'Strict environment separation', body: 'Customer environments are never mixed. Ever.' },
  ],
}

export const fit = {
  number: '06',
  title: 'Where this works—and where it doesn’t',
  strongTitle: 'A strong starting point',
  strong: [
    'Important knowledge is distributed across several approved repositories.',
    'Teams repeatedly search for the same operational answers.',
    'Source ownership and permissions can be identified.',
    'A decision-maker can sponsor a bounded pilot.',
    'The organization values traceability over novelty.',
  ],
  weakTitle: 'Not the right starting point',
  weak: [
    'The goal is an unrestricted chatbot over every company file.',
    'No one owns the source material or access decisions.',
    'Autonomous actions are expected before evaluation.',
    'The engagement depends on substantial unpaid development.',
    'Perfect accuracy or zero-risk deployment is expected.',
  ],
  note: 'If the second column describes the current expectation, an assessment will say so honestly—that is part of what it is for.',
}

export const founder = {
  number: '07',
  title: 'Who is behind this',
  body: 'Knowledge Systems is led by Nizar Shehayeb, an AI and mechatronics engineer focused on building practical, governed systems across software, data, and intelligent workflows.',
  note: 'The work is deliberately narrow: private, permission-aware knowledge systems—done carefully.',
}

export const finalCta = {
  number: '08',
  title: 'Start with the knowledge your organization must be able to trust.',
  support:
    'A Knowledge Assessment identifies the sources, permissions, workflow, risks, and smallest useful pilot before implementation begins.',
  cta: 'Request a Knowledge Assessment',
  microcopy: 'Opens a pre-addressed email. No forms, no tracking.',
}

export const footer = {
  positioning: 'Private, permission-aware company knowledge systems.',
  statement:
    'Knowledge Systems connects approved organizational repositories, preserves access boundaries, and produces citation-grounded answers that stay synchronized as knowledge changes.',
  contactLabel: 'Contact',
  demoDisclaimer:
    'All source names, counts, and citations shown in the visual experience are fictional demonstration data.',
}
