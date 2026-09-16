---
status: Complete
issue: 197
issue_url: https://github.com/denhamparry/squirrelsteam/issues/197
branch: denhamparry.co.uk/feat/gh-issue-197
deploy: no
---

# Plan: Show sponsors in primary and secondary tiers

## Problem and outcome

The site and Veo artwork currently present every sponsor as one equal,
alphabetical list. Replace that superseded rule with one shared, required tier
model: four larger primary sponsors first and two smaller secondary sponsors
second, alphabetically ordered inside each tier. Apply it consistently to the
fundraising page, footer, lower banner, and Clubhouse cover without exposing
private prices, package mappings, or kit placements.

Issue #197 and its empty discussion were fetched at 2026-09-16T12:26:59Z after
blocker #196 closed through merged PR #198 at
`0c771382a0571b0d09b60236825704b802fc53af`. Issue #195 and its empty
discussion were also fetched then. Its three stale Clubhouse documentation
items will be folded into this work, so the eventual PR should close both #197
and #195. The newer #197 requirement to regenerate the cover supersedes #195's
original unchanged-cover criterion; the documentation corrections remain
applicable.

## Implementation

1. Add a required `SponsorTier` field to every sponsor, sort by tier then name,
   and export one non-empty `sponsorTiers` grouping with the two shared labels.
2. Add a backwards-compatible heading-level prop to `Card`. Render the
   fundraising groups as `h3` sections with `h4` card titles, preserving the
   existing `h2` and keeping the package-price section separate and unchanged.
   Primary cards retain 7rem logo areas; secondary cards use 4.5rem areas and
   a denser two-column grid.
3. Render two labelled footer lists from the same grouping. Primary logos use
   4rem areas in 2x2 grids at 320px and 600px and a 1x4 grid at 1280px;
   secondary logos use 2.75rem areas in one two-logo row at every width.
4. Recompose the transparent 2400x300 lower banner with four 456x252 primary
   tiles at x=36, 504, 972, and 1440, followed after a 36px inter-tier gap by
   two 210x180 secondary tiles at x=1932 and 2154. Intra-tier gutters remain
   12px. Preserve each logo's existing light/dark surface rule and place EST on
   white without recolouring.
5. Recompose the opaque 1440x360 Clubhouse cover with four 218x136 primary
   slots at x=316, 546, 776, and 1006, y=32, plus two 180x104 secondary slots
   at x=832 and 1024, y=184. This keeps every element at x>=316 and confines
   the lower row to the right of Veo's lower-left identity overlay.
6. Omit text labels from both Veo images. At typical 8:1 playback size and a
   390px cover preview they would be too small to read and would reduce logo
   legibility. Record this explicit exception in the SVG descriptions, docs,
   and PR while keeping grouping clear through order, scale, and spacing.
7. Update both Veo recipes, tables, source inventories, tier rationale, and
   six-sponsor operator checks. Fold in #195 by correcting the safe-zone text,
   putting the cover-source introduction directly before its list, and removing
   the obsolete font instruction for text-free exports.

## Files expected to change

- `src/data/sponsors.ts`
- `src/components/Card.astro`
- `src/components/SponsorBand.astro`
- `src/pages/fundraising.astro`
- `src/assets/sponsors/veo-lower-banner.svg`
- `src/assets/sponsors/veo-lower-banner.png`
- `src/assets/logo/veo-cover.svg`
- `src/assets/logo/veo-cover.png`
- `docs/veo-overlays.md`
- `docs/plan/issues/197_show_sponsor_tiers.md`

The crest, individual sponsor artwork, sponsor descriptions/URLs, and the
Platinum/Black/White package section are unchanged. Uploading either PNG to Veo
is an authorized operator action after merge and does not block issue closure.

## Validation

- Run `npm ci`, `npm run check`, `npm run build`, `npm audit --omit=dev`,
  `git diff --check`, and all pre-commit hooks.
- In a bounded temporary project fixture, remove one entry's required `tier`
  and require `npm run check` to fail specifically on the missing property.
- Inspect generated HTML on all six pages for two labelled footer lists, the
  exact primary/secondary membership and alphabetical order, and no private
  package, price, or placement text inside sponsor displays.
- Use a bounded local server and browser screenshots/DOM measurements at
  320px, 600px, and 1280px. Require footer layouts 2x2 + 1x2, 2x2 + 1x2,
  and 1x4 + 1x2; confirm primary logo height exceeds secondary height. On the
  fundraising page require ordered headings without skipped levels, 7rem vs
  4.5rem logo areas, and no horizontal overflow at 320px.
- Parse both SVGs for exactly six named sponsor groups in primary-first tier
  order. Require the lower-banner geometry, 36px tier gap, correct source and
  surface choice, and the cover's x>=316 / right-side lower row bounds.
- Regenerate both PNGs from the documented ImageMagick recipes and require zero
  differing pixels, exact dimensions, transparent banner gutters, and an opaque
  cover. Inspect the full banner/cover and a 390px cover copy for primary
  recognition and secondary distinction.
- Require the issue's stale-tier wording search to return no matches in
  `src/`, `docs/veo-overlays.md`, or either SVG. Confirm the Clubhouse source
  introduction directly precedes its list and no irrelevant font instruction
  remains.
