# Decision log

## 2026-09-13 · Isolate V2 from V1

**Decision:** Build under `/v2` on `v2-exploration`. Do not import or edit V1 implementation files.

**Reason:** The brief requires an independent architecture and preserves V1 as a safe production reference.

## 2026-09-13 · One deterministic knowledge core

**Decision:** All directions consume the same typed retrieval result.

**Reason:** Permission, version, provenance, ranking, and refusal behavior must be comparable and must not drift with presentation.

## 2026-09-13 · Direct Three.js with a static sibling path

**Decision:** Plan for direct `WebGPURenderer` + TSL behind an adapter, with WebGL 2 and DOM/SVG fallbacks. Do not use React Three Fiber/Drei.

**Reason:** Renderer lifecycle and shared state are easier to control directly across spatial-first, interface-first, and editorial-first experiences. The official renderer remains experimental, so the DOM cannot depend on it.

## 2026-09-13 · Keep routing internal until deployment behavior is tested

**Decision:** Define route contracts now; do not add a router dependency yet.

**Reason:** Five static routes may not justify another dependency, and GitHub Pages direct-entry behavior needs to be tested before choosing history or hash routing.

## 2026-09-13 · No package installation at Checkpoint 1

**Decision:** Record researched exact versions in the isolated manifest but defer install/lockfile generation.

**Reason:** This preserves the requested research-before-install sequence and gives the founder a clean review point.

## 2026-09-13 · Resolve proposed versions at Checkpoint 2

**Decision:** Verify the proposed package versions and compatibility against npm, then install and commit the resolved dependency graph to `package-lock.json`. Add the matching `@types/three` package so renderer code participates in strict type checking.

**Reason:** Research versions were hypotheses, not project facts. The lockfile now records the dependency tree that actually builds and tests together.

## 2026-09-13 · Keep the five-route router local

**Decision:** Use a typed History API store instead of adding a routing package.

**Reason:** The route set is fixed and shallow. The local store supports navigation, back/forward, query state, lazy route chunks, and a repository prefix without imposing a framework on the direction trees.

## 2026-09-13 · Share mechanics, withhold composition

**Decision:** Checkpoint 2 exposes a deliberately neutral foundation page and chooser. Direction folders still contain no component implementations.

**Reason:** Capability detection, quality, theme application, routing, and retrieval are shared mechanics. Layout, typography, navigation grammar, interaction choreography, and visual hierarchy remain direction-owned.

## 2026-09-13 · Test compiled assets serially

**Decision:** Playwright builds a test-mode production bundle, serves it with Vite Preview, and runs one worker across desktop and mobile projects.

**Reason:** It verifies the deployable asset graph and avoids Windows cold-start/HMR contention. The production build continues to emit the GitHub Pages base path.
