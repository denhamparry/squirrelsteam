---
status: Complete
issue: 249
issue_url: https://github.com/denhamparry/squirrelsteam/issues/249
branch: denhamparry.co.uk/fix/gh-issue-249
deploy: no
---

# Plan: Fix missing spaces before inline elements

## Problem and acceptance

Astro removes source newlines between text and an inline element, causing
three built-page phrases to run together. The live issue was fetched on
2026-09-26 and has no comments.

- [x] About renders “of Rhiwbina”, not “ofRhiwbina”.
- [x] Rules renders “player contested”, not “playercontested”.
- [x] Fundraising renders “with 100%”, not “with100%”.
- [x] The issue's full built-site scan finds no text immediately followed by
      an `a`, `strong`, or `em` opening tag without whitespace.
- [x] Astro check/build, production audit, diff checks, and repository
      pre-commit hooks pass.

## Implementation and expected files

Add an explicit `{" "}` before the affected inline element in:

- `src/pages/about.astro`
- `src/pages/rules.astro`
- `src/pages/fundraising.astro`

Track planning and validation in
`docs/plan/issues/249_fix_inline_spacing.md`. No component, style, dependency,
workflow, deployment, or content-meaning changes are expected.

## Validation

1. Run `npm ci` and build the unmodified branch, then require the issue's scan
   to reproduce exactly the three reported matches.
2. Apply the explicit-space fixes and rebuild.
3. Require the same scan to return no matches and assert each corrected phrase
   in its generated page.
4. Sweep all Astro sources for analogous text/newline/inline-element patterns
   and disposition any credible match.
5. Run `npm run check`, `npm audit --omit=dev`, `git diff --check`, and exact
   staged repository pre-commit hooks. No local service is required.

## Risks and traceability

| Issue item | Disposition | Timing / owner | Evidence and current result |
| --- | --- | --- | --- |
| About `of Rhiwbina` spacing | Implement in this PR | Pre-merge / Codex | Built phrase assertion; pass |
| Rules `player contested` spacing | Implement in this PR | Pre-merge / Codex | Built phrase assertion; pass |
| Fundraising `with 100%` spacing | Implement in this PR | Pre-merge / Codex | Built phrase assertion; pass |
| Built-site regex returns no matches | Implement and validate | Pre-merge / Codex | Exact issue scan; pass |
| Do not change copy meaning or styling | Validate without broader change | Pre-merge / Codex | Diff contains only explicit-space insertions and plan; pass |
| No deploy or follow-up issue requested | Intentionally out of scope | User | Stop with one open PR |

The change is low risk and uses the explicit-space pattern already established
in the repository. The main risk is fixing only the three named examples while
leaving an analogous occurrence elsewhere; the repository-wide generated scan
and source sweep cover that risk.

## Research validation

**Overall assessment:** Approved after one review iteration.

- The issue names exact source locations, expected output, established fix
  syntax, and an executable repository-wide acceptance scan.
- All three locations are present on current `origin/main`; each places an
  inline element directly after text split by a source newline.
- The expected four-file scope is sufficient. Astro owns the whitespace
  behavior, so no component or CSS change is needed.
- Validation covers original failure, corrected success, repository-wide
  negative behavior, exact phrase output, project gates, and file scope.

## Implementation validation and branch review

**Classification:** Code-relevant Astro template rendering correction.

- The failure-shaped baseline build produced exactly three scan matches:
  `r<strong` in Rules, `f<a` in About, and `h<strong` in Fundraising.
- After the three explicit-space insertions, the exact issue scan returns no
  matches across built HTML. Direct generated-page assertions confirm
  “age group of Rhiwbina R.F.C.”, “eight-player contested scrum”, and
  “with 100% of the proceeds”.
- `npm run check` passes across 25 files with zero errors, warnings, or hints;
  `npm run build` generates eight pages; `npm audit --omit=dev` reports zero
  vulnerabilities; and `git diff --check` passes.
- A multiline source sweep for the root-cause pattern across every `.astro`
  file finds no remaining candidate.
- The complete diff and affected generated pages were manually reviewed because
  `differential-review` and Trail of Bits specialist skills are unavailable in
  this session. The edits preserve copy, tags, accessibility, styling, and
  layout; no blocking or non-blocking finding remains.
- All nine repository pre-commit hooks pass against the exact four-path staged
  handoff without modifying files.