- Inspect final workflow path filters. The unfiltered pull-request CI should
  schedule its check/build/audit job for this change set.

## Risks and design decisions

- EST's published source is only 260px wide. Keeping it in a smaller secondary
  slot avoids unnecessary upscaling; inspect it at native and 390px output
  sizes without tracing or inventing vector artwork.
- The cover's secondary row occupies x=832..1204 and y=184..288. This is inside
  the documented safe zone and intentionally far right of the observed Veo
  crest/team-name overlay, but the final live upload remains an operator check.
- Labels are structurally present and accessible on both website displays.
  Omitting them from the tiny Veo raster contexts is an issue-authorized,
  documented legibility exception, not an unrecorded acceptance gap.
- The cover remains a raster snapshot of shared data rather than a generated
  build artifact. Exact SVG group/source audits and pixel reproduction guard
  against data/artwork drift.

## Implementation validation

- The first real-project `npm run check` exposed an implementation error: the
  inline array's tier literals widened to `string` before sorting. Typing the
  unsorted source collection as `readonly Sponsor[]` and sorting a copy fixed
  it; the complete check then passed with zero diagnostics.
- An isolated temporary fixture removed one `tier` property. `npm run check`
  exited 1 with the expected “Property 'tier' is missing” diagnostic. A second
  fixture appended an alphabetically earlier primary sponsor at the end of the
  source array; the build rendered it first inside the primary group.
- Generated HTML on every page contains the two labelled footer groups with
  exact membership and order. Fundraising renders `h2` / group `h3` / card
  `h4` headings and contains no package, price, or placement copy inside the
  sponsor section.
- Browser measurements at 320px, 600px, and 1280px passed with zero horizontal
  overflow. Footer rows are 2x2 + 1x2, 2x2 + 1x2, and 1x4 + 1x2; logo heights
  are 64px primary and 44px secondary. Fundraising logo areas are 112px and
  72px, with primary grids of one, one, and two columns respectively.
- Both SVGs parse and contain the six expected sponsor groups, links, tier
  order, and exact geometry. Direct recipe reproduction differs from each PNG
  by zero pixels. The banner is 2400x300 RGBA with transparent gutters; the
  cover is 1440x360 opaque sRGB. Full and 390px visual checks passed.
- The first cover export used ImageMagick's default white `-extent` canvas,
  hiding white artwork. Explicit transparent fit canvases fixed the recipe and
  are now documented. The first HTML validator overran an attributed heading,
  and the first browser harness waited indefinitely on off-screen lazy images;
  both were setup errors corrected before their passing reruns.

## Branch review

**Classification:** code-relevant website and visual-asset change, standard
risk. The repository has no `docs/pre-pr-branch-review.md`, and the named
differential-review and Trail of Bits skills are unavailable in this session.
The concrete manual fallback reviewed the complete diff, shared tier model and
both consumers, every `Card` call site, heading/accessibility output, all three
responsive widths, SVG source resolution and geometry, deterministic raster
exports, privacy boundaries, stale-wording search, issue chronology, and exact
path scope. No blocking issue or non-blocking follow-up idea remains.

## Issue traceability

| Requirement | Timing / owner / prerequisite | Evidence | Current result |
| --- | --- | --- | --- |
| Required primary/secondary tier on every sponsor | Pre-merge / Codex / merged #196 | Positive check plus missing-tier negative fixture | Passed |
| Exact membership; tier-first alphabetical order independent of insertion order | Pre-merge / Codex | Data review, appended-entry fixture, and all rendered surfaces | Passed |
| One shared labelled grouping used by both site consumers | Pre-merge / Codex | Imports, generated headings, and membership | Passed |
| Fundraising primary cards larger; ordered h2/h3/h4; no 320px overflow | Pre-merge / Codex / browser | DOM measurements and screenshots | Passed |
| Footer primary larger; no 3+1; secondary one row at 320/600/1280 | Pre-merge / Codex / browser | DOM measurements and screenshots on built pages | Passed |
| Lower banner grouped primary-first with larger primary tiles | Pre-merge / Codex / approved artwork | SVG geometry, pixel reproduction, visual review | Passed |
| Cover grouped primary-first, x>=316, lower row right, legible at 390px | Pre-merge / Codex / #194 live evidence | SVG bounds, pixel reproduction, scaled review | Passed |
| Veo labels present or documented exception | Pre-merge / Codex | Explicit SVG/docs/PR rationale | Passed by documented legibility exception |
| Remove equal/non-ranking wording and fold in #195 corrections | Pre-merge / Codex | Required search and documentation structure review | Passed |
| #195 originally required unchanged cover files | Superseded by newer #197 cover-regeneration requirement | Live issue chronology and scoped cover diff | Superseded |
| No package mapping, prices, or kit placements in sponsor displays | Pre-merge / Codex | Scoped source and generated-HTML review | Passed |
| Check, build, audit, hooks, and CI pass | Pre-merge / Codex/GitHub | Command results and live PR checks | Local gates and hooks passed; PR CI pending |
| Upload both PNGs and check real Veo playback/app rendering | Post-merge / Clubhouse admin | Live stream and phone-app observation | Deferred, non-blocking operator step |
| Sponsor descriptions/URLs, individual artwork, crest, deploy, and merge | Out of scope | Diff review | Not performed |
