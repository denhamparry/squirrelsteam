---
status: Complete
issue: 207
issue_url: https://github.com/denhamparry/squirrelsteam/issues/207
branch: denhamparry.co.uk/docs/gh-issue-207
deploy: no
---

# Plan: Pin the SVG renderer in image export recipes

## Problem and outcome

The YouTube banner and Veo sponsor-image recipes pin ImageMagick 7.1.2-31 but
leave its SVG coder implicit. On the reference machine, `svg:` resolves to
librsvg 2.62.3; ImageMagick's internal `msvg:` renderer changes 1,992.42 pixels
in the banner text/background pass. A contributor can therefore use the pinned
ImageMagick version and still fail the documented deterministic comparison.

Make librsvg 2.62.3 an explicit prerequisite, fail before rendering when that
delegate/version is unavailable, and use the `rsvg:` coder for every active SVG
input in the affected YouTube and Veo recipes. Issue #207 and its empty
discussion were fetched at 2026-09-16T19:15:29+01:00. The finding came from the
merged #202 implementation's PR #206 verification.

## Implementation

1. Add one exact `magick -list format` pre-flight check to each runbook and
   state that ImageMagick 7.1.2-31 was paired with librsvg 2.62.3.
2. Change the YouTube banner text/background pipe from `svg:-` to `rsvg:-` and
   prefix its Cornerstone SVG layer with `rsvg:`.
3. State that the Veo cover and lower-banner SVG inputs, including Cornerstone
   and Imperial source renders, use `rsvg:` rather than ImageMagick's implicit
   SVG selection.

## Files expected to change

- `docs/youtube.md`
- `docs/veo-overlays.md`
- `docs/plan/issues/207_pin_svg_renderer.md`

Generated PNGs and SVG artwork are unchanged because the explicit reference
renderer reproduces the committed output. Sponsor variant derivation,
historical completed plans, deployment, upload, merge, and issue closure are
out of scope.

## Validation

- Run the exact delegate pre-flight and require the librsvg 2.62.3 row.
- Rerun the complete YouTube banner recipe with explicit `rsvg:` inputs in a
  validated temporary directory; require zero differing pixels and a
  byte-identical file against `src/assets/logo/youtube-banner.png`.
- Prove the failure shape by comparing the same text/background pass through
  `rsvg:` and `msvg:` and require a non-zero image comparison.
- Review every current documentation occurrence of ImageMagick/SVG rendering,
  validate the full changed Markdown files, run `git diff --check`, and run the
  final staged `pre-commit run --all-files` gate.
- Run the repository's unfiltered pull-request gates locally with `npm ci`,
  `npm run check`, `npm run build`, and `npm audit --omit=dev`.

No server, external service, secret, deployment, or teardown is required.

## Risks and research validation

- **Observed:** ImageMagick 7.1.2-31 reports `SVG` and `RSVG` as librsvg 2.62.3.
- **Observed:** the proposed explicit `rsvg:` banner command differs from the
  committed PNG by zero pixels and is byte-identical.
- **Observed failure:** substituting `msvg:` changes 1,992.42 pixels and exits
  image comparison with status 1. The first negative-control harness attempt
  exited 1 before comparison because `status` is reserved by zsh; this was a
  harness/setup failure, and the corrected harness passed.
- The analogous-pattern sweep covered `docs/youtube.md`,
  `docs/veo-overlays.md`, `src/assets/sponsors/README.md`, and completed image
  plans. The two runbooks are the only current export instructions. The sponsor
  README records historical provenance without an executable SVG recipe, and
  completed plans intentionally preserve their implementation-time evidence.

Research review approved after one iteration: explicit coder prefixes plus the
version pre-flight address missing delegates and version drift while keeping
the change limited to current operator instructions.

## Implementation validation

- The exact pre-flight passes against ImageMagick 7.1.2-31 with its reported
  librsvg 2.62.3 delegate. A fixture reporting librsvg 2.61.0 is rejected with
  exit status 1.
- The complete updated YouTube recipe produced an image with zero differing
  pixels (`AE=0 (0)`) and `cmp` confirmed it is byte-identical to the committed
  `youtube-banner.png`.
- The corrected negative-control harness compared the same text/background
  pass through `rsvg:` and `msvg:`; it found 1,992.42 differing pixels and
  exited comparison with status 1.
- The complete changed Markdown files contain no `bash` or `sh` fences. Their
  `text` recipes were executed directly where applicable, targeted Markdown
  lint passed, and `git diff --check` passed.
- `npm ci` installed 267 locked packages with zero vulnerabilities;
  `npm run check` passed 23 files with zero diagnostics; `npm run build` built
  all six pages; and `npm audit --omit=dev` found zero vulnerabilities.

## Branch review

**Classification:** non-code documentation change, standard risk. The
repository has no `docs/pre-pr-branch-review.md`; Trail of Bits review skills
were skipped because no code-relevant files changed. Manual review covered the
complete two-runbook diff, exact issue and empty discussion, delegate/version
matching, explicit coder paths, source-relative working directories, the
failure and success evidence, and generated-asset/upload boundaries.

The final analogous-pattern sweep found one plain Cornerstone path in the Veo
cover's source-order inventory; it is not an ImageMagick command and is
intentionally unchanged. All actual SVG-render instructions in the affected
recipes now identify librsvg and use `rsvg:`. No blocking finding or
non-blocking follow-up idea remains.

## Issue traceability

| Issue item | Disposition | Timing / owner / prerequisite | Evidence target | Current result |
| --- | --- | --- | --- | --- |
| Name the YouTube banner SVG renderer and version | Implemented in this PR | Pre-merge / Codex | Complete-file documentation review | Passed: librsvg 2.62.3 named |
| Name the same renderer for Veo Cornerstone SVG renders | Implemented in this PR | Pre-merge / Codex | Complete-file documentation review | Passed for cover and lower banner |
| Force `rsvg:` or fail when the expected renderer is absent | Implemented both in this PR | Pre-merge / Codex / ImageMagick 7.1.2-31 with librsvg 2.62.3 | Exact pre-flight plus recipe audit | Passed: explicit coders and version check |
| Updated banner recipe reproduces committed PNG | Implemented and validated | Pre-merge / Codex / pinned toolchain | Zero-pixel and byte comparison | Passed: zero pixels and byte-identical |
| Pre-commit hooks pass | Validated in this PR | Pre-merge / Codex | Targeted lint plus final staged all-files hook run | Passed: all nine hooks |
| References #206 and #202 | Validated without a change | Pre-merge / Codex | Live issue and merged PR review | Confirmed source and linked context |
| Generated assets, uploads, and deployment | Intentionally out of scope | Not applicable | Diff review | No changes planned |
