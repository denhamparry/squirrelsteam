---
status: Complete
issue: 237
fetched_at: 2026-09-20
deploy: no
---

# Pin the QR caption font in the repository

Issue: [#237](https://github.com/denhamparry/squirrelsteam/issues/237)

## Problem and outcome

The QR generator's checksum gate fails safely if Google rotates or withdraws
its versioned CDN URL, but that URL is currently the only default retrieval
path. Preserve the exact accepted Archivo Bold bytes and their licence in the
repository, then make the generator use that tracked copy by default. This
removes the network dependency while preserving byte-identical QR images.

## Implementation

1. Add the exact checked Archivo Bold TTF under
   `scripts/assets/archivo/`, beside the SIL Open Font License 1.1 text from
   the commit-pinned Google Fonts source.
2. Replace the CDN download in `scripts/qr-codes.py` with the tracked font path.
   Keep `--font` as a checksum-validated override for explicit reproduction.
3. Update `docs/qr-codes.md` with the durable source, provenance, checksum, and
   recovery steps for a digest mismatch.

## Files expected to change

- `scripts/qr-codes.py`
- `scripts/assets/archivo/Archivo-Bold.ttf`
- `scripts/assets/archivo/OFL.txt`
- `docs/qr-codes.md`
- `docs/plan/issues/237_pin_qr_caption_font.md`

## Validation

- Run the unmodified generator from `origin/main` into one isolated output
  directory and the changed generator into another; compare every PNG digest
  with each other and the committed assets.
- Exercise the default bundled-font path, an explicit valid `--font` path, and
  a deliberately invalid `--font` file. The invalid path must exit non-zero
  before writing outputs.
- Run Python syntax checking, `npm run check`, `npm run build`,
  `npm audit --omit=dev`, and the final staged `pre-commit run --all-files`.

## Risks and decisions

- Committing 110 KB of font data is preferred to changing rendering to the
  variable font: it preserves the exact bytes already proven to generate the
  committed PNGs and makes regeneration independent of network availability.
- The font stays checksum-gated. A mismatch is a repository-integrity or
  intentional-font-update event, not a reason to weaken validation.
- No QR PNG should change. Any generated-image diff is a blocking regression.

## Issue traceability

Issue snapshot fetched 2026-09-20; there are no comments.

| Issue item | Disposition | Timing, owner, prerequisite, evidence, current result |
| --- | --- | --- |
| Obtain Archivo Bold without a rotating `fonts.gstatic.com` path | Implement in this PR | Pre-merge; Codex; exact tracked TTF; default local generator run; passed. |
| Document the durable source | Implement in this PR | Pre-merge; Codex; tracked TTF and OFL; documentation review; passed. |
| Explain digest-mismatch recovery | Implement in this PR | Pre-merge; Codex; checksum gate; invalid-font negative check and documentation review; passed. |
| Regenerate four PNGs byte-identically | Validate without changing PNGs | Pre-merge; Codex; generator dependencies; base/new/committed SHA-256 comparison; passed. |
| Prefer commit-pinned Google Fonts source or fallback | Superseded by accepted alternative | Pre-merge; Codex; issue explicitly permits committing the static TTF with OFL when no matching static upstream file exists; tracked exact font chosen. |
| Derive Bold from the variable font | Intentionally out of scope | Avoids renderer/font-byte drift because the exact static font is available and small enough to track. |
| Linked issues #235 and PR #236 | Context only | No changes needed outside the named generator and documentation paths. |

## Research review

Approved 2026-09-20. Google Fonts exposes only variable Archivo TTFs in the
family directory; its last font-changing repository commit is
`6c70c829f09ea345d3590406693220ea35c6553f`. The current CDN-served static Bold
font was observed with SHA-256
`bed60488c2f5c0b24e01d931760b6f3e9a82619dcd081ed9bff643d9f4fd9e3d`.
The issue's commit-the-static-font route therefore provides the smallest
failure-resistant change and a direct byte-identity oracle.

## Implementation and review evidence

- The old `origin/main` generator, the new bundled-font default, and an
  explicit `--font scripts/assets/archivo/Archivo-Bold.ttf` run produced the
  same four SHA-256 values as the committed PNGs.
- `--font package.json` exited 1 at the checksum gate and wrote no output file,
  proving a mismatched source remains fail-closed.
- The branch is code-relevant and vendors a font dependency. No repository
  branch-review guide, differential-review skill, or supply-chain specialist
  skill is available, so the manual fallback inspected the complete diff,
  default and override paths, binary type/size/digest, licence attribution,
  base-versus-new generated artifacts, and all documented recovery steps. No
  blocking or non-blocking finding resulted.
- `docs/qr-codes.md` contains one `text` fence and no executable shell fence;
  no fence normalization or shell validation is required.
- The initial targeted `pre-commit run --files ...` exited 1 when the
  trailing-whitespace hook normalized upstream whitespace in `OFL.txt`; this
  was a formatting-hook correction, not a product assertion failure. The
  normalized licence text was re-inspected and the hook rerun.
- Python compilation and font metadata parsing passed (`Archivo`, `Bold`).
  `npm run check`, `npm run build`, and `npm audit --omit=dev` also passed.
