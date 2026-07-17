# Knowledge Systems — Landing Page

A single-page marketing site for **Knowledge Systems**: private, permission-aware
company knowledge systems. The site is built around one signature visual idea —
**the Knowledge Lattice** — a procedural WebGL structure in which scattered
organizational information is progressively connected to sources, indexed,
enclosed in permission membranes, retrieved, and resolved into a
citation-grounded answer. Scroll position drives the transformation; the page
ends with the lattice calm and stable.

## Concept

- **Hero** — the lattice is fragmented: turbulent document fragments, drifting
  source nodes, unresolved particle mist. A low-resolution fluid field responds
  to the pointer (desktop only).
- **02 · Inside the Knowledge System** — a pinned, scroll-scrubbed sequence.
  The camera dives through the architecture while six chapters explain
  ingestion, indexing, permissions, retrieval/refusal, grounded answers, and
  the audit / action boundary. Scene state is a pure function of scroll
  progress, so fast scrolling or reversing can never break it.
- **Editorial middle** — outcomes, engagement phases, principles, and fit are
  flat editorial surfaces (the canvas suspends rendering while covered).
- **Final CTA** — the lattice returns, grounded and quiet.

All source names, counts, and citations in the visuals are fictional
demonstration data (see the footer disclaimer).

## Stack

- Vite + React 19 + TypeScript (strict)
- three.js + @react-three/fiber (custom GLSL throughout; no post-processing lib)
- GSAP + ScrollTrigger for the cinematic timeline
- Plain CSS (tokens → base → components → sections)
- Fonts bundled locally via Fontsource: Schibsted Grotesk (variable),
  Fraunces (variable italic, used for the kinetic accent word), Spline Sans Mono
- Playwright for browser tests; oxlint for linting

## Project structure

```text
src/
  config/site.ts            ← CONTACT_EMAIL + SITE_URL (replace before deploy)
  content/copy.ts           ← every word of page copy
  styles/                   ← tokens.css (design system), base, components, sections
  components/
    navigation/  controls/  typography/  sections/
  experience/
    canvas/                 ← Canvas entry, camera rig, background, quality hooks
    scenes/                 ← KnowledgeLattice (fragments, nodes, membranes, …)
    shaders/                ← all GLSL
    systems/                ← lattice data, scroll director, fluid field, scene state
    performance/quality.ts  ← adaptive quality tiers
  hooks/useExperienceMode.ts ← WebGL / reduced-motion / touch detection
scripts/                    ← OG-image generator (Playwright)
tests/e2e.spec.ts           ← browser checks + screenshot capture
public/                     ← favicon, robots.txt, sitemap.xml, og-image.png
```

## Commands

```bash
npm install          # install dependencies
npm run dev          # dev server
npm run build        # production build → dist/
npm run preview      # serve the production build locally
npm run typecheck    # TypeScript
npm run lint         # oxlint
npm test             # Playwright suite (run npm run build first)
npm run og           # regenerate public/og-image.png from scripts/og-image.html
```

Playwright browsers: `npx playwright install chromium` (one-time).
Test screenshots land in `artifacts/screenshots/`.

## Production configuration

The site is configured for `https://nizarsh98.github.io/Knowledge_System/`
with contact actions routed to `jabernizar98@gmail.com`. Canonical, social,
structured-data, robots, and sitemap metadata use the same public URL.

## Deploying to GitHub Pages

Asset paths are relative (`base: './'` in `vite.config.ts`), so the same build
works from the configured GitHub Pages project path or a custom domain.

**Manual:**

```bash
npm run build
npx gh-pages -d dist        # (or: npm run deploy)
```

Then in the repository settings enable Pages → deploy from the `gh-pages`
branch. `npm run deploy` requires the folder to be a git repository with a
GitHub remote.

**Automatic:** `.github/workflows/deploy.yml` deploys on push to `main` when
Pages is set to the "GitHub Actions" source in the repository settings.

## Adaptive quality

`src/experience/performance/quality.ts` defines three tiers
(high / balanced / reduced) that set device-pixel-ratio caps, fragment and
particle draw counts, and whether the fluid pointer field runs. The initial
tier comes from coarse device characteristics (touch, width, memory, cores —
no fingerprinting). A rolling FPS monitor steps the tier down live if the
average frame rate stays under ~32 fps. Buffers are allocated once at maximum
size; downgrades only reduce draw counts and resolution.

## Reduced motion and fallbacks

- **`prefers-reduced-motion: reduce`** — no scroll choreography, no pinning,
  no entry animations. The pinned sequence renders as stacked chapters. The
  canvas shows a static, grounded lattice and freezes its frame loop.
  (Also forceable with `?reducedmotion` for testing.)
- **WebGL unavailable or crashed** — an error boundary demotes the page to
  `html.no-webgl`: a static SVG lattice replaces the canvas, the pinned
  sequence becomes stacked chapters, and every message and CTA remains.
  (Forceable with `?nowebgl`.)
- No content exists only inside the canvas; the DOM carries the full story.

## Editing

- **Copy** — everything lives in `src/content/copy.ts`.
- **Colors & typography** — `src/styles/tokens.css` (palette, type scale,
  spacing, easing). Fonts are imported in `src/main.tsx`.
- **3D tuning** — safe knobs: tier counts in `performance/quality.ts`;
  state→progress mappings in `systems/scrollDirector.ts`; camera keyframes in
  `systems/latticeData.ts` (`buildCameraPath`); material behavior in
  `shaders/index.ts`. Avoid raising fragment/particle counts past the `high`
  tier without re-testing integrated GPUs — buffers are sized from
  `PROFILE_MAX`.

## Known limitations

- The contact action is a `mailto:` link (GitHub Pages has no form backend).
- A `prefers-reduced-motion` change mid-session requires a reload to take
  effect.
- The OG image is generated at build-author time (`npm run og`), not in CI.
- Headless-browser WebGL (SwiftShader) renders the lattice slowly in tests;
  the suite tolerates this, but visual judgement should use a real browser.
