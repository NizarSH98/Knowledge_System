# Knowledge Systems V2 exploration

This directory is a new, isolated exploration. It does not import V1 components, styles, or Three.js scene code.

## Checkpoint status

- [x] Checkpoint 1 — research, architecture, and shared synthetic model
- [x] Checkpoint 2 — renderer/theme/quality foundation and neutral chooser
- [ ] Checkpoint 3 — Knowledge Observatory
- [ ] Checkpoint 4 — Institutional OS
- [ ] Checkpoint 5 — Living Archive
- [ ] Checkpoint 6 — comparison, automated testing, and performance review

Checkpoint 1 is preserved in commit `80891e5`. Checkpoint 2 installs the registry-verified dependency graph and deliberately stops before any direction-specific composition is built.

## Checkpoint 1 verification

From `v2/`:

```sh
npm run validate:model
npm run typecheck
npm run build
npm test
```

The model validation checks referential integrity, cardinality targets, version families, and the four expected retrieval states. Browser tests build with a root test base and run the compiled app through Vite Preview; the normal production build retains `/Knowledge_System/v2/` for GitHub Pages.

See `docs/CHECKPOINT_2.md` for the implementation boundary and verified results.
