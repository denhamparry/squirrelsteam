---
status: Complete
issue: 224
issue_url: https://github.com/denhamparry/squirrelsteam/issues/224
branch: denhamparry.co.uk/feat/gh-issue-224
deploy: no
---

# Plan: Harden the playlist thumbnail generator

## Problem and outcome

`scripts/youtube-playlist-thumbnails.py` has three weaknesses:

- It interpolates `PLAYLISTS` names into SVG text and attributes without XML
  escaping.
- It accepts duplicate or malformed slugs, which silently overwrite files or
  produce odd filenames.
- It trusts hard-coded alpha bounds for `veo-upper-right-mark.png`.

All the current data is fine, so this is hardening only. The seven committed
thumbnails must stay byte-identical: the issue says six, but Training U11 was
added in #226.

## Implementation

All changes are in `scripts/youtube-playlist-thumbnails.py`:

1. **Escaping.** Add `xml_text(value)`: `xml.sax.saxutils.escape` with `"`
   mapped to `&quot;`. Use it for every interpolated name or label in
   `<title>`, `<desc>` and the `aria-label` attributes, all of which are
   double-quoted. The current names contain none of `&<>"`, so output is
   unchanged.
2. **Table validation.** Add `validate_playlists()`, called first in `main()`,
   before the font or renderer checks and before any write. It exits non-zero,
   naming the offending row, when:
   - a slug doesn't match `^[a-z0-9]+(?:-[a-z0-9]+)*$`, which is stricter than
     the issue's `^[a-z0-9-]+$` and also rejects leading, trailing or doubled
     hyphens;
   - a slug is duplicated;
   - a name is empty or only whitespace.
3. **Mark geometry check.** Add `check_mark_bounds()`, run before generating.
   It measures `veo-upper-right-mark.png` with
   `magick <png> -alpha extract -threshold 0 -format '%wx%h %@' info:` and
   exits non-zero unless the result equals the constants
   (`1024x1024 672x707+207+125`). Placement still comes from the constants,
   so a re-exported mark can't shift the layout silently.

   Deriving placement from the measurement was the alternative. It was
   rejected because it would change every thumbnail without any review of the
   safe zones. With the check, a new mark stops the script with a message
   saying which constants to update and that `docs/youtube.md` should be
   re-checked.
4. Update `docs/youtube.md` "Playlist thumbnails" in one short paragraph: the
   script now validates slugs and escapes names, and it checks the mark's
   measured bounds.

## Files expected to change

- `scripts/youtube-playlist-thumbnails.py`
- `docs/youtube.md`
- `docs/plan/issues/224_harden_playlist_thumbnail_generator.md`

## Validation

- **Reproduction:** record the SHA-256 of the 14 committed playlist
  SVGs/PNGs, run the documented recipe, and require identical hashes.
- **Escaping:** in a scratch copy of the repo (`scripts/` and
  `src/assets/logo/`), set a row to `Sevens & Tens <"A">`. Run the script and
  require `xmllint --noout` to pass on the new SVG, with the name
  round-tripping through the parser in `<title>` and `aria-label`.
- **Slug validation:** in scratch copies, try a duplicate slug, `Bad_Slug`,
  and `-lead`. Each must exit non-zero with a message and write no file
  (directory listing and mtimes unchanged).
- **Mark check:** in a scratch copy, replace the mark PNG with a padded
  version (`-bordercolor none -border 10`). The script must exit non-zero
  before writing.
- Pre-commit passes. `ruff check` passes on the script.

## Risks and research validation

- `xmllint` is present at `/usr/bin/xmllint`.
- The alpha-extract `%@` measurement returned `672x707+207+125` for the
  committed PNG in #221. That result is reproduced again during
  implementation.

## Review Summary

**Overall Assessment:** Approved (author re-verification, iteration 1/3; not
an independent review)

| Claim | Evidence | Result |
| --- | --- | --- |
| Measurement command output | `magick veo-upper-right-mark.png -alpha extract -threshold 0 -format '%wx%h %@' info:` on 2026-09-18 | `1024x1024 672x707+207+125` |
| `xmllint` available | `command -v xmllint` | `/usr/bin/xmllint` |
| Current names need no escaping | `PLAYLISTS` rows contain no `&<>"` | Output should be byte-identical |

## Implementation validation

Run on 2026-09-18 with ImageMagick 7.1.2-31 and librsvg 2.62.3. Each negative
test ran in its own scratch copy of `scripts/` and `src/assets/logo/`, and
confirmed that the mutation landed before running the script.

| Criterion | Evidence | Result |
| --- | --- | --- |
| Committed thumbnails unchanged | Recipe rerun: 14/14 playlist SVG/PNG SHA-256 values match; `name_size` still 110 | Pass |
| Special characters (`Sevens & Tens <"A">`) | Exit 0; `xmllint --noout` passes; the name round-trips through `<title>`, `aria-label` and the group label; PNG exported | Pass |
| Baseline for the same row | Unmodified script (`origin/main`): `xmllint` "xmlParseEntityRef: no name"; PNG export failed | Bug reproduced |
| Duplicate slug | Exit 1, "rows 6 and 7 share slug 'tour-u10'"; logo directory listing, mtimes and sizes unchanged | Pass |
| Malformed slugs `Bad_Slug`, `-lead`; blank name | Exit 1 with row-specific messages; no file written | Pass |
| Mark drift (PNG padded to 1044x1044) | Exit 1, "measures '1044x1044 672x707+217+135', expected '1024x1024 672x707+207+125'"; no file written | Pass |
| `ruff check` | ruff 0.13.0 | Pass |
