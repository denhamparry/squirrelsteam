---
status: Complete
issue: 239
fetched_at: 2026-09-20
deploy: no
---

# Guard missing QR caption fonts

Issue: [#239](https://github.com/denhamparry/squirrelsteam/issues/239)

## Problem and outcome

The QR generator correctly rejects a bad font digest but lets a missing tracked
or explicitly supplied font escape as a `FileNotFoundError` traceback. Add the
same concise required-file guard already used for the crest, while preserving
the digest error and the no-output failure boundary.

## Implementation

1. Check the resolved default or `--font` path with `is_file()` inside
   `font_bytes()` before reading it.
2. Exit with one `error:` line that names the missing Archivo Bold path.
3. Leave the existing checksum gate and rendering pipeline unchanged.

## Files expected to change

- `scripts/qr-codes.py`
- `docs/plan/issues/239_guard_missing_qr_font.md`

## Validation

- In an isolated regular-file checkout of `origin/main`, remove the tracked
  font and prove the original generator exits non-zero with a traceback and no
  PNGs; repeat against the fix and require exactly one `error:` line naming the
  missing default path with no traceback.
- Pass a nonexistent explicit `--font` path and require the same shaped error
  and no PNGs.
- Pass an existing non-font file and require the unchanged SHA-256 mismatch
  message and no PNGs.
- Run the successful generator and compare all outputs byte-for-byte with the
  committed PNGs.
- Run Python compilation, `npm run check`, `npm run build`,
  `npm audit --omit=dev`, and final staged `pre-commit run --all-files`.

## Risks and boundaries

- The check must live in `font_bytes()` so both default and override paths use
  it. Moving it only into `main()` would miss direct callers or duplicate path
  selection logic.
- `Path.is_file()` also rejects directories and broken symlinks, which should
  receive the same required-file message.
- No generated PNG, font asset, or user-facing site content should change.

## Issue traceability

Issue snapshot fetched 2026-09-20; there are no comments.

| Issue item | Disposition | Timing, owner, prerequisite, evidence, current result |
| --- | --- | --- |
| Missing tracked font gets one-line path-specific error, no traceback | Implement in this PR | Pre-merge; Codex; scratch checkout without tracked font; failure-shape assertion; passed. |
| Missing explicit `--font` behaves identically | Implement in this PR | Pre-merge; Codex; nonexistent scratch path; failure-shape assertion; passed. |
| Existing bad font keeps digest-mismatch message | Validate without semantic change | Pre-merge; Codex; regular bad fixture; exact error assertion; passed. |
| Every failure writes no PNG | Validate without semantic change | Pre-merge; Codex; empty output directories; file-count assertions; passed. |
| Existing crest guard remains consistent | Validate without change | Pre-merge; Codex; source review; passed. |
| `scripts/youtube-playlist-thumbnails.py` has an analogous unguarded required font read | Non-blocking follow-up idea | Outside #239's QR generator scope; record in PR body rather than expanding this fix. |
| Linked issues #237 and PR #238 | Context only | No changes required outside the QR generator and plan. |

## Research review

Approved 2026-09-20. The fix is local, preserves the established `sys.exit`
error style, and is best tested through the real CLI rather than a mock. The
analogous YouTube generator occurrence is independent and does not share this
helper, so changing it would broaden the issue.

## Implementation and branch-review evidence

- The `origin/main` generator reproduced both missing-default and
  missing-override failures as uncaught `FileNotFoundError` tracebacks.
- The fixed generator made both cases exit 1 with exactly one `error:` line,
  the correct missing path, no traceback, and zero PNG files.
- An existing regular file with the wrong digest retained the prior checksum
  error and wrote zero PNGs. The normal path regenerated all four committed
  PNGs byte-for-byte.
- The branch is code-relevant. No repository branch-review guide or
  differential-review skill is available, so the manual fallback inspected
  the complete diff, both path-selection branches, failure ordering, output
  side effects, the successful generator path, and the analogous required-file
  reads. No blocking finding resulted; the separate YouTube occurrence remains
  a non-blocking follow-up idea.
- Python compilation, `npm run check`, `npm run build`, and
  `npm audit --omit=dev` passed after the review stabilized.
