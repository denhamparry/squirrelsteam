---
status: Complete
issue: 202
issue_url: https://github.com/denhamparry/squirrelsteam/issues/202
branch: denhamparry.co.uk/feat/gh-issue-202
deploy: no
---

# Plan: Create the YouTube channel banner

## Problem and outcome

Create an upload-ready 2560x1440 YouTube banner for the public
[@RhiwbinaSquirrels1415](https://www.youtube.com/@RhiwbinaSquirrels1415)
channel. Keep the club identity, tier labels, and all six sponsor marks inside
YouTube's centred 1544x422 safe area while leaving the remainder of the canvas
as the club's `#1a1a1a` background. The editable SVG will link the existing
approved squirrel and `-light` sponsor artwork; text will be converted to
outlines so the output has no installed-font dependency.

Issue #202 and its empty discussion were fetched at
2026-09-16T15:28:00+01:00. Its blocker #197 is complete through merged pull
request #199. The related channel images from #201 are present on `main`
through merged PR #205. The repository deliverables can close #202; uploading
and checking the banner in YouTube remains an explicitly non-blocking
channel-admin action after merge.

## Implementation

1. Compose `youtube-banner.svg` on a 2560x1440 `#1a1a1a` canvas with all
   non-background artwork inside x=508..2052 and y=509..931. Use named groups
   for the club identity, tier labels, and every sponsor.
2. Place the linked white squirrel and outlined `Rhiwbina Squirrels #1415`
   wordmark in the left portion. Place four equal primary slots in canonical
   alphabetical order across the upper-right and two equal, visibly smaller
   secondary slots below, using the exact `-light` assets and ordering exposed
   by `src/data/sponsors.ts`.
3. Export an opaque 2560x1440 PNG deterministically with ImageMagick 7.1.2-31,
   using an explicit linked-asset composition rather than relying on the local
   SVG delegate. Add a comment beside the sponsor source of truth naming all
   three generated sponsor images.
4. Extend `docs/youtube.md` with banner requirements, safe-area and slot
   geometry, sources, the exact export recipe, regeneration rules, and visual
   validation at mobile, desktop-band, and TV sizes.

## Files expected to change

- `src/assets/logo/youtube-banner.svg`
- `src/assets/logo/youtube-banner.png`
- `src/data/sponsors.ts`
- `docs/youtube.md`
- `docs/plan/issues/202_create_youtube_channel_banner.md`

Sponsor tier data, sponsor artwork, other YouTube images, channel privacy,
video content, live YouTube settings, deployment, merge, and issue closure are
out of scope.

## Validation

- Baseline the absence of both banner files and prove a deliberately misplaced
  foreground pixel fails the safe-area mask used for the final asset.
- Parse the SVG; require the exact canvas, opaque background, named groups,
  outlined text, seven relative image links, and successful resolution of
  every link. Reject live `<text>`, embedded data, and non-light sponsor paths.
- Inspect the PNG with ImageMagick and `file`; require exactly 2560x1440, RGB
  without alpha, and fewer than 6,000,000 bytes.
- Compare the PNG with `#1a1a1a`; require all differing pixels to stay inside
  the centred 1544x422 safe area. Verify the SVG and PNG sponsor tier/order
  against `src/data/sponsors.ts` rather than a separately maintained expected
  roster.
- Measure slot geometry and rendered visible bounds to prove primary slots and
  marks are larger than secondary ones. Crop the safe area to 390px wide and
  visually inspect the wordmark, both labels, all primary marks, and both
  distinguishable secondary marks.
- Inspect a centred 2560x423 desktop band and full-canvas TV view for clipping
  and intentional composition. Regenerate the PNG from the documented recipe
  and require zero differing pixels.
- Audit the complete SVG, PNG, and documentation for excluded prices, package
  names, kit placements, player images, and personal information.
- Run `npm ci`, `npm run check`, `npm run build`, `npm audit --omit=dev`,
  `git diff --check`, targeted pre-commit hooks, and the final staged
  `pre-commit run --all-files` gate.

## Risks and research validation

- **Observed:** `src/data/sponsors.ts` provides the tier labels and sorted
  canonical order: Cornerstone Finance Group, Hollybush Properties Ltd,
  Imperial, and On the River as primary; D&C Plastering and EST Group as
  secondary. Each entry imports a `logoLight` variant intended for dark
  surfaces.
- **Observed:** the repository already contains the approved linked squirrel
  source and all six light sponsor variants. Their aspect ratios vary widely,
  so each mark needs optical sizing within a consistent tier slot rather than
  one uniform image rectangle.
- **Documented:** issue #202 records the maintainer's YouTube Studio dimensions
  and safe-area geometry, plus the official channel-branding guidance. The
  1544x422 safe area at 2560x1440 is therefore the controlling crop boundary.
- Text legibility is the tightest constraint. The mobile preview and measured
  raster bounds will decide the final division between the club identity and
  sponsor area; no sponsor or label may be removed to gain space.
- Linked SVG rendering can vary by delegate. The documented export will use
  explicit ImageMagick layer placement from the same linked files, pinned font
  provenance for path generation, fixed dimensions, bit depth, colour type,
  and metadata stripping.

Research review approved after one iteration. The design follows the merged
tier source of truth, uses the established dark-surface artwork, keeps every
crop-critical element in the official safe area, and limits the change to the
requested asset/documentation surfaces. The analogous-pattern sweep covered
the Veo cover, Veo lower banner, profile picture, watermark, sponsor source
data, and sponsor provenance documentation; these are intentional consumers or
source assets, not duplicate YouTube banners.

## Implementation validation

- The SVG parses as a 2560x1440 canvas, contains named club, label, and sponsor
  groups, has no live `<text>` or embedded data, and links exactly the approved
  squirrel plus all six `-light` sponsor assets. All seven relative links
  resolve.
- A comparison derived the expected tier membership and alphabetical order
  from `src/data/sponsors.ts`; both SVG groups match. Primary slots are
  270x158 versus 210x96 secondary slots, and the smallest primary image area
  remains larger than the largest secondary image area.
- The PNG is an opaque 8-bit RGB 2560x1440 image of 125,047 bytes. Its complete
  foreground bounds are 1396x341 at +533+536, wholly inside x=508..2052 and
  y=509..931. A fixture with one white pixel at 0,0 was rejected by the same
  safe-area check, proving the failure path.
- The centred safe area was inspected at 390px wide: the wordmark and tier
  labels read, every primary logo is recognisable, and both secondary logos
  remain distinguishable. The centred 2560x423 desktop band and full 16:9 TV
  canvas have no clipping and retain intentional background space.
- A fresh ImageMagick 7.1.2-31 export from the documented command differs from
  the committed PNG by zero pixels. The complete assets and docs contain no
  prices, package names, kit placements, player imagery, or personal data.
- `npm ci` installed 267 locked packages with zero vulnerabilities;
  `npm run check` passed 23 files with zero diagnostics; `npm run build` built
  all six pages; `npm audit --omit=dev` found zero vulnerabilities; and
  `git diff --check` passed.
- The targeted pre-commit run initially added the generated SVG's terminal
  newline and identified a wrapped `#199` Markdown line as a heading. After
  correcting both formatting issues, the same targeted hook run and the final
  staged all-files gate passed.
- Two local artifact-validator attempts stopped with harness/setup failures:
  zsh did not split a four-field bounds string using implicit word splitting,
  and ImageMagick reported a zero AE metric as `0 (0)` rather than `0`. The
  corrected validator uses `read` and accepts both documented zero formats;
  every product assertion then passed.

## Branch review

**Classification:** code-relevant only because `src/data/sponsors.ts` gains a
comment; otherwise non-code visual assets and documentation, standard risk.
The repository has no `docs/pre-pr-branch-review.md`. `differential-review`
and specialist Trail of Bits skills are unavailable in this session, so the
manual fallback inspected the complete diff, the full generated SVG, the PNG,
the source-data consumer, and the existing YouTube documentation. The affected
TypeScript behavior is unchanged, and Astro check/build cover its consumers.

The review checked issue coverage, exact safe-area bounds, raster format and
size, linked-source resolution, outlined text, data-derived tier/order,
primary/secondary hierarchy, mobile and desktop legibility, TV composition,
recipe reproducibility, regeneration guidance, excluded content, and
post-merge operator boundaries. The final analogous-pattern sweep covered the
Veo cover and lower banner, YouTube profile and watermark, sponsor data and
artwork, and all references to the three generated sponsor assets. No blocking
finding or non-blocking follow-up idea remains.

## Issue traceability

| Issue item | Disposition | Timing / owner / prerequisite | Evidence target | Current result |
| --- | --- | --- | --- | --- |
| 2560x1440 opaque PNG under 6 MB | Implement in this PR | Pre-merge / Codex | Image metadata and byte size | Passed: 125,047-byte RGB PNG |
| Every non-background pixel inside x=508..2052, y=509..931 | Implement and validate | Pre-merge / Codex | Safe-area pixel-mask assertion | Passed: 1396x341 at +533+536 |
| Squirrel plus `Rhiwbina Squirrels #1415` | Implement in this PR | Pre-merge / Codex | SVG structure and mobile preview | Passed |
| Labelled primary then secondary groups | Implement in this PR | Pre-merge / Codex | Named groups and rendered preview | Passed |
| Tiers and alphabetical order match sponsor data | Implement and validate | Pre-merge / Codex / merged #197 | Data-to-SVG comparison | Passed from live data source |
| Primary slots visibly larger than secondary slots | Implement and validate | Pre-merge / Codex | Slot and visible-bound measurements | Passed |
| All sponsor images use linked `-light` variants | Implement and validate | Pre-merge / Codex | Link audit | Passed |
| 390px safe-area crop remains legible | Implement and validate | Pre-merge / Codex | Mobile preview inspection | Passed |
| Desktop band and TV canvas look intentional | Implement and validate | Pre-merge / Codex | Two crop previews | Passed |
| SVG parses and all seven linked images resolve | Implement and validate | Pre-merge / Codex | XML and filesystem assertions | Passed |
| Documented recipe reproduces PNG | Implement and validate | Pre-merge / Codex / ImageMagick 7.1.2-31 | Zero-difference rerender | Passed: zero pixels differ |
| YouTube documentation covers requirements, geometry, sources, recipe, regeneration | Implement in this PR | Pre-merge / Codex | Complete-file documentation review | Passed |
| Sponsor-data comment lists all three generated assets | Implement in this PR | Pre-merge / Codex | Source review | Passed |
| No excluded commercial, player, or personal content | Validate in this PR | Pre-merge / Codex | Complete asset/content review | Passed |
| Pre-commit hooks and repository gates pass | Validate in this PR | Pre-merge / Codex/GitHub | Local commands and PR checks | Local gates and final staged hooks passed; PR CI pending |
| Admin uploads banner and checks desktop, phone, and TV | Intentionally deferred, non-blocking | Post-merge / channel admin | YouTube Studio and live channel surfaces | Not performed |
| Restricted viewing and channel setup | Intentionally out of scope | Issue #200 / channel admin | Separate issue | Not performed |
