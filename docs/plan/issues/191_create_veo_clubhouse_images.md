---
status: Complete
issue: 191
issue_url: https://github.com/denhamparry/squirrelsteam/issues/191
branch: denhamparry.co.uk/feat/gh-issue-191
deploy: no
---

# Plan: Create Veo Clubhouse profile images

## Problem and outcome

Veo Clubhouse needs a square club crest and a 4:1 cover image, but the
repository currently contains only the transparent Veo Live overlay mark and
lower-banner candidate. Add upload-ready PNGs with adjacent editable SVG
sources, reusing the approved club and sponsor artwork without redrawing it.

Issue #191 and its empty discussion were fetched at
2026-09-16T10:54:50Z. The repository deliverable is sufficient to close the
issue; uploading the images to Veo remains a later, non-blocking operator task.

## Implementation

1. Compose a 1024x1024 crest on the existing `#1a1a1a` club background. Link
   the approved white Veo squirrel mark in the SVG and preserve its roughly
   70% safe-area footprint in the opaque PNG.
2. Compose a 1440x360 cover on the same background. Keep all content inside the
   central 1200x300 safe zone, use the club mark and identity at the top, and
   place all five sponsors alphabetically in one row of identical slots.
3. Link each sponsor's existing `-light` asset from a clearly named SVG group.
   Size the artwork optically inside equal slots so no placement implies a
   sponsorship tier.
4. Document the two slot requirements, source links, deterministic export
   recipe, small-size checks, and the requirement to regenerate and re-upload
   the cover whenever the sponsor list changes.

## Files expected to change

- `src/assets/logo/veo-crest.svg`
- `src/assets/logo/veo-crest.png`
- `src/assets/logo/veo-cover.svg`
- `src/assets/logo/veo-cover.png`
- `docs/veo-overlays.md`
- `docs/plan/issues/191_create_veo_clubhouse_images.md`

Sponsor records, source artwork, tiers, prices, kit placements, dependencies,
live Veo settings, deployment, merging, and issue closure are out of scope.

## Validation

- Before implementation, confirm both target assets are absent and that the
  approved club mark and five alphabetical `-light` sponsor inputs exist.
- Parse both SVGs and assert the cover contains five named sponsor groups in
  alphabetical order, each linked to the expected `-light` source and using
  an identical slot rectangle within the 1200x300 safe zone.
- Regenerate both PNGs from the documented ImageMagick recipe and require
  pixel-identical output. Verify exact 1024x1024 and 1440x360 dimensions,
  opaque PNG output, and sizes below 2.5 MB.
- Measure the crest's non-background bounds, centre, and safe-area occupancy.
  Inspect 64px crest previews on light and dark UI backgrounds and inspect a
  390px-wide cover preview to confirm the club and all five sponsors remain
  recognizable.
- Search the new assets for prohibited tier, price, and kit-placement copy.
- Run `npm ci`, `npm run check`, `npm run build`, `npm audit --omit=dev`,
  `git diff --check`, and every staged pre-commit hook.

## Risks and research validation

This is a standard-risk visual asset change with no runtime or external-state
mutation. The existing `veo-upper-right-mark` is the authoritative white mark
for a dark surface and already occupies approximately 66% by 69% of its square
canvas. Every required sponsor has an existing `-light` variant documented for
dark surfaces. Linking those sources in SVG preserves provenance and future
editability; direct ImageMagick composition provides deterministic PNG exports
because the local SVG delegate does not reliably render linked images.

The analogous-pattern sweep covered both existing Veo overlay assets, the
club logo directory, all sponsor variants and provenance documentation, the
shared alphabetically sorted sponsor data, and generated-site consumers. The
new assets are separate Clubhouse profile slots and do not replace either Veo
Live overlay.

Approved after one research-review iteration. The plan uses established repo
artwork and background colour, makes equality structural through fixed slots,
and validates the two actual small display sizes called out by the issue.

## Implementation validation

- Both SVGs parse successfully. The cover contains five ordered, named sponsor
  groups whose links resolve to the expected `-light` inputs; all slot
  rectangles are 220x112 and stay inside the 1200x300 safe zone.
- Direct regeneration from the documented ImageMagick composition produced
  zero changed pixels for both committed PNGs.
- The crest is 1024x1024, 73,073 bytes, opaque sRGB, with non-background bounds
  of 672x707 at +207+125. The cover is 1440x360, 67,306 bytes, and opaque sRGB.
- Manual inspection passed for the full-resolution files, the crest at 64px on
  light and dark surfaces, and the complete cover at 390px wide. The club mark
  and five distinct sponsor identities remain recognizable.
- `npm ci` installed 267 locked packages with zero vulnerabilities.
  `npm run check` passed 23 files with zero diagnostics; `npm run build` built
  all six pages; and `npm audit --omit=dev` found zero vulnerabilities.
- `git diff --check` and all nine repository pre-commit hooks passed, including
  large-file, secret, and Markdown checks.
- The issue was fetched again after implementation. Its title, body, labels,
  open state, and empty discussion remain unchanged from the planning snapshot.
- After the PR opened, the maintainer replaced the age-grade identity with
  `RHIWBINA SQUIRRELS #1415`. The SVG metadata, visible cover, export recipe,
  and regenerated PNG now use the stable 2014/2015 birth-year cohort name.

## Branch review

**Classification:** Visual asset and documentation change, standard risk.

- The planned and actual path sets match exactly: two PNGs, their two adjacent
  SVG sources, the Veo documentation, and this plan.
- The complete staged diff, both rendered assets, both small-size previews,
  every linked source, and the generated hashes were reviewed. The PNG outputs
  contain no alpha or metadata and no external data is embedded in the SVGs.
- The analogous-pattern sweep found no other Clubhouse profile asset or
  competing source of truth. The existing lower-banner and upper-right assets
  remain unchanged and serve different Veo Live slots.
- Review found no blocking issue and no non-blocking follow-up idea. Independent
  post-PR verification remains the final workflow gate.

## Issue traceability

| Issue item | Disposition | Timing / owner / prerequisite | Evidence target | Current result |
| --- | --- | --- | --- | --- |
| 1024x1024 crest under 2.5 MB on solid dark background | Implement in this PR | Pre-merge / Codex | PNG inspection and file size | Pass |
| Faithful centred squirrel at roughly 70% safe area | Implement and validate | Pre-merge / Codex | Linked approved mark and pixel bounds | Pass |
| Crest legible at 64px on light and dark UI | Validate in this PR | Pre-merge / Codex | Rendered contact sheet | Pass |
| 1440x360 cover under 2.5 MB | Implement in this PR | Pre-merge / Codex | PNG inspection and file size | Pass |
| Content inside central 1200x300 safe zone | Implement and validate | Pre-merge / Codex | SVG geometry audit | Pass |
| Five sponsors, alphabetical, one equal row | Implement and validate | Pre-merge / Codex | Named groups, equal slots, 390px preview | Pass |
| Use each sponsor's `-light` variant | Implement in this PR | Pre-merge / Codex | SVG href audit | Pass |
| Editable linked SVG sources beside PNGs | Implement in this PR | Pre-merge / Codex | XML and path checks | Pass |
| Slot, source, export, and regeneration documentation | Implement in this PR | Pre-merge / Codex | Documentation review | Pass |
| No tiers, prices, kit placements, or private details | Validate in this PR | Pre-merge / Codex | Content search and visual review | Pass |
| Build and pre-commit hooks pass | Validate in this PR | Pre-merge / Codex | Command results | Pass |
| Upload or activate in Veo | Intentionally deferred | Post-merge / authorized operator | Veo Clubhouse | Not performed |
