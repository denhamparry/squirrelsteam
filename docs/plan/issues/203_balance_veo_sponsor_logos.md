---
status: Complete
issue: 203
issue_url: https://github.com/denhamparry/squirrelsteam/issues/203
branch: denhamparry.co.uk/fix/gh-issue-203
deploy: no
---

# Plan: Balance Veo sponsor logo prominence

## Problem and outcome

The tiered Veo layouts merged in PR #199 give secondary sponsors smaller tiles,
but the artwork inside those tiles is not optically constrained. On the cover,
EST Group is 77px high and occupies 6,044 visible pixels, making it larger than
the primary marks by area and taller than three of them. In the lower banner,
D&C Plastering is only 28px high and becomes unreadable at playback size.

Keep the approved sponsor order, source artwork, surfaces, output dimensions,
and Veo overlay clearance while making both secondary marks objectively smaller
than every primary mark. Give the wide D&C wordmark enough native height to
remain readable by widening both lower-banner secondary tiles, and reduce EST
inside both assets to prevent its dense block lettering from dominating.

Issue #203 and its empty discussion were fetched on 2026-09-16 after dependency
PR #199 merged at `6939782f2f456ee54566383fdfcb2dda8cf3be92`. The issue was
reproduced against that merge before implementation. Uploading the regenerated
PNGs remains an authorized operator action after merge and is non-blocking.

## Implementation

1. Keep the cover's six existing slots and all x/y clearance unchanged. Reduce
   EST's centred fit box from 150x78 to 96x50 so its visible height and logo-pixel
   area fall below the smallest primary values. Leave D&C and all primary cover
   marks unchanged.
2. Rebalance the 2400x300 lower banner to four 411x252 primary tiles and two
   300x180 secondary tiles. Preserve 36px outer margins, 12px intra-tier gutters,
   a 36px inter-tier break, primary-first order, and smaller secondary tile area.
3. Centre resized primary artwork inside the narrower tiles. Render D&C at
   270x44 so its visible lettering is at least 40px high, and render EST at
   120x62 so both secondary marks remain below every primary in visible height
   and measured logo-pixel area.
4. Update both layered SVG sources and regenerate both PNG upload artifacts from
   their normalized sponsor variants with ImageMagick. Preserve a 1440x360
   opaque cover and a 2400x300 RGBA lower banner with transparent gutters.
5. Update the Veo recipes and state the shared sizing rule: compare logos against
   their tile surface at a 6% luminance-difference threshold; every secondary
   must have lower visible-pixel area and a shorter visual extent than every
   primary. Record D&C's separate 40px native-height floor.

## Files expected to change

- `src/assets/logo/veo-cover.svg`
- `src/assets/logo/veo-cover.png`
- `src/assets/sponsors/veo-lower-banner.svg`
- `src/assets/sponsors/veo-lower-banner.png`
- `docs/veo-overlays.md`
- `docs/plan/issues/203_balance_veo_sponsor_logos.md`

The website sponsor data and displays, individual sponsor variants and sources,
Veo crest, output dimensions, deployment, merge, and live Veo upload are out of
scope.

## Validation

- Parse both SVGs and require six named sponsor groups in primary-first,
  alphabetical tier order with the documented sources, surfaces, and geometry.
- Require the cover slots to retain their merged #199 bounds, every element at
  x>=316, and the lower row at x=832..1204, clear of the lower-left Veo identity.
- Measure logo extents against their tile backgrounds and count pixels exceeding
  a 6% grayscale difference. Require both cover secondary marks to be below the
  minimum primary height and pixel count; apply the same stronger objective
  check to the lower banner and require D&C's visible height to be at least 40px.
- Regenerate both PNGs from the documented recipes and require zero differing
  pixels, exact dimensions, an opaque cover, and transparent banner gutters.
- Inspect the native images and a 390px-wide cover for primary recognition,
  secondary distinction, tier hierarchy, and freedom from overlap.
- Run `npm ci`, `npm run check`, `npm run build`, `npm audit --omit=dev`,
  `git diff --check`, and all pre-commit hooks.
- Review final workflow path filters; the unfiltered pull-request CI should
  schedule check/build/audit for the asset and documentation change.

## Risks and design decisions

