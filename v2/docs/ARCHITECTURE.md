# V2 architecture

## Boundary

`/v2` is a standalone application boundary. It may reuse approved facts and public brand assets by explicit reference later, but it must not import V1 components, styles, hooks, or scene code. V1 remains deployable independently.

## Layers

1. **Data** supplies the clearly fictional Asteria Infrastructure Group records.
2. **Knowledge model** performs deterministic retrieval, permissions, version filtering, ranking, provenance resolution, and refusal.
3. **Application state** owns route and the globally shared palette choice. Direction trees own their local identity, query, time, and selected claim/source state.
4. **Shared UI** provides only behaviorally common controls and accessible primitives.
5. **Direction trees** own their information architecture, typography, composition, rhythm, and interaction grammar.
6. **Graphics adapter** receives immutable view state and reports picking/performance events. It does not make knowledge decisions.

## State invariants

- Identity changes rerun permission filtering; they do not merely relabel the interface.
- The current-version filter runs after permission filtering and before ranking.
- A claim exists only when its declared evidence threshold is met.
- Citations point to a passage, document, repository, owner department, and version.
- Restricted passages never reach render state. A concealed exclusion marker may be shown without title or passage text.
- Unsupported questions return an explicit refusal with an observable retrieval trace.
- Theme changes update semantic CSS custom properties from one global definition. Graphics adapters can consume the same definition when a direction elects to use them.
- Static mode uses the same retrieval result and interaction state as GPU modes.

## Route contract

The five app-relative routes are defined in `src/app/routes.ts` and implemented by a small History API store in `src/app/router.ts`. The router derives its public prefix from Vite's `BASE_URL`, preserves query parameters, and lazy-loads all three direction trees plus comparison. The production build emits a physical `index.html` for each known route so GitHub Pages can serve direct entries without a hash router or server rewrite.

## Direction isolation

Each direction owns its component tree and styles. Shared modules may express facts, controls, focus management, and state, but may not impose a card shell, page grid, type scale, animation preset, or navigation layout. `src/directions/registry.ts` records the intended structural differences before UI work begins.

## Renderer lifecycle

- One lazily initialized renderer per mounted direction.
- Canvas creation follows meaningful DOM content; no cinematic loader.
- Rendering suspends when the page is hidden or the canvas is out of view.
- Resize and DPR are owned centrally.
- Scene resources expose deterministic `dispose()` methods.
- Backend can be forced to WebGL or static through a development/test parameter.
- Initialization failure retries WebGL after WebGPU, then moves to static without losing page functionality.
- Sustained frame time can lower quality from high through balanced, reduced, and static.
- The adapter reports the backend that Three actually initialized rather than the backend merely requested.

## Current composition boundary

The integrated home introduces all three interaction languages as one continuous product story, while each dedicated route remains independently art-directed:

- Observatory owns its semantic projections, spatial SVG, focus lens, query choreography, source inspector, and version rail.
- Institutional OS owns its domain rail, command surface, claim ledger, source inspector, exclusions, and operational trace.
- Living Archive owns its dossier, margin, footnote rhythm, source folios, and chronology.

Shared code is limited to the data and retrieval model, route mechanics, global semantic themes, the small knowledge-query state hook, and accessible links. There is no shared hero, answer panel, card shell, inspector layout, grid, type scale, or direction navigation component. The earlier neutral foundation renderer and query-probe components were removed once all direction trees existed, preventing their diagnostic composition from becoming an accidental product template.
