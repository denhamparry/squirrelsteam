---
status: Complete
issue: 226
issue_url: https://github.com/denhamparry/squirrelsteam/issues/226
branch: denhamparry.co.uk/feat/gh-issue-226
deploy: no
---

# Plan: Add a Training U11 playlist thumbnail

## Problem and outcome

Add a thumbnail for the new **Training U11** playlist (`#1415 Training U11`,
slug `training-u11`). It uses the generator merged in #222. Issue #226 was
fetched on 2026-09-18 with no comments. Its table still specifies the
unbracketed `Training U11`, which matches the existing naming. Uploading to
YouTube stays a non-blocking operator action after merge.

## Implementation

1. Add `("Training U11", "training-u11")` to `PLAYLISTS` in
   `scripts/youtube-playlist-thumbnails.py`, directly after `Training U12`.
2. Run the documented recipe in `docs/youtube.md` with the pinned Archivo font.
3. Update `docs/youtube.md`:
   - Add the `Training U11` row to the "Playlist files" table.
   - Change the type-size note: the widest name is now `Training U11`, not
     `Training U12` (see research below).
   - Replace the "six" counts in the playlist sections with wording that
     doesn't go stale when a playlist is added.
   - Change "If the new name is wider than `Training U12`" so it refers to the
     current widest name.

## Files expected to change

- `scripts/youtube-playlist-thumbnails.py`
- `src/assets/logo/youtube-playlist-training-u11.svg`
- `src/assets/logo/youtube-playlist-training-u11.png`
- `docs/youtube.md`
- `docs/plan/issues/226_add_training_u11_playlist_thumbnail.md`

The six existing playlist SVGs and PNGs must **not** change.

## Validation

- Before running, record the SHA-256 of the 12 existing playlist files. After
  running, require them to be identical, and require `git status` to show only
  the two new assets as untracked.
- The new PNG is exactly 1280x720, 8-bit RGB with no alpha, and under 2 MB.
- The new SVG's label paths read `#1415` and `Training U11`. It has one
  `<image href="veo-upper-right-mark.svg">` and no `<text>`.
- Safe zones: its visible bounds are inside x/y 64..1216/656, and there are 0
  non-background pixels in 320x144+960+576.
- Legibility: at 320px and 168px, on `#ffffff` and `#0f0f0f`, the name is
  readable and easy to tell apart from `Training U12` side by side.
- Pre-commit passes.

## Risks and research validation

- **Shared type size (verified 2026-09-18):** The generator sizes text by the
  widest name's *visible* right edge, not its advance width. Measured with the
  script's own `Face.bounds` at wght 800, per 1000 units:

  | Name | Right edge |
  | --- | --- |
  | `Training U12` | 6258.91 |
  | `Training U11` | 6265.74 |

  So `Training U11` becomes the widest name. The column is 1216 − 525 =
  691px. The size is `int(691000 / 6265.74)` = `int(110.28)` = **110**,
  unchanged from `int(110.40)`. The baselines depend only on the size, so the
  existing outputs should stay byte-identical. The issue's reasoning (equal
  advances) reaches the right result for a slightly different reason. The docs
  must name the new widest label. The size would drop to 109 only once a name
  is wider than 6281.8 units.
- **Toolchain:** The font in the scratchpad has SHA-256 `0e094a7d…`, matching
  the pinned hash. ImageMagick 7.1.2-31 with librsvg 2.62.3 was confirmed in
  the #221 run on the same machine today, and the script checks it again at
  run time.

## Review Summary

**Overall Assessment:** Approved (author re-verification, iteration 1/3; not
an independent review)

| Claim | Evidence | Result |
| --- | --- | --- |
| Name size stays 110px | Script's `Face.bounds` on the pinned font; computed `int(691000/6265.74)` | 110 |
| Font identity | `shasum -a 256` of the local font | Matches pin |
| Issue text unchanged | `gh issue view 226`: 0 comments, table row `#1415 Training U11` | Confirmed |

Required change during implementation: the docs must name `Training U11` as
the widest label.

## Implementation validation

Run on 2026-09-18 with the documented recipe (fresh `curl` of the pinned font).

| Criterion | Evidence | Result |
| --- | --- | --- |
| Existing thumbnails unchanged | 12/12 SHA-256 values match the pre-run record; script printed `name_size` 110 | Pass |
| New PNG format | `file`: 1280 x 720, 8-bit/color RGB; 65,790 bytes | Pass |
| New SVG | One `veo-upper-right-mark.svg` link, 0 `<text>`, labels `#1415` / `Training U11` | Pass |
| Safe zones | Visible bounds 1128x402+87+159 (right edge 1215 ≤ 1216); 0 badge-zone pixels | Pass |
| Legibility | 168px and 320px beside `Training U12` on `#ffffff` and `#0f0f0f` | Readable and distinct |
