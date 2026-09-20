---
status: In Progress
issue: 235
fetched_at: 2026-09-20
deploy: no
---

# Add QR code brand assets

Issue: [#235](https://github.com/denhamparry/squirrelsteam/issues/235)

## Problem and outcome

Provide print-ready, branded QR codes for the public club site and player area.
The committed PNGs must be reproducible locally and must reject a generated
file whose encoded payload cannot be decoded at the required scales.

## Implementation

1. Add `scripts/qr-codes.py`, with pinned inline Python dependencies. It will
   download the exact Archivo Bold font only when `--font` is not supplied,
   verify its SHA-256 before use, create all four images from the crest, and
   validate each output at 1x, 0.5x, and 0.25x (inverting light-on-dark images
   for the OpenCV check).
2. Commit the four generated PNGs in `src/assets/logo/` using the names in the
   issue. The generator will use H correction, a four-module quiet zone, an
   approximately 1200-pixel code, a 22%-width crest on a rounded background
   pad, and one Archivo Bold caption size based on the longer URL.
3. Add `docs/qr-codes.md` beside the existing image documentation. It will
   record the source URLs, layout, pinned font URL/checksum and SIL OFL 1.1
   licence source, regeneration command, dependencies, decoder behaviour, and
   required phone-scan check before print.

## Files expected to change

- `scripts/qr-codes.py`
- `src/assets/logo/qr-squirrels-team-black-on-white.png`
- `src/assets/logo/qr-squirrels-team-white-on-black.png`
- `src/assets/logo/qr-player-squirrels-team-black-on-white.png`
- `src/assets/logo/qr-player-squirrels-team-white-on-black.png`
- `docs/qr-codes.md`
- `docs/plan/issues/235_add_qr_code_brand_assets.md`

## Validation

- Run the generator twice in separate directories and compare SHA-256 values
  with the committed assets, proving byte-identical output.
- Let the generator's OpenCV checks exercise every payload, colour variant,
  and scale; run a deliberate wrong-payload decode assertion to prove the
  decoder test rejects an incorrect expected URL.
- Inspect output dimensions, colour mode, quiet-zone geometry, and the
  committed-image decoding results independently.
- Run `npm run check`, `npm run build`, `npm audit --omit=dev`, and
  `pre-commit run --all-files` once the focused generator checks pass.

## Risks and boundaries

- Inverted QR codes are intentionally less compatible with generic scanners;
  documentation must recommend black on white for general printing.
- Phone scans require physical iPhone and Android devices. They are an
  external/operator acceptance item and cannot be claimed from local OpenCV
  validation. The PR must use `Refs #235` until they are recorded.
- The font is downloaded from the documented Google-hosted URL, but its SHA-256
  is pinned. A supplied `--font` file is also checksum-validated; no font bytes
  are committed.

## Acceptance and traceability

Issue snapshot fetched 2026-09-20 from the issue body; there are no comments.

| Issue item | Disposition | Verification timing, owner, prerequisite, evidence, current result |
| --- | --- | --- |
| Four named PNGs encode the exact two URLs | Implement in this PR | Pre-merge; Codex; generator dependencies; generator and independent decoder at three scales; passed locally. |
| Deterministic generator fails when decoding fails | Implement in this PR | Pre-merge; Codex; Python dependencies; two-run digest comparison and deliberate wrong-payload negative check; passed locally. |
| Explicit font source and licence | Implement in this PR | Pre-merge; Codex; documented Google Fonts source; script checksum plus OFL URL in docs; passed locally. |
| H correction, four-module border, ~1200px code, crest/pad, single Archivo Bold caption | Implement in this PR | Pre-merge; Codex; source crest and font; code review plus image metadata/geometry inspection; passed locally. |
| Explain `qrcode[pil]` and `opencv-python-headless`, regeneration, and inverted-code caveat | Implement in this PR | Pre-merge; Codex; documentation; docs review; passed locally. |
| Scan all four files with iPhone and Android before print | External/operator | External/operator; club devices; camera scans; PR recording; operational validation pending. |
| General-print recommendation | Implement in this PR | Pre-merge; Codex; documentation; docs review; passed locally. |

## Research review

Reviewed 2026-09-20. The requested generator is a new, local asset pipeline;
the existing YouTube generator establishes the repository pattern of pinned
fonts and documented deterministic regeneration. No existing QR implementation
or related code path exists (`rg -i 'qrcode|qr code'` in tracked sources and
docs). The operator-only phone test remains deliberately deferred rather than
being represented by an unverified local claim.

## Implementation evidence

- `uv run scripts/qr-codes.py` generated all four committed files. OpenCV
  decoded every dark-on-light asset directly and every light-on-dark asset
  after inversion, at 1x, 0.5x, and 0.25x.
- Two clean output directories had identical SHA-256 values. The generated
  files matched the committed files byte-for-byte.
- A deliberate `https://wrong.example/` expected-payload assertion raised the
  generator's decode error, proving that the success check is not a no-op.
- Image inspection confirmed opaque sRGB PNGs: public-site images are
  1184x1326 and player-area images are 1189x1332; all captions use 59px
  Archivo Bold.

## Branch review

The branch is code-relevant because it adds an executable local generator.
No repository branch-review guide or available differential-review skill was
present, so the manual fallback reviewed the full generator and documentation,
the complete intended seven-file diff, saved-file decoder results, output
polarity, write-after-validation ordering, checksum enforcement, and the
external phone-scan boundary. No blocking or non-blocking findings resulted.
