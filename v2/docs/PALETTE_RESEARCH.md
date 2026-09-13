# Shared palette research

## Decision

V2 uses one palette library across all three design directions. The library is deliberately split into eight light palettes and six dark palettes; a mode change selects a remembered palette within that mode instead of mechanically inverting the current colors.

## Design basis

- Radix’s palette guidance treats a useful application palette as a composed system: a neutral scale for most surfaces, one or two accent scales, and semantic scales for meaning. That supports V2’s neutral surfaces plus distinct evidence, relationship, restricted, warning, and current states. <https://www.radix-ui.com/colors/docs/palette-composition/composing-a-palette>
- Adobe Spectrum describes color as a semantic system whose values adapt by theme while preserving meaning. V2 therefore keeps semantic token names stable but assigns purpose-tuned values to each light and dark palette. <https://spectrum.adobe.com/page/color-system/>
- IBM’s design language emphasizes a structured, accessible color family rather than isolated decorative swatches. V2 palettes are complete token sets, not accent-color presets. <https://www.ibm.com/design/language/color/>
- WCAG’s contrast thresholds establish 4.5:1 for normal text and 3:1 for large text. V2 validates text-bearing semantic colors at 4.5:1 against both the page background and the primary surface, with a separate 3:1 floor for focus indication. <https://www.w3.org/WAI/WCAG20/versions/understanding/wcag20-understanding-20081211-letter.pdf>

## Palette families

### Light mode

1. Polar Sage — cool scientific calm.
2. Warm Paper — quiet editorial warmth.
3. Mineral Blue — measured technical clarity.
4. Quiet Clay — architectural and grounded.
5. Parchment Olive — institutional naturalism.
6. Mist Lilac — soft analytical focus.
7. Sandstone — warm operational restraint.
8. Soft Cyan — airy systems workspace.

### Dark mode

1. Night Instrument — precision scientific device.
2. Deep Cobalt — institutional computation.
3. Graphite Spectral — premium material neutrality.
4. Forest Slate — calm governed depth.
5. Aubergine Ink — quiet cultural intelligence.
6. Bronze Night — warm archival instrument.

## Constraints

- No palette relies on a bright neon field.
- Light and dark values are independently tuned.
- Semantic meaning does not change between modes.
- Every palette is available in every direction.
- The automated validator prevents small semantic text from dropping below 4.5:1 on normal surfaces.
