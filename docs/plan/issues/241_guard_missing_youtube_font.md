---
status: Complete
issue: 241
fetched_at: 2026-09-20
deploy: no
---

# Guard the missing YouTube thumbnail font

Issue: [#241](https://github.com/denhamparry/squirrelsteam/issues/241)

## Problem and outcome

The YouTube playlist thumbnail generator reads `--font` before checking that
the path is a regular file. Missing paths, directories, and broken symlinks
therefore expose a Python traceback instead of the generator's established
one-line CLI errors. Reject those inputs before reading any bytes, without
changing checksum validation for an existing but incorrect file.

## Implementation

1. Check `args.font.is_file()` after playlist validation and before
   `Path.read_bytes()`.
2. Exit with `error: required Archivo font is missing: <path>` when the check
   fails, matching the defensive pattern in the QR code generator.
3. Preserve the existing digest-mismatch error and all successful generation
   behaviour.

## Files expected to change

- `scripts/youtube-playlist-thumbnails.py`
- `docs/plan/issues/241_guard_missing_youtube_font.md`

## Validation

- Exercise nonexistent, directory, and broken-symlink `--font` paths; each
  must exit nonzero with exactly one `error:` line naming the path and no
  traceback.
- Supply an existing non-font file and confirm the current Archivo digest
  mismatch remains unchanged.
- Compare tracked thumbnail assets before and after every negative case to
  prove no output is written.
- Run the generator with the documented pinned font and confirm the committed
  SVG and PNG outputs remain byte-identical.
- Run Python compilation, focused pre-commit hooks, repository checks, build,
  audit, and the complete pre-commit suite.

## Risks and boundaries

- `Path.is_file()` deliberately treats directories and broken symlinks as
  missing inputs, satisfying the requested uniform CLI behaviour.
- Renderer/version failures remain separate later-stage checks and are outside
  this focused change.
- No deployment is needed for a local generator error-path change.

## Acceptance and traceability

Issue snapshot fetched 2026-09-20 from the issue body; there are no comments.

| Issue item | Disposition | Verification timing, owner, prerequisite, evidence, current result |
| --- | --- | --- |
| Missing `--font` exits nonzero with one path-specific `error:` line and no traceback | Implement in this PR | Pre-merge; Codex; Python dependencies; focused CLI regression; passed locally. |
| Directory and broken-symlink paths receive the same controlled error | Implement in this PR | Pre-merge; Codex; temporary fixtures; focused CLI regression; passed locally. |
| Existing invalid files retain the Archivo digest-mismatch error | Preserve in this PR | Pre-merge; Codex; existing non-font file; focused CLI regression; passed locally. |
| No rejected input writes thumbnail output | Preserve in this PR | Pre-merge; Codex; clean tracked assets; before/after asset digest comparison; passed locally. |

## Research review

Reviewed 2026-09-20. The repository's QR generator already guards its font
source with `Path.is_file()` and emits a one-line missing-font error before
reading bytes. Searches of the scripts found no other unguarded font-byte read
requiring expansion of this issue. The requested YouTube-generator guard is
therefore the smallest consistent fix, with no documentation or caller change
needed.

## Implementation evidence

- Before the fix, nonexistent and broken-symlink paths raised
  `FileNotFoundError`, while a directory raised `IsADirectoryError`; all three
  included tracebacks. The existing bad-file case already emitted the expected
  single digest-mismatch line.
- After the fix, nonexistent, directory, and broken-symlink paths each exited
  with status 1, empty standard output, exactly one path-specific `error:` line,
  and no traceback. The existing bad-file message remained byte-for-byte
  unchanged.
- SHA-256 snapshots proved that no negative case changed a tracked thumbnail.
  The documented pinned font passed its checksum and regenerated all twelve
  SVG/PNG assets byte-for-byte with ImageMagick 7.1.2-31 and librsvg 2.62.3.
- Python compilation, focused and all-files pre-commit hooks,
  `npm run check`, `npm run build`, and `npm audit --omit=dev` passed.

## Branch review

The branch is code-relevant because it changes an executable generator. No
repository branch-review guide or available differential-review skill was
present, so the manual fallback reviewed the complete two-file diff, all issue
acceptance paths, error ordering, output-write ordering, successful
regeneration, and the analogous QR generator. No blocking or non-blocking
findings resulted.
