# Visual legibility audit

## What was inspected

The desktop and mobile views of the integrated index, Knowledge Observatory, Institutional OS, Living Archive, and comparison page were reviewed at representative light and dark palettes.

## Problems found before redesign

- Many metadata, timeline, citation, map, and retrieval-stage labels rendered between 8 and 10 pixels.
- Uppercase monospace typography carried both identifiers and explanatory copy, reducing reading fluency.
- Muted text was sometimes paired with low opacity, compounding contrast loss.
- SVG labels sat directly over dense lines and nodes without a stable backing treatment.
- The closed map readout used 48 percent opacity even though its instruction was important.
- Institutional OS and Living Archive were foundation placeholders, so their copy hierarchy could not be meaningfully reviewed.

## Changes made

- Explanatory text now uses the interface or editorial typeface; monospace is reserved for identifiers, states, dates, and controls.
- Tiny metadata floors were raised to roughly 11 pixels, with normal explanatory text generally 12–16 pixels or larger.
- Map labels now use larger type and a surface-colored stroke behind the fill, creating a readable halo over geometry.
- Access-horizon labels and outlines are more visible.
- Inactive workflow stages remain subordinate but no longer disappear into very low opacity.
- Answer copy, claims, exclusions, and source passages have distinct hierarchy and bordered reading regions.
- Both previously undeveloped directions now have complete, direction-specific compositions that make copy review possible.

## Automated guardrail

`npm run validate:themes` checks all shared palettes. Normal text, muted text, primary text, evidence text, and restricted text must meet at least 4.5:1 against both the background and primary surface. Focus color must meet at least 3:1 against the background.
