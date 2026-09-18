---
status: Complete
issue: 221
issue_url: https://github.com/denhamparry/squirrelsteam/issues/221
branch: denhamparry.co.uk/feat/gh-issue-221
deploy: no
---

# Plan: Create YouTube playlist thumbnails

## Problem and outcome

Create six upload-ready 1280x720 playlist thumbnails for the
[@RhiwbinaSquirrels1415](https://www.youtube.com/@RhiwbinaSquirrels1415)
channel. Each one shows the linked white squirrel mark on the club's `#1a1a1a`
background, with `#1415` above the playlist name. A single generator produces
every variant from one table, so a future playlist needs only a new row.

Issue #221 was fetched on 2026-09-18. It has no discussion. The repository
deliverables can close it. Uploading to YouTube (including the suggested
private test upload) needs channel-admin access and stays a non-blocking
operator action after merge.

| Playlist | Text | Slug |
| --- | --- | --- |
| Games U11 | `#1415 Games U11` | `games-u11` |
| Games U12 | `#1415 Games U12` | `games-u12` |
| Cup U12 | `#1415 Cup U12` | `cup-u12` |
| Training U12 | `#1415 Training U12` | `training-u12` |
| Tour U10 | `#1415 Tour U10` | `tour-u10` |
| Tour U11 | `#1415 Tour U11` | `tour-u11` |

## Implementation

1. Add `scripts/youtube-playlist-thumbnails.py`, a self-contained `uv` script
   (PEP 723 metadata pinning `fonttools==4.60.1` and `uharfbuzz==0.51.1`).
   - It holds the playlist table above as its only per-variant input.
   - It takes the Archivo font path as an argument and refuses to run unless
     the file's SHA-256 is
     `0e094a7d3c7c4c25cf1310c4b30014f1dae9332220b1c2c88f4fa996f0b05053`, the
     same font recorded for the banner (#202).
   - It shapes text with HarfBuzz at `wdth` 100 and outlines the glyphs with
     fontTools pens. `#1415` uses weight 700 and the playlist name weight 800.
   - The name size is the largest that fits `Training U12` in the text column,
     and every variant uses that size and the same baselines. Coordinates are
     rounded to two decimals, so output is byte-stable.
   - It writes `src/assets/logo/youtube-playlist-<slug>.svg`. Each SVG has a
     `#1a1a1a` background, a linked `veo-upper-right-mark.svg` `<image>`, and
     outlined `<path>` text. There are no `<text>` elements.
   - It then exports each PNG with ImageMagick. First it checks for the pinned
     librsvg 2.62.3 delegate. Then it follows the banner method (#202/#207):
     render the SVG without its `<image>` element through `rsvg:`, and
     composite `veo-upper-right-mark.png` at the recorded geometry. The output
     flags are `-alpha off -depth 8 -define png:color-type=2 -strip`.
2. Geometry on the 1280x720 canvas:
   - The squirrel's visible bounds sit inside the 64px safe margin on the left,
     vertically centred on y=360.
   - The two text lines sit to the right of the mark, left-aligned in one
     column that ends at x<=1216.
   - Nothing visible falls inside the bottom-right badge zone
     (x>=960, y>=576) or within 64px of any edge.
3. Add a "Playlist thumbnails" subsection under "Channel images" in
   `docs/youtube.md`. It covers:
   - the upload contract, with the help links and the test-upload status;
   - the playlist-to-file table;
   - sources and composition (mark, font, geometry, safe zones);
   - the export recipe: font download and hash check, the delegate check, and
     one `uv run` command;
   - the small-size checks;
   - how to add a playlist.

## Files expected to change

- `scripts/youtube-playlist-thumbnails.py`
- `src/assets/logo/youtube-playlist-games-u11.svg`
- `src/assets/logo/youtube-playlist-games-u11.png`
- `src/assets/logo/youtube-playlist-games-u12.svg`
- `src/assets/logo/youtube-playlist-games-u12.png`
- `src/assets/logo/youtube-playlist-cup-u12.svg`
- `src/assets/logo/youtube-playlist-cup-u12.png`
- `src/assets/logo/youtube-playlist-training-u12.svg`
- `src/assets/logo/youtube-playlist-training-u12.png`
- `src/assets/logo/youtube-playlist-tour-u10.svg`
- `src/assets/logo/youtube-playlist-tour-u10.png`
- `src/assets/logo/youtube-playlist-tour-u11.svg`
- `src/assets/logo/youtube-playlist-tour-u11.png`
- `docs/youtube.md`
- `docs/plan/issues/221_create_youtube_playlist_thumbnails.md`

Out of scope: the source squirrel artwork, the existing channel images, the
website UI, live YouTube settings, the upload itself, deployment, and merge.

## Validation

- `magick identify` on every PNG: exactly 1280x720 PNG, and `file` reports RGB
  with no alpha. Every file is under 1,000 KB, which also satisfies the repo's
  `check-added-large-files` limit and YouTube's 2 MB mobile limit.
- Parse every SVG with Python's `xml.etree`. Each must have exactly one
  `<image href="veo-upper-right-mark.svg">`, no `<text>` element, and outlined
  label paths whose `aria-label` values match the table exactly.
- Compare each PNG against `#1a1a1a` and compute the bounding box of the
  differing pixels. It must lie within x 64..1216 and y 64..656. There must be
  zero differing pixels in x>=960, y>=576.
- Reproducibility: record the six PNG SHA-256 values, run the documented
  recipe again, and require identical SVG and PNG hashes (`git diff` empty).
- Legibility: build montages of all six at 320px and at 168px wide, on
  `#ffffff` and on `#0f0f0f`, then inspect them. The names must be readable and
  the six must be distinguishable at 168px.
- Run pre-commit on all files.

## Risks and research validation

- **Font provenance:** The banner doc links Archivo on the moving `main`
  branch. The last commit touching the file is
  `6c70c829f09ea345d3590406693220ea35c6553f` (2021-02-04). Its raw file was
  downloaded on 2026-09-18: 658,596 bytes, SHA-256 `0e094a7d…0b05053`, the same
  hash as the banner. The recipe pins this commit URL and checks the hash.
  (`xh` returned HTTP 403 from raw.githubusercontent.com, so the recipe uses
  `curl`.)
- **Tooling:** `uv run --with fonttools==4.60.1 --with uharfbuzz==0.51.1`
  installed both and shaped `Training U12` at wght 800. Its advance is
  6.306 em.
- **Renderer:** `magick -list format` on this machine shows ImageMagick
  7.1.2-31 with `RSVG* rw+ Librsvg SVG renderer (RSVG 2.62.3)`. That matches
  the #207 pin.
- **Mark geometry:** The alpha bounds of `veo-upper-right-mark.png` are
  672x707 at +207+125 of 1024 (SHA-256 `f6a2394f…4e55`, unchanged from the
  channel-images doc). The generator uses these ratios to place the visible
  squirrel.
- **Upload path:** The issue asks for a private test upload. That needs
  channel-admin access this workflow does not have. The doc will say the
  contract is based on YouTube's help pages and that the test upload is still
  pending. It will not claim a verified result.
- **Text size:** At 168px wide the scale is 0.131. A name about 118px tall
  gives caps about 10–11px high. The montage check confirms this is readable
  before merge.

## Review Summary

**Overall Assessment:** Approved (author re-verification, iteration 1/3; not
an independent review)

| Claim | Evidence | Result |
| --- | --- | --- |
| Archivo commit and hash | `gh api` commit listing; `curl` download, `shasum -a 256` | Matches banner hash |
| Shaping/outlining toolchain | `uv run --with` both pins; shaped `Training U12` | Works |
| Pinned renderer | `magick -version`; `magick -list format` RSVG row | 7.1.2-31 / 2.62.3 |
| Mark alpha bounds | `magick … -alpha extract -threshold 0 -format %@` | 672x707+207+125 |
| Size limit | `.pre-commit-config.yaml` `--maxkb=1000` | PNGs must be < 1,000 KB |

Required changes during implementation: none. The test upload stays an
operator action, and the doc must describe it as pending.

## Implementation validation

Run on 2026-09-18 with ImageMagick 7.1.2-31 and librsvg 2.62.3.

| Criterion | Evidence | Result |
| --- | --- | --- |
| Six PNGs, exactly 1280x720, no alpha, < 2 MB | `magick identify`; `file` reports `8-bit/color RGB`; 62,345–69,624 bytes | Pass |
| Text matches the table | `xml.etree`: label `aria-label`s are `#1415` plus the exact name | Pass |
| Safe zones | Visible bounds x=87..1214, y=159..561; 0 non-background pixels in 320x144+960+576 | Pass |
| Linked mark and outlined text | One `<image href="veo-upper-right-mark.svg">`, no `<text>`; WebKit (QuickLook) render shows the mark and text | Pass |
| Reproducible | The documented recipe with a fresh `curl` of the font: 12/12 SHA-256 values match the first run | Pass |
| Font guard | Script exits 1 with a clear error when given a font with the wrong hash | Pass |
| Legibility | 320px and 168px previews on `#ffffff` and `#0f0f0f`: names readable, six distinct | Pass |

Layout chosen: mark canvas 580px at (-29, 89). Text column at x=525.
`#1415` is 62px/700 on baseline 327, and the name is 110px/800 on baseline 436.
The test upload to YouTube is still pending. The doc says so and gives the
steps.
