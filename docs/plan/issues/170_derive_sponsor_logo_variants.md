---
status: Complete
issue: 170
issue_url: https://github.com/denhamparry/squirrelsteam/issues/170
branch: denhamparry.co.uk/feat/gh-issue-170
deploy: no
---

# Plan: Derive sponsor logo variants

## Problem and outcome

Create transparent light and dark artwork for all five sponsors from the files
supplied by the maintainer, without generative redraws or geometry changes. Keep
the original files in the repository, record their hashes and local derivation,
remove opaque mattes and dead padding, and ensure every final asset remains
legible on the site's dark footer or light page surface.

Issue #170 and its empty discussion were fetched on 2026-09-15. The maintainer
then explicitly authorized local-tool derivation from the five files present in
`~/Downloads/Sponsors/`. This authorizes reversible artwork processing but does
not represent the outputs as separately sponsor-supplied brand-pack files.

## Implementation

1. Preserve normalized copies of all five inputs under
   `src/assets/sponsors/source/` and record SHA-256, source filename, receipt
   timestamp, supplier, and transformation notes in a local README.
2. Keep Cornerstone as SVG because it is entirely outlined paths: trim the
   viewBox, retain the supplied dark colours, and replace only the dominant dark
   grey with white in the knockout variant while retaining the coloured cube.
3. Render Imperial at 4× source dimensions to transparent PNG so the committed
   variants have no font dependency. For the knockout render, change only the
   near-black wordmark and small live-text fill to white before rasterization;
   preserve its purple marks and detailed gold crest.
4. Remove Hollybush's flat white matte, retain the supplied colours for the dark
   variant, and derive an all-white knockout from the same alpha silhouette.
5. Crop D&C to its meaningful artwork bounds. Retain the blue mark in both
   variants while mapping only the low-saturation “Plastering” artwork to white
   or charcoal for the appropriate surface.
6. Derive On the River's antialiased alpha from its monochrome JPEG luminance,
   mapping the supplied near-black matte to transparent and emitting white and
   charcoal variants from one identical silhouette.

## Files expected to change

- `src/assets/sponsors/README.md`
- `src/assets/sponsors/source/imperial.svg`
- `src/assets/sponsors/source/hollybush-properties.png`
- `src/assets/sponsors/source/dc-plastering.png`
- `src/assets/sponsors/source/cornerstone-finance-group.svg`
- `src/assets/sponsors/source/on-the-river.jpeg`
- `src/assets/sponsors/imperial-light.png`
- `src/assets/sponsors/imperial-dark.png`
- `src/assets/sponsors/hollybush-properties-light.png`
- `src/assets/sponsors/hollybush-properties-dark.png`
- `src/assets/sponsors/dc-plastering-light.png`
- `src/assets/sponsors/dc-plastering-dark.png`
- `src/assets/sponsors/cornerstone-finance-group-light.svg`
- `src/assets/sponsors/cornerstone-finance-group-dark.svg`
- `src/assets/sponsors/on-the-river-light.png`
- `src/assets/sponsors/on-the-river-dark.png`
- `docs/plan/issues/170_derive_sponsor_logo_variants.md`

No page, component, sponsor-data, link, dependency, workflow, or deployment
change is in scope; issues #169, #171, and #172 own those consumers.

## Validation

- Verify every original SHA-256 against the provenance table.
- Require both variants for each sponsor, transparent raster alpha or an SVG
  transparent viewBox, no live SVG text/font dependency, and no raster shorter
  than 144px (3× the intended maximum 48px rendered height).
- Compare each light/dark pair's alpha silhouette after rendering at the same
  dimensions; geometry should be identical apart from antialiasing caused by
  colour substitution.
- Measure alpha/content bounds to reject opaque canvases and excessive padding.
- Render a labelled contact sheet on `#1a1a1a` and `#f7f7f5`, inspect it at full
  size, and check legibility, edge halos, detail retention, and optical weight.
- Run `npm run check`, `npm run build`, `npm audit --omit=dev`, `git diff
  --check`, exact path-scope assertions, and staged pre-commit hooks.

