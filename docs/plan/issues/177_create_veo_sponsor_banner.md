---
status: Complete
issue: 177
issue_url: https://github.com/denhamparry/squirrelsteam/issues/177
branch: denhamparry.co.uk/feat/gh-issue-177
deploy: no
outcome: implementation complete / operational validation pending
---

# Plan: Create the Veo sponsor banner candidate

## Problem and outcome

Produce a layered 8:1 sponsor-banner source and a standalone PNG candidate for
Veo Live's Lower Banner slot. The banner must contain all five sponsors at
equal prominence without recolouring or inverting their supplied artwork.

Issue #177 and its empty discussion were fetched on 2026-09-15 at
18:02:07 +0100. The issue's dependency PR #176 remains open at
`f33737332e91f9fb4f86d12076773339d56c8b84`; its review disputes locally
recoloured variants but explicitly supports retaining the supplied source
files. This plan therefore uses only those normalized sources and gives each
logo a native-polarity tile rather than consuming the disputed variants.

The repository can prove the file and design requirements before merge. Veo
ingest behaviour, plan entitlement, recommended pixel dimensions, and
legibility over real bright/floodlit footage require an authorized Clubhouse
operator. The outcome is therefore **implementation complete / operational
validation pending**, and the PR must use `Refs #177`.

## Design and implementation

1. Preserve the five normalized source assets from the exact PR #176 head
   under `src/assets/sponsors/source/`; this makes the layered source
   self-contained even while #170 remains unmerged.
2. Create `veo-lower-banner.svg` as a 2400x300 layered, editable SVG with one
   named group and equal-width cell per sponsor. Use nested viewBoxes to crop
   supplied dead padding non-destructively.
3. Use the supplied ordering: Imperial, Hollybush Properties, D&C Plastering,
   Cornerstone Finance Group, On the River. Give every sponsor the same cell
   area, then optically balance the artwork within each cell.
4. Preserve supplied artwork pixels/paths. Imperial, Hollybush, and Cornerstone
   sit on light tiles; D&C and On the River sit on dark tiles matching their
   supplied polarity. Transparent gutters expose alpha without placing a logo
   directly over footage. Omit extra club or “Our sponsors” copy to protect the
   available logo area.
5. Export the same crops, dimensions, and coordinates through deterministic
   ImageMagick composition to a 2400x300 PNG-24 with alpha. This local
   ImageMagick SVG delegate omits externally linked images, so it is not the
   authoritative renderer for the linked layered SVG. Record that limitation,
   the exact recipe, Veo slot, provisional dimensions, source SHA, official
   documentation findings, and operator checklist in `docs/veo-overlays.md`.

## Files expected to change

- `docs/plan/issues/177_create_veo_sponsor_banner.md`
- `docs/veo-overlays.md`
- `src/assets/sponsors/source/imperial.svg`
- `src/assets/sponsors/source/hollybush-properties.png`
- `src/assets/sponsors/source/dc-plastering.png`
- `src/assets/sponsors/source/cornerstone-finance-group.svg`
- `src/assets/sponsors/source/on-the-river.jpeg`
- `src/assets/sponsors/veo-lower-banner.svg`
- `src/assets/sponsors/veo-lower-banner.png`

No website component, page, sponsor URL, 1:1 upper-right graphic, deployment,
Veo upload, overlay activation, sponsor outreach, or issue closure is in scope.

## Validation

- Parse the layered SVG as XML; verify its 2400x300 viewBox, five named sponsor
  groups, five equal 456px tile rectangles, external source references, and
  absence of filters or colour transformations.
- Verify the PNG is exactly 2400x300, PNG with alpha, 8:1, below 10,000,000
  bytes, and contains transparent pixels in the intentional gutters.
- Hash all five normalized sources against the captured dependency inputs and
  confirm the export changes only layout/cropping, not sponsor artwork.
- Render the banner at full size and at representative downscaled widths on a
  bright pitch, dark pitch, and neutral checkerboard mock; inspect logo
  identity, legibility, optical balance, clipping, seams, and alpha edges.
- Run `xmllint --noout`, `git diff --check`, exact path-scope assertions,
  `npm run check`, `npm run build`, `npm audit --omit=dev`, and staged
  `pre-commit run --all-files`. The Astro commands require `npm ci` in the
  isolated worktree and no service or generated-artifact prerequisite.

## Evidence and risks

