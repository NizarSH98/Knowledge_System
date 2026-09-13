# Shared design-system boundary

The V2 design system standardizes meaning and behavior, not appearance.

## Shared semantics

The semantic color contract includes background, surfaces, text hierarchy, primary action, evidence, current, restricted, superseded, warning, relationships, borders, focus, hover, and selection. Renderer colors map from the same theme definition as CSS custom properties.

Shared behavioral primitives may include:

- direction and palette selection
- identity selection
- query entry and deterministic result state
- citation/provenance disclosure
- focus restoration and live-region announcements
- lead form schema, errors, and submission adapter
- quality/static-mode controls

## Explicitly direction-owned

Directions do not share a universal header, hero, card, panel, section wrapper, grid, type scale, transition preset, or navigation shell. Those choices would collapse the candidates into one site with skins.

## Typography intent

- Observatory: restrained grotesk plus functional mono; measured instrument composition.
- Institutional OS: high-information sans/mono hierarchy; dense without visual noise.
- Living Archive: distinctive contemporary serif, restrained grotesk, and tabular archival metadata.

Font families will be selected and licensed at the start of each direction, then subset or self-hosted where permitted. No font decision is hidden inside a generic shared component.

## Interaction state vocabulary

`idle → querying → candidates → permission-filtered → version-filtered → ranked → answered/refused`

Each direction gives this state progression a different spatial and motion grammar while preserving the same deterministic transitions and accessible announcements.
