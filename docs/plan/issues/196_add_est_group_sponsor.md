---
status: Complete
issue: 196
issue_url: https://github.com/denhamparry/squirrelsteam/issues/196
branch: denhamparry.co.uk/feat/gh-issue-196
deploy: no
---

# Plan: Add EST Group artwork, data, and site placement

## Problem and outcome

EST Group is the club's sixth sponsor but is absent from the shared website
data and sponsor artwork. Add the published EST logo with auditable provenance,
include it in the existing site surfaces, and adapt the wide footer breakpoint
so six sponsors remain one balanced row.

Issue #196 was initially fetched with an empty discussion at
2026-09-16T11:42:09Z. A Phase 4 re-fetch found that its title and body had been
updated at 2026-09-16T11:47:26Z. The new scope supersedes the initial plan:
issue #197 owns sponsor tiers, grouping, and both Veo compositions and their
documentation. Issue #193 is closed as superseded by #197, and #195 is not part
of the current #196 scope. This pull request will close only #196.

## Implementation

1. Preserve the EST website header logo byte-for-byte in `source/`. Derive a
   trimmed original-colour dark variant and a light variant that turns only the
   neutral wordmark white while retaining the green square and source alpha.
2. Record the download URL, retrieval time, hash, and variant derivation in the
   sponsor artwork README, and update its sponsor count without claiming the
   downloaded file was supplied locally.
3. Add EST Group to the shared sponsor data with the issue-provided URL,
   `description: null`, and no `tier` field.
4. Change the wide footer grid from five to six equal columns. Leave the
   already-compatible fundraising page unchanged and validate that its shared
   data rendering includes EST correctly.

## Files expected to change

- `src/assets/sponsors/source/est-group.png`
- `src/assets/sponsors/est-group-dark.png`
- `src/assets/sponsors/est-group-light.png`
- `src/assets/sponsors/README.md`
- `src/data/sponsors.ts`
- `src/components/SponsorBand.astro`
- `docs/plan/issues/196_add_est_group_sponsor.md`

`src/pages/fundraising.astro` should not change because it already maps the
shared sponsor data into an even one- or two-column grid. Sponsorship tiers,
grouping, tier-based sizing, prices, kit placement, invented sponsor copy, Veo
assets and documentation, deployment, merging, and manual issue closure are
out of scope. The five Veo-related files briefly explored under the initial
issue body were restored exactly to `origin/main` after the issue changed.

## Validation

- Re-download the EST header logo, require SHA-256
  `c732d3d55bba136e2325426e3ea1184a9cec92b65f132f7c45dd2ca8bb87cb6d`,
  and byte-compare it with the repository source. Regenerate both variants and
  require zero pixel differences; verify transparency and the retained green
  square, then inspect each variant on its intended surface.
- Retain the 1280px failure-state capture made after adding the sixth data item
  but before the CSS fix, which demonstrates the 5+1 lone-logo row. After the
  fix, capture 320px, 600px, and 1280px views and require 2x3, 3x2, and 6x1
  equal grids with no lone item.
- Inspect generated HTML for all six alphabetical sponsors on every footer and
  six equal fundraising cards. Require EST's card to include its logo, name,
  same-tab URL, and `rel="noopener sponsored"`; confirm no fundraising source
  edit occurred.
- Require the sponsor artwork README to contain no stale `five` reference.
  Confirm no tier, price, placement, or guessed description was added, and
  require all Veo image/SVG/document paths to remain unchanged from main.
- Run `npm ci`, `npm run check`, `npm run build`, `npm audit --omit=dev`,
  `git diff --check`, and every staged pre-commit hook. Inspect CI path filters;
  the unfiltered pull-request workflow should schedule its check/build/audit
  job for this file set.

## Risks and research validation

The exact EST file was downloaded from the issue-specified URL at
2026-09-16T11:39:55Z. It is a 260x136 transparent PNG of 5,435 bytes and its
SHA-256 matches the issue. The source is deliberately retained as raster
artwork. Its resolution is appropriate for the website placements in this
issue; #197 owns any separate assessment needed for Veo compositions.

The analogous sweep covered the shared sponsor data and its footer and
fundraising consumers, plus all count-specific sponsor wording and layout.
No other in-scope sponsor consumer or count-specific site layout was found.

The first generated-HTML validator run exited 1 because its test searched for
raw `D&C` instead of the correctly encoded `D&amp;C`. This was a validator
assertion error, not a product failure. The corrected validator passed.

Approved after one research-review iteration and revised after the live issue
body changed. The approach preserves one website source of truth and uses real
browser evidence for the breakpoints most likely to regress.

## Issue traceability

| Issue item | Disposition | Evidence target | Current result |
| --- | --- | --- | --- |
| Website source file is byte-identical and provenance is recorded | Implement and validate | SHA-256 and byte comparison | Passed |
| Dark and light EST variants preserve required colours | Implement and validate | Deterministic pixel checks and contact sheet | Passed |
| Shared data contains EST URL and `description: null`, with no tier | Implement and validate | Source and generated output | Passed |
| Six ordered footer logos with no lone breakpoint row | Implement and validate | Failure screenshot plus 320/600/1280px corrected views | Passed |
| Six ordered equal fundraising cards and sponsored link | Validate without page change | Generated HTML and layout capture | Passed |
| README has no stale `five` wording | Implement and validate | Content search and documentation review | Passed |
| Veo assets and documentation remain unchanged | Exclude from this PR; deferred to #197 | Path diff and baseline comparison | Passed |
| Preserve privacy: no tier, price, placement, or guessed copy | Validate in this PR | Data/content review | Passed |
| Build, check, audit, and hooks pass | Validate in this PR | Command results | Passed |
| Tier grouping/sizing and Veo compositions | Intentionally deferred | #197 | Not performed |
