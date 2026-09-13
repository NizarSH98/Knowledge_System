# Checkpoint 3 review: Knowledge Observatory

Review date: 13 September 2026

## Outcome

The Knowledge Observatory is a standalone direction at `/v2/observatory`. It turns the shared Asteria model into three inspectable information spaces and demonstrates the canonical supplier-selection query without fabricated confidence, hidden reasoning, or leaked restricted content. The other direction routes remain neutral Checkpoint 2 foundations.

## Information spaces

- **Organization:** seven department fields, nine repository anchors, 15 projects, and all 128 documents. Selecting Project Atlas opens a local focus lens with people, decision, record, repository, current-evidence, restricted, and superseded counts.
- **Relationship:** the Atlas subgraph reorganizes around its participating departments and people, the supplier-selection decision, and related records. This is a different projection, not a zoomed copy of the organization map.
- **Evidence:** current accessible documents and passages lead into the decision and Project Atlas. Superseded evidence is separated by status. Unavailable records become anonymous markers inside a hatched access horizon.

## Canonical query

The visible retrieval sequence is deterministic:

```text
128 records -> relevant candidates -> permission filter -> current/superseded split -> supporting evidence -> cited answer
```

The result changes with the active identity:

- General Employee receives an access-limited refusal because the required evidence is beyond that identity's permissions.
- Operations Manager receives a partial answer using only accessible supporting claims.
- Procurement Officer receives the supported four-claim answer with passage-level citations.
- An unsupported question produces an explicit refusal and no claims.

Changing identity reruns retrieval and changes the evidence projection itself. Restricted titles, owners, and passage text never enter render state.

## Investigation tools

- A focus lens exposes local metrics without losing the full company field.
- Citation controls open the source passage, version, repository, and owner department.
- Reverse provenance traces a source through the Nova selection decision to Project Atlas procurement.
- The temporal rail exposes versions V2, V3, and current V4, explains which recommendations were superseded, and states why only the declared current version can support the answer.
- Reduced-motion mode resolves the same retrieval state immediately instead of simulating an animation.

## Palette review

All four Observatory palettes were reviewed in the same six states: initial organization, query running, evidence selected, restricted identity, version history, and answer resolved.

| Palette | Character observed |
|---|---|
| Night Instrument | High-contrast scientific instrument; strongest luminous evidence emphasis. |
| Deep Cobalt | More institutional and technical; cyan relationships separate cleanly from blue selection state. |
| Polar Instrument | Calm light-field analysis; best for dense, extended reading. |
| Graphite Spectral | Warm material neutrality; strongest bridge between analytical and editorial tones. |

The reproducible 24-image matrix is generated under `artifacts/observatory/<palette>/01-06-*.png`, with two additional Polar mobile review frames under `artifacts/observatory/mobile-polar/`. Artifacts are intentionally git-ignored; regenerate them with a preview server on port 4174 and `npm run capture:observatory`.

## Rendering and performance decision

The Observatory uses direction-owned SVG and HTML for the real 128-record workload. The semantic nodes remain keyboard-addressable, layout is deterministic, and all content works without WebGPU or WebGL. The route is lazy-loaded and does not request the optional `three-adapter` chunk; this is asserted in Playwright. The production build currently reports:

```text
Observatory CSS       20.84 kB minified / 4.38 kB gzip
Observatory JS        29.62 kB minified / 8.35 kB gzip
Shared retrieval JS   32.33 kB minified / 9.34 kB gzip
```

The large Three.js adapter remains a separately emitted chunk for the neutral renderer foundation and is not an Observatory route cost. Introducing a GPU layer here would not yet improve semantic legibility enough to justify its transfer and lifecycle cost.

## Verification

The following passed locally from `v2/`:

```text
npm run validate:model
npm run typecheck
npm run build
npm test
```

The browser suite covers desktop and mobile Chromium, entity cardinalities, all three projections, focus selection, staged query behavior, identity-dependent space and answers, version lineage, citation inspection, reverse provenance, unsupported refusal, mobile overflow, and the absence of a Three.js request on the Observatory route.

## Boundary check

Checkpoint 3 adds no shared composition primitives. `src/shared` still owns mechanics only; the Observatory component tree and stylesheet live entirely in `src/directions/observatory`. No V1 file changed, and no Institutional OS, Living Archive, comparison scoring, backend, launch, or SEO work is included.
