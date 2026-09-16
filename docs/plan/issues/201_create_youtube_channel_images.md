---
status: Complete
issue: 201
issue_url: https://github.com/denhamparry/squirrelsteam/issues/201
branch: denhamparry.co.uk/feat/gh-issue-201
deploy: no
---

# Plan: Create YouTube channel images

## Problem and outcome

Create upload-ready profile-picture and video-watermark PNGs for the Rhiwbina
Squirrels 1415 YouTube channel, with adjacent editable SVG sources and a
deterministic export recipe. Reuse the approved Veo crest and upper-right mark
without redrawing the squirrel, adding text, or introducing sponsor artwork.

Issue #201 and its empty discussion were fetched at 2026-09-16T14:19:00+01:00.
Related setup issue #200 remains open and `docs/youtube.md` is absent, so this
change will create that file with only the requested `Channel images` section.
The repository deliverables can close #201; uploading and checking them in
YouTube remains a non-blocking channel-admin action after merge.

## Implementation

1. Add an 800x800 profile SVG with a solid `#1a1a1a` background and a linked
   `veo-upper-right-mark.svg` filling the same square composition as the
   approved Veo crest. Export the opaque PNG by resizing `veo-crest.png` to
   800x800 with ImageMagick 7.1.2-31.
2. Add a 150x150 transparent watermark SVG that links the same approved mark.
   Export its PNG by proportionally resizing `veo-upper-right-mark.png`; its
   existing clear space and 45%-black keyline remain intact.
3. Create `docs/youtube.md` with a `Channel images` section covering the
   screenshot's stricter profile contract, YouTube's official guidance, source
   provenance, exact export recipe, small-size/contrast checks, and the
   non-blocking operator upload.

## Files expected to change

- `src/assets/logo/youtube-profile.svg`
- `src/assets/logo/youtube-profile.png`
- `src/assets/logo/youtube-watermark.svg`
- `src/assets/logo/youtube-watermark.png`
- `docs/youtube.md`
- `docs/plan/issues/201_create_youtube_channel_images.md`

The source squirrel/Veo artwork, website UI, YouTube banner, channel privacy
configuration, video/player imagery, sponsor assets, live YouTube settings,
deployment, merge, and issue closure are out of scope.

## Validation

- Confirm the four target assets are absent before implementation and the two
  approved raster inputs match the recorded SHA-256 values.
- Parse both SVGs; require exact square canvases, one linked existing artwork
  reference apiece, no path elements, and no text or sponsor references.
- Inspect both PNGs with ImageMagick and `file`: require an opaque 800x800 PNG
  under 4 MB and an RGBA 150x150 PNG under 1 MB.
- Compare the profile against `#1a1a1a`; require every differing pixel to fall
  inside the circle inscribed in the 800x800 square. Inspect circular 98px and
  40px renders on `#ffffff` and `#0f0f0f` backgrounds.
- Require transparent watermark clear space on all four sides, then inspect it
  at native size over synthetic bright and dark frames.
- Regenerate both PNGs from the documented ImageMagick recipe and require zero
  differing pixels. Prove the check rejects swapped/wrong source inputs.
- Run `npm ci`, `npm run check`, `npm run build`, `npm audit --omit=dev`,
  `git diff --check`, and all pre-commit hooks.

## Risks and research validation

- **Observed:** the approved raster inputs are 1024x1024 and have SHA-256
  `7723e7756cd60f6506eb26bd064e39d73d42a1233e301d0b49e44af75d076d88`
  (`veo-crest.png`) and
  `f6a2394f9e641ef86740bf31d6fd1e0db33659fc6d620f3dd7d4a34bdbc34e55`
  (`veo-upper-right-mark.png`). A temporary exact-recipe probe produced an
  800x800 opaque 75,161-byte profile and a 150x150 RGBA 12,381-byte watermark.
- **Observed:** the proposed profile's non-background bounds are
  526x555+161+96 with zero pixels outside the inscribed circle. Circular 98px
  and 40px previews remain recognizable on both requested page backgrounds.
  The watermark alpha bounds are 103x108+28+16, leaving clear space on every
  edge; bright and dark synthetic composites preserve the silhouette.
- **Documented:** the maintainer's 2026-09-16 screenshot requires PNG/GIF and a
  4 MB profile limit. YouTube's official help page currently says profiles
  render at 98x98 and permits up to 15 MB, while video watermarks must be at
  least 150x150, square, and under 1 MB; watermarks do not appear on made-for-
  kids videos. The stricter screenshot profile rules govern this deliverable.
- Resampling can alter antialiasing and file bytes across tools. The docs pin
  ImageMagick 7.1.2-31, filter, dimensions, bit depth, PNG colour type, and
  metadata stripping; exact reproduction is verified locally.
- The 40px profile is a visual check below YouTube's documented 98px render and
  is intentionally conservative. Real YouTube rendering remains an operator
  check because this workflow does not authorize channel access or upload.