- **Documented:** Veo's official overlay guide, updated 2026-08-28, recommends
  clear high-resolution PNGs; requires an active Veo Live add-on and Admin
  access to create a package; allows Admins/Editors to toggle Lower Banner; and
  says enabled overlays are shown live and retained in the on-demand version of
  the livestream. Source: [Veo's image overlays guide](https://support.veo.com/hc/en-us/articles/17712585052177-How-to-add-and-manage-image-overlays-in-Veo-Live).
- **Observed:** the guide's current “Add overlays images” attachment displays
  `.jpg`/`.png`, 8:1, and 10MB for Lower Banner, but no pixel dimensions.
  Attachment retrieved 2026-09-15: [Veo's Add overlays images screenshot](https://support.veo.com/hc/article_attachments/27916729882897).
- **Inferred:** 2400x300 is a conservative working size from the issue, not a
  Veo recommendation. An operator or Veo Support must confirm or replace it.
- Veo may flatten alpha or scale/crop differently from local previews. The
  candidate must not be described as production-validated before a real-stream
  trial.
- The supplied Imperial SVG contains live Avenir text and the D&C artwork has a
  shadow. The candidate preserves them rather than inventing replacements;
  sponsor-approved source updates remain owned by #170.
- PR #176 can change before merge. Before handoff, bind and recheck the copied
  sources against its captured head; later source changes require regeneration.

## Research validation

Approved after one revision. A temporary prototype proved the native-polarity
tile layout at full 2400x300 resolution: five equal 456x252 cells fit with
transparent 12px gutters; the supplied horizontal and square lockups remain
legible without colour changes; and the generated PNG is about 170KB. A direct
ImageMagick probe also proved the plausible wrong export path fails: its SVG
delegate renders the tile rectangles but silently omits all five external
images. The plan now requires direct compositing for the PNG and treats the SVG
as an editor/browser source rather than claiming the unsupported delegate is a
valid exporter.

## Issue traceability

| Issue item | Disposition | Timing / owner / prerequisite | Evidence or current result |
| --- | --- | --- | --- |
| PNG at 8:1, under 10MB, with all five sponsors | Implement in this PR | Pre-merge / Codex / source files | Exact image metadata and sponsor-group inventory |
| No logo recoloured or inverted | Implement in this PR | Pre-merge / Codex / normalized supplied sources | Native-polarity light/dark tiles; no SVG colour transforms |
| Equal prominence and optical balance | Implement and validate locally | Pre-merge / Codex / full and downscaled renders | Equal cells plus documented visual inspection |
| Layered editable source committed | Implement in this PR | Pre-merge / Codex | Named SVG groups and replaceable external image references |
| Export committed and Veo slot recorded | Implement in this PR | Pre-merge / Codex | PNG plus `docs/veo-overlays.md` |
| Compare fully transparent and light translucent approaches | Not applicable to the final candidate | Pre-merge / Codex / disputed artwork variants | Direct-to-footage artwork would knowingly weaken contrast; transparent gutters still expose alpha behaviour while native-polarity tiles protect every logo |
| Exact recommended dimensions | External/operator pending | External / Clubhouse Admin or Veo Support | Official public guidance has no dimensions; confirm 2400x300 |
| Veo honours PNG alpha | External/operator pending | External / Clubhouse Admin / authorized test livestream | Observe intentional transparent gutters after ingest |
| Legible over bright sun and floodlights | External/operator pending | External / stream operator / representative livestreams | Watch live and on-demand output at actual viewer size |
| Overlay placement and rendered size | External/operator pending | External / stream operator / test livestream | Capture player screenshot and effective scale |
| Toggle behaviour and live/on-demand scope | Validated from official docs; operational check pending | Pre-merge documentation plus external operator | Producer Panel toggles Lower Banner; enabled overlay persists to livestream VOD |
| Feature included in current Veo plan | External/operator pending | External / Clubhouse Admin / account access | Confirm active Veo Live add-on and Overlay tab availability |
| Do not upload until artwork is agreed | Intentionally deferred | External / maintainer and sponsors / #170 resolution | Candidate only; no upload or activation in this workflow |
| Upper Right Image | Intentionally out of scope | Issue #178 | No 1:1 asset in this PR |
| Footer, URLs, and fundraising consumers | Intentionally out of scope | Issues #169, #171, #172 | No website consumer changes |

## Implementation review

Implementation completed and reviewed on 2026-09-15. The live issue was
re-fetched after implementation (body SHA-256
`751384d30d5fd531355129150b6b1a1b25e9266030712b67e92dadd1a582756f`)
and still had no comments. PR #176 remained open at the captured source SHA.

- The planned and actual path sets contain the same nine files.
- `veo-lower-banner.svg` parses as XML and contains five named sponsor groups,
  five equal 456x252 tiles, five valid source references, and no filter or
  colour transformation.
- `veo-lower-banner.png` is 2400x300 (8:1), 165,970 bytes, RGBA, and has both
  fully transparent gutters and fully opaque tile pixels.
- All five normalized source hashes match the captured dependency inputs.
- Full-size and 960x120 renders were inspected. A 1440x180 render composited on
  synthetic bright and floodlit 1920x1080 pitch backgrounds kept all five marks
  distinguishable; this is local design evidence, not real-Veo acceptance.
- `npm run check`: 20 files, zero errors, warnings, or hints.
- `npm run build`: six static pages built successfully.
- `npm audit --omit=dev`: zero vulnerabilities.
- `git diff --check` and the exact path-scope assertion pass.
- Both changed Markdown files contain zero executable shell fences.
- The first staged `pre-commit run --all-files` exited 1 because Markdownlint
  rejected four bare URLs in the two changed Markdown files. This documentation
  assertion was corrected by using descriptive links; the complete staged hook
  set passed on rerun.
- Trail of Bits review skills were skipped because all changes are
  documentation or inert image/vector assets. Manual review covered issue
  traceability, source fidelity, crop coordinates, equal tile areas, optical
  balance, linked-source portability, export metadata, and authorization
  boundaries; no follow-up ideas were found.

The first structural-validator attempt exited 1 because its ImageMagick alpha
sample used invalid `a.p{x,y}` syntax. This was a harness/setup failure; the
corrected `p{x,y}.a` form passed at all six gutter points. Real-stream alpha,
scale, bright/floodlit legibility, entitlement, and pixel-size checks remain
explicitly pending with the Clubhouse operator, so this plan does not claim
operational completion.
