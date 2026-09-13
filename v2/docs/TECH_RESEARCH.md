# Technical research

Research date: 13 September 2026. Sources are official project documentation unless explicitly identified as registry metadata. Version floors were checked against the npm registry without installing packages. They are proposals, not frozen dependencies; the lockfile created at installation is authoritative.

## Selected baseline

| Library | Selected | Current role | Why selected | Alternatives considered | Limits and fallback |
|---|---:|---|---|---|---|
| Three.js | 0.186.0 | One persistent graphics foundation behind a direction-neutral adapter | The official `WebGPURenderer` guide describes a WebGPU-first renderer with an automatic WebGL 2 backend. Direct ownership keeps renderer lifecycle, picking, quality, and disposal coherent across three very different DOM experiences. | React Three Fiber and Drei; raw WebGPU; separate WebGL/WebGPU scenes | `WebGPURenderer` remains officially experimental. Graphics cannot own product state. The application must retain an equivalent DOM/SVG static representation. |
| TSL | bundled with Three.js | Node materials, data-driven effects, compute definitions, and RenderPipeline nodes | TSL compiles to WGSL or GLSL for the active backend and is the supported customization route for `WebGPURenderer`. | `ShaderMaterial`, `RawShaderMaterial`, `onBeforeCompile`, WGSL strings | Old shader-extension patterns are unsupported by `WebGPURenderer`. Effects will be small, typed modules with shared theme uniforms. |
| WebGPU compute | bundled with Three.js | Optional Observatory layout assistance only if profiling demonstrates value | Three.js exposes compute nodes and renderer compute dispatch. Compute is meaningful for many-record relaxation or path-state updates, not for ordinary UI animation. | CPU layout in a worker; deterministic precomputed layouts | WebGPU is not Baseline and requires a secure context. Compute will be capability-gated; WebGL/static tiers use deterministic CPU/precomputed layouts. |
| RenderPipeline | bundled with Three.js | Small TSL post-processing chains where they communicate focus, time, or material state | It is the current Three.js WebGPU post-processing path and can combine compatible node effects and support MRT. | `EffectComposer`; CSS filters; no post-processing | `EffectComposer` is not supported with `WebGPURenderer`. Every direction must remain legible with post-processing disabled. |
| GSAP | 3.15.0 | Precise, interruptible state transitions with scoped cleanup | Mature timelines suit transitions between retrieval states and record layers. `gsap.context()` supports cleanup; `gsap.matchMedia()` supports responsive and reduced-motion branches. | Web Animations API; CSS transitions; Framer Motion | Use only where sequencing adds meaning. CSS/instant-state transitions remain the reduced-motion behavior. No smooth-scroll dependency. |
| ScrollTrigger | bundled with GSAP | Direction-specific narrative scroll only | It provides measured scroll-linked timelines, resize refresh, responsive setup, and explicit cleanup. | IntersectionObserver; native scroll timelines | Not a global scrolling layer. Observatory and Archive may use it for bounded narrative moments; Institutional OS should be primarily event-driven. |
| React | 19.3.0 | Semantic DOM UI, deterministic state composition, and accessibility | React 19.3 is the current stable line. Component/state boundaries suit shared controls plus three independent experience trees. | Preact; vanilla custom elements; a meta-framework | This is a static public exploration with no server requirement, so Server Components and framework-specific data layers add no value. Keep WebGPU imperative and outside render reconciliation. |
| TypeScript | 7.0.2 | Strict contracts for knowledge, provenance, theme, capabilities, and UI state | TypeScript 7 is the current stable native compiler. The V2 config explicitly enables strict and unchecked-index protections. | TypeScript 6.0; JavaScript + JSDoc | TypeScript 7 does not yet expose every stable programmatic API expected by embedded-language toolchains. This plain React/Vite app does not require those APIs. Roll back to 6.0.3 if a Vite plugin incompatibility appears. |
| Vite | 8.3.0 | Isolated V2 development and production bundle | Vite 8 is stable, React/TypeScript friendly, and uses Rolldown for development and production builds. | Reusing V1 config; Rsbuild; Next.js; hand-written build | Requires Node 20.19+ or 22.12+. Production defaults target browsers broadly available around mid-2023; graphics capability detection is still required separately. |
| Playwright | 1.63.0 | Cross-browser route, state, fallback, accessibility, and screenshot tests in Checkpoint 6 | Browser-level assertions are required for canvas fallback and responsive behavior. | Vitest browser mode; Cypress | Screenshot baselines are environment-sensitive, so interaction/state assertions remain primary and visual snapshots use controlled projects. |

