# Knowledge Systems V2 exploration

This directory is a new, isolated exploration. It does not import V1 components, styles, or Three.js scene code.

## Checkpoint status

- [x] Checkpoint 1 — research, architecture, and shared synthetic model
- [ ] Checkpoint 2 — renderer/theme/quality foundation and neutral chooser
- [ ] Checkpoint 3 — Knowledge Observatory
- [ ] Checkpoint 4 — Institutional OS
- [ ] Checkpoint 5 — Living Archive
- [ ] Checkpoint 6 — comparison, automated testing, and performance review

No V2 dependencies have been installed yet. `package.json` records the researched baseline for the next checkpoint; installation is deliberately deferred until review.

## Checkpoint 1 verification

From the repository root, using the already-installed root toolchain:

```sh
node v2/scripts/validate-model.ts
npx tsc -p v2/tsconfig.json --noEmit
```

The model validation checks referential integrity, cardinality targets, version families, and the four expected retrieval states.
