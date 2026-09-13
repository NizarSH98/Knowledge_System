# V2 deployment candidate

The repository is prepared to replace the GitHub Pages V1 artifact, but deployment is intentionally disabled by default. The workflow has only a manual `workflow_dispatch` trigger. Building, testing, committing, or merging does not publish the site.

## Local development review

From `v2/`:

```text
npm ci
npm run dev
```

Open these URLs on port 4174:

- `/` — direction chooser
- `/observatory` — completed Knowledge Observatory
- `/os` — Institutional OS foundation
- `/archive` — Living Archive foundation
- `/compare` — comparison placeholder

## Exact production artifact review

```text
npm run build
npm run preview
```

Open `http://localhost:4175/Knowledge_System/`. The production artifact contains:

```text
dist/
  index.html
  observatory/index.html
  os/index.html
  archive/index.html
  compare/index.html
  assets/
  .nojekyll
```

All HTML entries reference assets below `/Knowledge_System/assets/`. App links use the same Vite base at runtime, while development and test builds use `/`.

With the preview server running, verify all production URLs, client navigation, direct reload behavior, and browser console output in a second terminal:

```text
npm run verify:pages
```

This also writes two local review frames to `artifacts/deployment-preview/`.

## Release gate

The only release mechanism is `.github/workflows/deploy.yml`. It installs and builds from `v2/`, uploads `v2/dist`, and deploys only when **Deploy V2 to GitHub Pages** is manually dispatched. Do not trigger it until the remaining direction and final-release checkpoints are approved.

The current V1 source remains in the repository as the rollback implementation. Reverting the eventual promotion commit can restore the former deployment workflow if required.
