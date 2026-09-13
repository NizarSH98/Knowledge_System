# Performance budget

These are implementation gates for Checkpoints 2–6, not measurements already achieved.

| Concern | Initial budget |
|---|---|
| Meaningful DOM content | Present in the first render; no mandatory cinematic loader |
| Main-thread blocking | No single avoidable task above 50 ms during initial interaction |
| Desktop animation | Target 60 fps; reduce quality before sustained performance falls below roughly 30 fps |
| Device pixel ratio | High ≤ 2; Balanced ≤ 1.5; Reduced ≤ 1.25; Static has no canvas |
| Initial graphics code | Lazy-loaded per direction; not required for chooser comprehension |
| Textures | No large photographic/video textures; generated procedural/material assets preferred |
| 3D assets | No GLTF unless a semantic need and measured budget justify it |
| Post-processing | Off in Reduced/Static; direction-specific and minimal in Balanced |
| Hidden work | Suspend animation when page/canvas is not visible |

## Quality tiers

- **High:** WebGPU, full semantic effects, higher record density, optional compute after profiling.
- **Balanced:** WebGPU or WebGL 2, reduced DPR/density, simple post-processing.
- **Reduced:** WebGL 2 only when stable, minimal scene and transitions, no compute/post-processing.
- **Static:** complete DOM/SVG interaction with no renderer dependency.

Initial tier selection may use viewport, primary pointer, reduced-motion preference, hardware concurrency, optional device memory, and capability checks. Runtime frame-time samples may only move quality downward automatically. No signal is persisted or combined into a fingerprint.

Checkpoint 6 will replace assumptions with per-route bundle output, observed FPS ranges on named test hardware, initialization timings, and downgrade behavior.
