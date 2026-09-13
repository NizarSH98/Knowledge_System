# Knowledge Systems V2 exploration

This directory is a new, isolated exploration. It does not import V1 components, styles, or Three.js scene code.

## Delivery status

- [x] Checkpoint 1 — research, architecture, and shared synthetic model
- [x] Checkpoint 2 — renderer/theme/quality foundation and neutral chooser
- [x] Checkpoint 3 — Knowledge Observatory
- [x] Integrated redesign — shared light/dark palette library and combined home
- [x] Institutional OS — complete direction-owned workspace
- [x] Living Archive — complete direction-owned dossier
- [x] Comparison, automated testing, contrast validation, and visual review captures

Checkpoint 1 is preserved in commit `80891e5`; Checkpoint 2 in `a4b3dc1`; and the original Observatory checkpoint in `111f4c1`. The later integrated redesign is documented in `docs/INTEGRATED_REDESIGN.md`.

## Checkpoint 1 verification

From `v2/`:

```sh
npm run validate:model
npm run typecheck
npm run build
npm test
```

The model validation checks referential integrity, cardinality targets, version families, and the four expected retrieval states. Browser tests build with a root test base and run the compiled app through Vite Preview; the production candidate uses `/Knowledge_System/` and emits direct GitHub Pages entries for every application route.

See `docs/CHECKPOINT_3.md` for the Observatory acceptance review, screenshot matrix, and verified results.
See `docs/INTEGRATED_REDESIGN.md` for the combined experience, completed OS and Archive directions, and shared palette system.
See `docs/TEXT_ONLY_CONTENT.md` for the naked copy review.
See `docs/DEPLOYMENT.md` for local review URLs, artifact structure, and the intentionally manual release gate.