Prototype rendering completed before implementation. ImageMagick preserved
Imperial's crest detail at 4x raster density, produced clean luminance-derived
alpha for On the River, isolated D&C's high-saturation blue from its neutral
wordmark, and removed Hollybush's white matte without changing its geometry.
Cornerstone rendered correctly from the proposed tight SVG viewBox on both
light and dark surfaces.

## Risks and decisions

- Local derivatives are explicitly identified as such; provenance must not
  imply that sponsors supplied or approved these exact variants.
- Rasterizing Imperial freezes the supplied rendering and removes its Avenir
  dependency. At 4× source dimensions it remains above 3× the intended footer
  height without pretending a fallback font is an outlined official source.
- JPEG/white-matte removal can create edge halos. Full-size dark/light previews
  and alpha inspection are required before handoff.
- The issue's “ideally SVG” wording permits transparent PNG where the only safe
  deterministic input is raster or contains live text.
- No AI image generation, sponsor outreach, URL discovery, merge, issue closure,
  deploy, SSH, or destructive cleanup is authorized.

## Issue traceability

| Source item | Disposition | Timing / owner / prerequisite | Evidence target |
| --- | --- | --- | --- |
| Five light and dark assets | Implement in this PR | Pre-merge / Codex / supplied files | Ten named final assets |
| No baked opaque background | Implement in this PR | Pre-merge / Codex / alpha processing | Transparent corners and non-opaque canvas |
| No SVG font dependency | Implement in this PR | Pre-merge / Codex / vector inspection | No `text` or `font-family` in final SVGs; Imperial rasterized |
| Trim dead padding | Implement in this PR | Pre-merge / Codex / content-bound checks | Tight, intentional margins around artwork |
| Record who supplied assets and when | Implement in this PR | Pre-merge / maintainer files and metadata | README provenance table with source hashes |
| On the River transparent and dark-on-light versions | Implement in this PR | Pre-merge / local luminance extraction | Matching white/charcoal alpha silhouettes |
| Hollybush transparent and knockout versions | Implement in this PR | Pre-merge / local matte removal | Colour-preserving dark and white knockout PNGs |
| Cornerstone light counterpart | Implement in this PR | Pre-merge / outlined source SVG | Trimmed dark SVG and path-identical knockout SVG |
| Imperial outlined text | Satisfy without SVG text | Pre-merge / 4× rasterization | Transparent PNGs contain no runtime font dependency |
| D&C footer-size legibility | Implement and validate | Pre-merge / local colour separation | Blue retained; secondary text contrasts on both surfaces |
| Sponsor-supplied official variants | Not claimed | External / sponsors | Local README labels every output as maintainer-authorized derivative |
| Footer/data/fundraising consumers | Intentionally out of scope | Issues #169, #171, #172 | No consumer source changes |

## Implementation review

Completed on 2026-09-15 with all planned files and no consumer-code changes.
The final contact sheet was inspected at full size on `#1a1a1a` and `#f7f7f5`;
all ten variants are legible and retain the expected brand details without an
opaque tile or visible matte halo.

- Four stored-source SHA-256 values match their supplied inputs exactly. The
  repository hook added one terminal LF to Imperial; both its supplied and
  normalized hashes are recorded, and the XML/artwork is otherwise unchanged.
- All eight final PNGs contain transparent alpha, are at least 176px high, and
  have tight content bounds. D&C retains an intentional 10–11px crop margin.
- Each light/dark pair has zero differing alpha pixels, including Cornerstone
  after rendering its SVG variants at equal dimensions.
- Final Cornerstone SVGs pass XML parsing, use outlined paths only, and contain
  neither `<text>` nor `font-family`.
- `npm run check`: 20 files, zero errors, warnings, or hints.
- `npm run build`: six static pages built successfully.
- `npm audit --omit=dev`: zero vulnerabilities.
- `git diff --check` and the planned-path scope assertion pass.

Automated code-security scanners were not applicable: this change contains
only inert image assets and documentation. Manual review covered provenance,
path scope, image geometry, transparency, resolution, colour contrast, and SVG
structure.
