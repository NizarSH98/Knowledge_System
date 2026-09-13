# Checkpoint 2 review

Review date: 13 September 2026

## Outcome

Checkpoint 2 establishes the neutral V2 machinery and stops before the three design implementations. The app runs at `/v2`, `/v2/observatory`, `/v2/os`, `/v2/archive`, and `/v2/compare`.

## Delivered foundation

- A standalone React/Vite application shell under `v2/` with a small History API route store.
- An art-directed but neutral chooser that describes three distinct concepts without pre-building their pages.
- Twelve complete semantic themes, four per direction, applied to both CSS and renderer inputs. Selection persists per direction and can be overridden in the URL.
- WebGPU, WebGL 2, reduced-motion, touch, CPU, memory, and viewport capability signals.
- High, balanced, reduced, and static quality tiers, plus measured-frame-time downgrades.
- A lazily imported direct Three.js WebGPU/TSL adapter with explicit WebGL retry and DOM/SVG fallback.
- A shared retrieval probe that demonstrates permission-sensitive answers, citations, version filtering, and unsupported-question refusal without confidence theatre.
- A reserved comparison route that makes no fake cross-direction claims before the directions exist.

## Boundary check

`src/directions/observatory`, `src/directions/institutional-os`, and `src/directions/living-archive` still contain only contracts/markers. Shared code owns route, theme, capability, quality, renderer lifecycle, controls, and model access. It does not own any direction's page grid, typography, navigation composition, animation grammar, or information architecture.

## Verification evidence

The following commands passed locally from `v2/`:

```text
npm run validate:model
  7 departments, 84 people, 15 projects, 128 documents,
  9 repositories, 652 relationships
  general: insufficient-permissions
  operations: partially-supported
  procurement: supported
  unsupported: unsupported

npm run typecheck
  TypeScript 7.0.2 strict check passed, including @types/three 0.186.0

npm run build
  production build passed

npx vite build --mode test
npx playwright test
  23 passed, 3 intentionally project-specific skips
```

The browser suite covers every route in desktop and mobile Chromium, client navigation without document reload, all twelve palettes in DOM and live renderer state, theme persistence, CSS token application, the three canonical identity outcomes, unsupported refusal, static structured fallback, reduced motion, mobile overflow, and actual WebGL initialization when exposed by the browser.

Manual inspection covered the 1440-pixel chooser, the settled Pixel 5 direction foundation, and all twelve palettes across the three empty direction routes. The review caught and removed an unintended neutral-to-dark fade on direct route loads; first application is now immediate while later palette changes retain their transition. No horizontal document overflow was observed. The canvas is `aria-hidden`; its five retrieval stages are always present as a semantic ordered list.

## Performance note

The initial application chunk is approximately 235 kB minified / 74 kB gzip. The Three.js adapter is a separate lazy route chunk at approximately 889 kB / 243 kB gzip. Vite reports the expected greater-than-500-kB warning for that lazy chunk. It is not downloaded by the chooser and should be evaluated further when real direction graphics reveal which imports and effects are necessary.

## Deliberate omissions

- No Observatory, Institutional OS, or Living Archive component tree or visual composition.
- No comparison scoring or recommendation.
- No cinematic loader, fake progress, simulated confidence, or decorative GPU-only information.
- No V1 imports or edits.

Checkpoint 3 must begin with the Knowledge Observatory's own composition and interaction grammar rather than extending the neutral diagnostic page.
