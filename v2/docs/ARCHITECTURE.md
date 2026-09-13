# V2 architecture

## Boundary

`/v2` is a standalone application boundary. It may reuse approved facts and public brand assets by explicit reference later, but it must not import V1 components, styles, hooks, or scene code. V1 remains deployable independently.

## Layers

1. **Data** supplies the clearly fictional Asteria Infrastructure Group records.
2. **Knowledge model** performs deterministic retrieval, permissions, version filtering, ranking, provenance resolution, and refusal.
3. **Application state** owns route, direction, palette, identity, query, quality, and motion preference now; time and selected claim/source enter when a direction needs them.
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
- Theme changes update both CSS custom properties and renderer uniforms from one semantic definition.
- Static mode uses the same retrieval result and interaction state as GPU modes.

## Route contract

The five routes are defined in `src/app/routes.ts` and implemented by a small History API store in `src/app/router.ts`. It recognizes `/v2` even when a GitHub Pages repository prefix precedes it, preserves query parameters, and lazy-loads direction/compare foundations. The static host must still rewrite direct entries to the V2 HTML document; client routing cannot create a server rewrite.

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

## Checkpoint 2 composition boundary

The neutral shell, palette controls, capability/quality status, query probe, and five-stage renderer diagnostic exist to verify shared mechanics. The files under `src/directions/*` still contain contracts and markers only. Each direction will replace the neutral foundation page with its own component tree and stylesheet; no shared page shell, card grammar, grid, type scale, or animation preset is mandatory.

## Checkpoint 3 composition boundary

The Observatory now replaces its neutral foundation with a lazy, direction-owned component tree and stylesheet. It consumes shared route, theme, data, permission, retrieval, and provenance mechanics, but owns its semantic projections, SVG composition, focus lens, query choreography, source inspector, version rail, typography, and responsive rules. Institutional OS and Living Archive still use the neutral foundation. No Observatory layout primitive has moved into `src/shared`.