Research review approved after one iteration. The design uses established
source compositions, satisfies both square contexts without inventing artwork,
and keeps the open #200 documentation surface compatible by limiting the new
file to the requested section. The analogous-pattern sweep covered the Veo
crest, upper-right mark, site logo sources, and existing asset documentation;
no other YouTube image or competing source of truth exists.

## Implementation validation

- Both SVGs parse as XML, have the exact 800x800 and 150x150 canvases, and each
  contains one relative link to `veo-upper-right-mark.svg`. Neither contains a
  path or visible text element; the only text is non-rendered accessibility and
  provenance metadata.
- The profile PNG is 800x800 opaque RGB and 75,161 bytes. Its differing-pixel
  bounds against `#1a1a1a` are 526x555+161+96, and the inscribed-circle mask
  found zero non-background pixels outside the circle.
- The watermark PNG is 150x150 RGBA and 12,381 bytes. Its alpha range is 0..1
  and its 103x108+28+16 alpha bounds prove clear space remains on all sides.
- Circular 98px and 40px profile previews were inspected on both `#ffffff` and
  `#0f0f0f`; the squirrel remains recognizable. Native 150px watermark
  composites over synthetic pale-sky/sunlit-grass and floodlit-night gradients
  retain a distinct white silhouette and dark keyline.
- Fresh recipe exports differ from the committed PNGs by zero pixels. Swapping
  the two source inputs makes both comparisons exit 1 with non-zero absolute
  error, proving the validator rejects a plausible wrong-source export.
- `docs/youtube.md` records the screenshot's stricter profile contract,
  YouTube's help guidance, accepted formats, display behavior, source hashes,
  deterministic commands, visual checks, and post-merge operator boundary.
- `npm ci` installed 267 locked packages with zero vulnerabilities;
  `npm run check` passed 23 files with zero diagnostics; `npm run build` built
  all six pages; and `npm audit --omit=dev` found zero vulnerabilities.
- `git diff --check` and the targeted pre-commit run passed. The final staged
  all-files hook run remains the Phase 5 handoff gate; pull-request CI has no
  path filter and is expected to schedule check/build/audit.
- One local validation attempt used BSD-style `stat -f %z` against the
  available GNU-style tool and stopped with a harness/setup failure. The
  corrected regular-file size check used `wc -c`; every product assertion then
  passed. This was not an implementation failure.

## Branch review

**Classification:** non-code visual assets and documentation, standard risk.
The repository has no `docs/pre-pr-branch-review.md`; Trail of Bits review
skills were skipped because no code-relevant files changed. Manual review
covered the complete intended path set, issue and empty discussion, source
hashes, SVG structure and link resolution, raster metadata, circle/alpha
geometry, four small profile contexts, both watermark contrast contexts,
deterministic success and wrong-source rejection, documentation accuracy,
privacy/content exclusions, and operator boundaries. No blocking finding or
non-blocking follow-up idea remains.

The analogous-pattern sweep was repeated against the final assets. The Veo
crest and upper-right images are the intended shared primitives; the site marks
serve different contexts and remain unchanged. No other YouTube image exists.
The banner and restricted-viewing setup remain independently owned by #200.

## Issue traceability

| Issue item | Disposition | Timing / owner / prerequisite | Evidence target | Current result |
| --- | --- | --- | --- | --- |
| 800x800 opaque profile PNG under 4 MB | Implement in this PR | Pre-merge / Codex | Image metadata and size | Passed: 75,161-byte RGB PNG |
| Profile non-background pixels inside inscribed circle | Implement and validate | Pre-merge / Codex | Pixel mask assertion | Passed: zero outside pixels |
| Circular profile legible at 98px and 40px on both themes | Implement and validate | Pre-merge / Codex | Four rendered previews | Passed |
| 150x150 transparent watermark under 1 MB | Implement in this PR | Pre-merge / Codex | Image metadata, alpha, and size | Passed: 12,381-byte RGBA PNG |
| Watermark recognizable over bright and dark frames | Implement and validate | Pre-merge / Codex | Synthetic composites | Passed |
| SVGs parse and link existing artwork without redrawn paths | Implement in this PR | Pre-merge / Codex | XML/source audit | Passed |
| Documented recipes reproduce both PNGs | Implement and validate | Pre-merge / Codex / ImageMagick 7.1.2-31 | Zero-difference rerender plus wrong-source rejection | Passed |
| `Channel images` documentation with requirements, sources, recipe, checks | Implement in this PR | Pre-merge / Codex | Complete-file documentation review | Passed |
| No text, sponsors, player images, or personal information | Validate in this PR | Pre-merge / Codex | SVG/content/diff review | Passed |
| Pre-commit hooks and repository gates pass | Validate in this PR | Pre-merge / Codex/GitHub | Local commands and PR checks | Local gates passed; final staged hooks and PR CI pending |
| Admin uploads both images and checks YouTube themes/phone | Intentionally deferred, non-blocking | Post-merge / channel admin | YouTube Studio and live channel surfaces | Not performed |
| YouTube banner and restricted-viewing setup | Intentionally out of scope | Issue #200 / channel admin | Separate issue and future PR | Not performed |
