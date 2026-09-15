---
status: Complete
outcome: implementation complete
deploy: no
---

# Plan: Add sponsor logos to the site footer (#169)

- **Issue:** [#169](https://github.com/denhamparry/squirrelsteam/issues/169)
- **Snapshot:** fetched 2026-09-15T20:53:31Z; body SHA-256
  `00ed79edf807390eb42a7cb5f4cb03a7365d85d0ce9c6200c91a09edbf9ba133`;
  no comments
- **Base:** `origin/main` at
  `807efaae19aa898740dd688593caf567f61e2db5`

## Problem and outcome

The site promises sponsor visibility but its shared footer names no sponsors.
Now that #170 and PR #176 have supplied transparent light/dark variants, add a
black-background sponsor band above the existing footer content on every HTML
page. Use one shared data module, present all five sponsors equally in stable
alphabetical order, and render plain images until #171 supplies confirmed URLs.

## Implementation

1. Add `src/data/sponsors.ts` with the five display names, both logo variants,
   and nullable URL fields. Omit tier data because the issue explicitly treats
   tier as private and forbids using it to rank the presentation. Include the
   dark variants now so #172 can reuse the same source of truth.
2. Add `SponsorBand.astro`, using Astro's `Image` component with meaningful
   sponsor-name alternatives, lazy loading, asynchronous decoding, and explicit
   source dimensions. Render an anchor with `rel="noopener sponsored"` only
   when a confirmed URL exists; all current null URLs must produce plain images.
3. Give each sponsor the same grid cell and image-height rule. Use two columns
   at phone widths, three at intermediate widths, and five at desktop widths;
   retain the trimmed artwork's natural aspect ratio with `object-fit: contain`.
4. Render the band once at the top of `Footer.astro`, before the current brand,
   navigation, and legal content. Keep the footer black and leave page files
   untouched.

## Files expected to change

- `docs/plan/issues/169_add_sponsor_logos_footer.md`
- `src/data/sponsors.ts`
- `src/components/SponsorBand.astro`
- `src/components/Footer.astro`

The sponsor artwork, fundraising page, URLs, footer links, build configuration,
and dependencies remain unchanged.

## Validation

- Run `npm ci`, `npm run check`, `npm run build`, and
  `npm audit --omit=dev`.
- Inspect every generated HTML page and assert one labelled sponsor band, five
  sponsor-name alt attributes, five lazy images with explicit nonzero width and
  height, and no sponsor anchors while all URLs are null.
- Assert the data inventory contains exactly five unique sponsors in
  alphabetical order, every referenced light/dark asset exists, every light
  asset is transparent, and no URL or tier value is present.
- Inspect the built CSS/HTML and responsive rules for two phone columns, three
  intermediate columns, five desktop columns, equal cells, contained logos,
  and no horizontal-overflow trigger. Inspect representative desktop and phone
  output visually if a local browser renderer is available.
- Run `git diff --check`; compare actual paths with this plan; inspect the full
  diff and affected shared-layout path; then run the final staged
  `pre-commit run --all-files`.

## Risks and decisions

- The merged artwork is explicitly documented in
  `src/assets/sponsors/README.md` as maintainer-authorized local derivatives,
  not sponsor-supplied variants. #181 owns eventual sponsor-approved
  replacements for Hollybush and On the River; this issue consumes the current
  accepted files without altering them.
- Identical CSS boxes plus #170's trimmed assets provide equal prominence while
  preserving natural logo aspect ratios. Sponsor-specific scale overrides
  would create an implicit ranking and are out of scope.
- D&C is unusually wide. Two phone columns leave less visual height, so the
  implementation must use the full cell width, avoid horizontal padding that
  needlessly shrinks it, and verify the high-resolution source remains readable
  in a phone-width render or deterministic layout inspection.
- The conditional URL branch is included for #171, but no URL is guessed or
  linked now. #172 can extend the data objects with optional descriptions.
- The footer is shared through `BaseLayout.astro`, and all six HTML pages use
  that layout. The `.ics` endpoint is not an HTML page and has no footer.
- No deployment is authorized by this workflow.

## Issue traceability

| Issue item | Disposition | Timing / owner / prerequisite | Evidence target |
| --- | --- | --- | --- |
| Sponsor logos on every page above existing footer content | Implement in this PR | Pre-merge / Codex / shared `Footer` | Built-page inventory finds one band on all six HTML pages |
| Legible without boxes, recolouring, or inversion | Implement using #170 output | Pre-merge / Codex / merged light variants | Transparent-asset checks and black-footer inspection |
| Optical balance and graceful wrapping | Implement and validate | Pre-merge / Codex | Shared image rule, natural aspect ratio, responsive grid |
| Equal prominence, no tiers or ranking | Implement in this PR | Pre-merge / Codex | Equal cells; alphabetical data; no tier field or per-sponsor CSS |
| Two phone columns without illegible shrink or footer overflow | Implement and validate | Pre-merge / Codex | Phone rule and built layout inspection |
| Visible heading and labelled section | Implement in this PR | Pre-merge / Codex | `aria-labelledby` references visible “Our sponsors” heading |
| Meaningful logo alternatives | Implement in this PR | Pre-merge / Codex | Every image alt equals the sponsor display name |
| Links after #171; plain images until then | Implement conditional behavior; current plain state | Pre-merge / Codex / #171 remains open | Null URLs, no sponsor anchors, prepared `noopener sponsored` branch |
| Lazy images with explicit dimensions and no CLS | Implement in this PR | Pre-merge / Codex / Astro image metadata | Built image attributes and layout dimensions |
| Shared data reused by `/fundraising/` | Prepare shared data; page use out of scope | Issue #172 | Both variants exported; no fundraising-page change |
| Keep the footer black | Implement without colour change | Pre-merge / Codex | Existing footer background retained |
| Artwork variants | Validated without change | #170 closed via merged PR #176 | Ten accepted transparent variants already on `main` |
| Confirm sponsor URLs and descriptions | Intentionally out of scope | Issue #171 | No guessed URL or description |
| Replace two derived variants later | Intentionally out of scope | Issue #181 | No artwork mutation in this PR |
| Build, check, and pre-commit | Validate before handoff | Pre-merge / Codex | Commands exit 0 on final staged snapshot |

## Research validation

Approved after one review. The plan uses the repository's merged artwork and
shared-layout boundary, keeps unconfirmed links absent, avoids retaining private
tier metadata, gives future consumers both image polarities, and defines
built-output checks that prove coverage across every HTML route rather than
assuming a shared component is sufficient.

## Implementation review

Implementation completed and reviewed on 2026-09-15. The live issue was
re-fetched after implementation with the same body hash and no comments. #170
is closed; #171, #172, and #181 remain open with their documented ownership.

- The planned and actual path sets contain the same four files. No artwork,
  page, dependency, workflow, or global-style file changed.
- The data module contains five unique sponsors in alphabetical order, imports
  both accepted variants, gives every entry a null URL, and stores no tier.
- Every accepted light asset independently reports alpha range 0..1. The band
  uses the same cell and image rules for all entries, with no sponsor-specific
  selector or scale override.
- Built-output validation covered all six HTML routes. Each contains exactly
  one labelled “Our sponsors” section and five ordered images with meaningful
  alternatives, lazy loading, asynchronous decoding, and explicit nonzero
  dimensions. No sponsor anchor renders while URLs are null.
- The generated CSS and source contain the planned two-, three-, and five-column
  layouts, `minmax(0, 1fr)` tracks, and `object-fit: contain`.
- Deterministic 360px phone and 1152px desktop composites were inspected using
  the same cell widths and 64px image constraint. All five logos remain legible
  and unboxed; the phone mock retains the existing footer content beneath the
  three-row band. No browser renderer was available, so the built DOM/CSS
  assertions and bounded composites are the local layout evidence.
- `npm ci`, `npm run check`, `npm run build`, `npm audit --omit=dev`, and
  `git diff --check` pass. Astro checked 22 files without diagnostics, built six
  HTML pages plus the calendar endpoint, and optimized all five light assets;
  npm reported zero vulnerabilities.
- The branch is code-relevant. The named `differential-review` skill is not
  available in this session, so the concrete manual fallback inspected the full
  component/data diff, `Footer`/`BaseLayout` callers, all generated routes,
  accessibility and image attributes, responsive CSS, conditional link
  behavior, asset polarity, data ordering, and related-issue boundaries. No
  blocking or non-blocking findings remain.

Two temporary visual-harness problems were corrected and excluded from product
evidence. The first ImageMagick preview command exited 1 because Fontconfig had
no default font; the rerun used the explicit local Helvetica Neue file. Its
first composite then revealed that `gravity: north` was still affecting image
coordinates; setting `gravity: northwest` before placement produced the two
reviewed mocks. Neither attempt changed repository files.

The first optimized-output alpha sweep exited 1 after finding ten transparent
files because Astro retains both copied sources and optimized derivatives; its
five-file glob assumption was a harness/setup error. A corrected HTML-selected
loop then exited 127 because the loop variable `path` overwrote zsh's special
command-path array. Renaming it to `asset_path` produced the final trustworthy
result: the exact five image URLs emitted by the page exist and each retains
alpha range 0..1.