- A secondary tile must widen to give D&C a 40px-high wordmark without changing
  its aspect ratio. Narrowing each primary tile by 45px makes that room while
  retaining larger primary tile area and the established spacing hierarchy.
- EST's compact, dense lettering accumulates more visible pixels than wide
  wordmarks. The shared height-and-area rule prevents aspect ratio alone from
  determining apparent rank.
- At a 390px cover preview, the reduced EST mark is approximately 26x13px. It
  remains distinguishable, while the four primary marks keep their existing
  cover sizes and recognition.
- The raster artifacts are deliberately committed snapshots. Exact SVG geometry,
  deterministic export recipes, and pixel reproduction protect them from drift.

## Implementation validation

- The failure-shaped baseline reproduced the issue: the cover's EST mark was
  77px high with 6,044 pixels above the 6% difference threshold, while the
  smallest primary values were 52px and 2,898 pixels. D&C's lower-banner visual
  extent was only 28px high.
- The regenerated cover measures 2,534 pixels / 49px for its largest secondary
  values, below primary minima of 2,895 pixels / 52px. The lower banner measures
  4,081 pixels / 62px for its largest secondary values, below primary minima of
  7,420 pixels / 96px; D&C is 41px high.
- Both SVGs parse as XML and contain exactly six named sponsor groups in the
  expected order. Geometry checks passed for every tile and fit canvas, including
  the unchanged cover slots, x>=316 bound, and x=832..1204 lower row.
- Independent recipe reruns differ from both committed PNGs by zero pixels and
  have matching SHA-256 hashes. The cover is opaque 1440x360 sRGB; the banner is
  2400x300 RGBA with transparent outer gutters and opaque sponsor tiles.
- Native visual inspection shows clear tier hierarchy without overlap. At the
  390x98 cover check, all four primary marks remain recognizable and both
  secondary marks remain distinguishable.
- `npm ci`, `npm run check`, `npm run build`, `npm audit --omit=dev`, XML parsing,
  `git diff --check`, and all pre-commit hooks passed. The pull-request CI has no
  path filter and is expected to schedule check/build/audit after publication.

## Branch review

**Classification:** non-code visual-asset and documentation change, standard
risk. The repository has no `docs/pre-pr-branch-review.md`; Trail of Bits review
skills were skipped because no code-relevant files changed. Manual review covered
the complete diff, both tier layouts, linked sources and surface polarity,
aspect-ratio-preserving fit behavior, deterministic exports, pixel metrics,
transparent/opaque output semantics, the live issue and empty discussion, and
the documented non-blocking operator upload. No blocking issue or non-blocking
follow-up idea remains.

The bug-pattern sweep covered both sponsor-bearing Veo images. The Veo crest has
no sponsor hierarchy, while the fundraising and footer layouts already enforce
smaller secondary caps and were explicitly excluded by the issue. Historical
plans retain their implementation-time geometry intentionally; current recipes
and SVGs contain no stale values from the failed layout.

## Issue traceability

| Requirement | Timing / owner / prerequisite | Evidence | Current result |
| --- | --- | --- | --- |
| Cover secondary marks below every primary by area and height | Pre-merge / Codex / merged #199 | Pixel-area and extent measurements | Passed: 2,534/49 secondary maxima < 2,895/52 primary minima |
| Lower-banner secondary marks visibly smaller than every primary | Pre-merge / Codex | Pixel-area and extent measurements | Passed: 4,081/62 secondary maxima < 7,420/96 primary minima |
| D&C lettering at least 40px high at native banner size | Pre-merge / Codex | Extent measurement | Passed at 41px |
| Preserve output dimensions, order, slot rules, and cover clearance | Pre-merge / Codex | SVG geometry and image metadata | Passed |
| Cover remains usable at 390px | Pre-merge / Codex | Scaled visual inspection | Passed |
| Docs, SVGs, and PNGs agree and state sizing rule | Pre-merge / Codex | Recipe review and zero-difference reproduction | Passed |
| Check, build, audit, hooks, and CI pass | Pre-merge / Codex/GitHub | Command and check results | Local gates and hooks passed; PR CI pending |
| Upload regenerated PNGs and inspect live Veo rendering | Post-merge / Clubhouse admin | Live stream and phone-app observation | Deferred, non-blocking operator step |
| Site layouts, sponsor data, source artwork, deploy, and merge | Out of scope | Diff review | Not performed |