Compatible version floors are recorded in `v2/package.json` with semver ranges. Registry metadata confirms that Vite 8.3.0 and `@vitejs/plugin-react` 6.1.1 share the same Node requirement, the React plugin accepts Vite 8, React DOM 19.3 requires React 19.3, and the remaining selected packages are available. There is intentionally no V2 lockfile at this checkpoint because no install was performed. Checkpoint 2 must install, resolve, and type-check the actual dependency graph before implementation proceeds.

## Renderer conclusion

Use direct Three.js imports from `three/webgpu` and TSL imports from `three/tsl`. Instantiate `WebGPURenderer` behind a renderer adapter. Default to its WebGPU backend; use `forceWebGL: true` in an explicit test/fallback mode. Provide a separate static DOM/SVG adapter rather than treating a failed canvas as an error screen.

Application state flows one way:

```text
query / identity / time / palette
             ↓
deterministic knowledge result
       ↙             ↘
semantic DOM       graphics adapter
```

The canvas visualizes the same result as the DOM; it never decides permissions, versions, ranking, or claims.

## Browser implications

- WebGPU is secure-context only and still marked limited availability by MDN. It is an enhancement, never an entry requirement.
- `WebGPURenderer` automatically supports a WebGL 2 backend, and exposes `forceWebGL` for testing.
- WebGL 2 is the balanced path. Browsers without a usable WebGL 2 context receive the static tier.
- Vite 8 development assumes a modern browser. Its production default corresponds to browsers broadly available around mid-2023; an official legacy plugin exists, but V2 will first define the actual audience before adding it.
- `prefers-reduced-motion`, touch input, viewport, hardware concurrency, optional device memory, and measured frame time may lower quality. These signals are local quality inputs, not identifiers and are not stored.

## Dependency decisions

- Do not adopt React Three Fiber or Drei. A single direct renderer controlled by an imperative adapter is simpler for a spatial-first direction, a DOM-first direction, and an editorial direction sharing one graphics lifecycle.
- Do not adopt Framer Motion. GSAP plus CSS covers the required sequencing and state transitions.
- Do not adopt Lenis or another scroll smoother. Native scrolling preserves accessibility and keeps ScrollTrigger optional.
- Do not add a router dependency for five static routes unless nested routing requirements emerge. The route contract is currently a small typed table.
- Do not add a UI kit or CSS framework. The three art directions require independent typography, density, and spatial rules over shared semantic tokens.

## Official references

- [Three.js WebGPURenderer guide](https://threejs.org/manual/en/webgpurenderer)
- [Three.js TSL specification](https://threejs.org/docs/TSL.html)
- [Three.js ComputeNode reference](https://threejs.org/docs/pages/ComputeNode.html)
- [Three.js WebGPU post-processing guide](https://threejs.org/manual/en/webgpu-postprocessing.html)
- [Three.js WebGLRenderer reference](https://threejs.org/docs/pages/WebGLRenderer.html)
- [GSAP core documentation](https://gsap.com/docs/v3/GSAP/)
- [GSAP ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP matchMedia and reduced-motion guidance](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/)
- [React 19.3 release](https://react.dev/blog/2026/09/09/react-19-3)
- [React TypeScript guide](https://react.dev/learn/typescript)
- [TypeScript 7.0 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
- [Vite 8 announcement](https://vite.dev/blog/announcing-vite8)
- [Vite browser and Node support](https://vite.dev/guide/)
- [MDN WebGPU API and compatibility](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)
- [MDN WebGL API](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
