---
status: Complete
issue: 212
issue_url: https://github.com/denhamparry/squirrelsteam/issues/212
branch: denhamparry.co.uk/docs/gh-issue-212
deploy: no
---

# Plan: Pin the sponsor-variant SVG renderer

## Problem and outcome

The sponsor provenance record says the variants were produced deterministically
with ImageMagick 7.1.2-31, but Imperial is rasterized from an SVG containing
live `Avenir-Medium`/`Avenir` text. It names neither the librsvg renderer used
by ImageMagick nor the font-environment requirement, so the documented
derivation can fail or silently produce different pixels.

Update the record to pin librsvg 2.62.3, require the established delegate
pre-flight, name `rsvg:source/imperial.svg` as the input, and stop a maintainer
from replacing the committed variants unless the regenerated pixels match.
Issue #212 and its empty discussion were fetched at
2026-09-16T20:34:38+01:00. It follows the renderer pin merged in PR #211 for
issue #207.

## Implementation

1. Replace the overbroad determinism claim with the exact ImageMagick and
   librsvg versions used for SVG work, linking the matching pre-flight in the
   Veo runbook.
2. Name `rsvg:source/imperial.svg` as the 384-DPI input.
3. Explain that the live Avenir text resolves through the installed font
   environment, that the original resolved font was not recorded, and that a
   pixel mismatch must block replacement of the committed variants.

## Files expected to change

- `src/assets/sponsors/README.md`
- `docs/plan/issues/212_pin_sponsor_svg_renderer.md`

Sponsor artwork, source SVG content, raster variants, other export runbooks,
font installation, deployment, upload, merge, and issue closure are out of
scope.

## Validation

- Require the documented librsvg 2.62.3 pre-flight to pass and a wrong-version
  fixture to fail.
- Reproduce the Imperial `rsvg:` success and `msvg:` failure in a validated
  temporary directory; require the latter to exit non-zero without output.
- Trim the explicit librsvg render and compare it with the committed dark
  variant to prove the documented pixel-comparison gate detects environmental
  drift.
- Inspect the complete README, run targeted Markdown lint, `git diff --check`,
  the repository `npm` check/build/audit gates, and the final staged
  `pre-commit run --all-files`.

No server, external service, secret, deployment, or teardown is required.

## Risks and research validation

- **Observed:** ImageMagick 7.1.2-31 reports `RSVG` as librsvg 2.62.3.
- **Observed:** explicit `rsvg:source/imperial.svg` renders at 1120x368 before
  trimming. `msvg:` exits 1, reports that it cannot read a font, and produces
  no output.
- **Observed:** the source declares live `Avenir-Medium`/`Avenir` text. Font
  discovery utilities are unavailable in this environment, so the historical
  resolved font cannot be proved and must not be guessed.
- **Observed failure:** the current trimmed `rsvg:` output is 954x328 like the
  committed dark variant but comparison returns AE 8.53321, demonstrating that
  dimensions alone do not establish reproducibility.
- The analogous-pattern sweep covered the active YouTube and Veo SVG recipes,
  sponsor source provenance, and completed sponsor plans. PR #211 already pins
  the two active runbooks; only this current derivation record retains the
  incomplete tool claim. Historical plans remain implementation-time records.

Research review approved after one iteration. The change makes the external
font dependency falsifiable without claiming an unobserved font identity or
modifying approved artwork.

## Implementation validation

- The exact ImageMagick delegate pre-flight passed with librsvg 2.62.3, while a
  fixture reporting librsvg 2.61.0 exited 1.
- `rsvg:source/imperial.svg` rendered successfully at 1120x368.
  `msvg:source/imperial.svg` exited 1 with a font/configuration error and
  produced no output.
- Trimming the current librsvg render produced the committed 954x328 dimensions
  but comparison against `imperial-dark.png` returned AE 8.53321 and exit 1.
  This proves the new pixel gate rejects plausible font/render drift.
- The complete changed Markdown files contain no `bash` or `sh` fences.
  Targeted Markdown lint and `git diff --check` passed.
- `npm ci` installed 267 locked packages with zero vulnerabilities;
  `npm run check` passed 23 files with zero diagnostics; `npm run build` built
  all six pages; and `npm audit --omit=dev` found zero vulnerabilities.

## Branch review

**Classification:** non-code documentation change, standard risk. The
repository has no `docs/pre-pr-branch-review.md`; Trail of Bits review skills
were skipped because no code-relevant files changed. Manual review covered the
complete provenance record, live source font declaration, exact tool pins and
relative input path, the linked pre-flight, failure/success probes, mismatch
gate, and artwork/operational boundaries.

The final analogous-pattern sweep confirmed PR #211 already owns the current
YouTube and Veo recipes. Other Imperial paths are source inventories, linked
editable artwork, or historical completed plans and are intentionally
different. No blocking finding or non-blocking follow-up idea remains.

## Issue traceability

| Issue item | Disposition | Timing / owner / prerequisite | Evidence target | Current result |
| --- | --- | --- | --- | --- |
| Name SVG renderer/version beside ImageMagick | Implemented in this PR | Pre-merge / Codex | Complete README review | Passed: librsvg 2.62.3 named |
| Name `rsvg:source/imperial.svg` and renderer pre-flight | Implemented in this PR | Pre-merge / Codex / pinned toolchain | Exact text and live pre-flight | Passed: explicit input and linked pre-flight |
| State Avenir dependency | Implemented in this PR | Pre-merge / Codex | Source declaration plus README review | Passed: live family and unrecorded font file stated |
| Prevent replacement after font/render drift | Implemented and validated | Pre-merge / maintainer / committed variants | Pixel comparison instruction and mismatch probe | Passed: AE 8.53321 mismatch blocks replacement |
| Pre-commit hooks pass | Validated in this PR | Pre-merge / Codex | Final staged all-files hook run | Passed: all nine hooks |
| References #211 and #207 | Validated without a change | Pre-merge / Codex | Merged PR and issue context | Confirmed |
| Artwork, font installation, and live uploads | Intentionally out of scope | Not applicable | Diff review | No changes planned |
