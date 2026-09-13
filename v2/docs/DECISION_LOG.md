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
