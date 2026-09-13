# Integrated V2 redesign review

Review date: 13 September 2026

## Outcome

The three visual directions now form one product experience rather than three competing concepts. The home route presents a continuous sequence—Observe, Operate, Remember—while `/observatory`, `/os`, and `/archive` retain distinct, complete workspaces for detailed review.

## Direction maturity

- Knowledge Observatory retains its high-effort spatial model, semantic scales, access horizon, evidence animation, version lineage, and reversible citations.
- Institutional OS is no longer a foundation placeholder. It now presents an operational command surface, identity context, claim ledger, explicit evidence exclusions, passage-level source inspector, and deterministic trace.
- Living Archive is no longer a foundation placeholder. It now presents a permission-aware editorial dossier, footnoted claims, expandable source folios, and a three-version chronology.

## Shared theme system

All routes consume the same 14-palette semantic library. The appearance selector separates eight light palettes from six dark palettes, and remembers the last selection in each mode. Palettes are not direction skins; they preserve the same evidence, restriction, version, focus, and relationship meanings everywhere.

## Copy and legibility

The copy hierarchy was reviewed visually in representative light and dark states. Critical microtype was enlarged, low-opacity labels were strengthened, SVG labels received a backed halo, and explanatory prose was separated from identifier typography. The complete naked copy layer is available in `docs/TEXT_ONLY_CONTENT.md`.

## Architecture boundary

Direction-specific composition remains inside each direction folder. Shared code handles mechanics: data, deterministic retrieval, routing, theme state, and the small query-state hook. The old shared neutral renderer, query probe, and direction foundation were removed after they stopped serving a product route.

## Verification commands

```text
npm run validate:model
npm run validate:themes
npm run typecheck
npm run build
npm test
npm run capture:review
```

The capture script produces 11 ignored review frames under `artifacts/design-review`, spanning the integrated page and all three workspaces in representative light, dark, and mobile states.
