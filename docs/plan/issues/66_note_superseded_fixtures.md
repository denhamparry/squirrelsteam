---
status: In Progress
issue: 66
issue_url: https://github.com/denhamparry/squirrelsteam/issues/66
branch: denhamparry.co.uk/docs/gh-issue-066
---

# Plan: Note superseded fixtures in issue 35 plan record

## Problem

The historical plan for issue #35 correctly records the fixture files created at
that time, but three of those fixtures were later cancelled and replaced by the
U12s Cup / Plate Pool 3 fixtures delivered by issue #60 and PR #61. Without a
dated supersession note, a reader can mistake the historical file list for the
repository's current fixture state.

## Acceptance criteria

- [x] Append a clearly dated addendum to
      `docs/plan/issues/35_update_2627_fixtures.md` that identifies the
      Tournament, Cowbridge, and Caerau fixtures as superseded.
- [x] Cross-reference issue #60 and PR #61 from the addendum.
- [x] Leave all original issue #35 plan text above the addendum unchanged.
- [x] Pass the repository pre-commit hooks and validate the new content with
      Prettier without reformatting the historical prefix.

## Implementation steps

1. Record a byte-for-byte copy of the existing issue #35 plan before editing.
2. Append a `Superseded fixtures` section dated 2026-08-05 to the end of the
   plan without modifying its historical content.
3. Name all three cancelled fixture dates and paths, and link the replacement
   work to issue #60 and PR #61.
4. Compare the pre-edit copy with every line before the new heading to prove the
   original plan text is unchanged.
5. Run the exact-file repository pre-commit hooks and diff checks.

## Files expected to change

- `docs/plan/issues/35_update_2627_fixtures.md`
- `docs/plan/issues/66_note_superseded_fixtures.md`

## Validation

- Reproduce the reported failure with
  `rg -n -i 'cowbridge|caerau|tournament' docs/` and confirm the issue #35 plan
  has no supersession note.
- Use a saved pre-edit copy and `cmp` to confirm every original byte remains
  unchanged above the appended heading.
- Confirm the addendum contains all three fixture dates and paths plus links to
  issue #60 and PR #61.
- Run `git diff --check`.
- Run
  `pre-commit run --files docs/plan/issues/35_update_2627_fixtures.md docs/plan/issues/66_note_superseded_fixtures.md`
  against the exact staged file set.

## Risks and open questions

- Rewriting or annotating the old file list in place would weaken the plan as a
  historical record, so the change must remain append-only.
- The issue asks for a dated note and was filed on 2026-08-05; use that date for
  the addendum and link the canonical GitHub issue and pull request URLs.
- No executable behavior or deployment changes are requested. The workflow stops
  with an open documentation PR.

## Issue traceability

| Issue item                                                                | Disposition                       | Evidence target                                  |
| ------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------ |
| Historical issue #35 references can be mistaken for current fixture state | Implement in this PR              | Dated supersession addendum                      |
| Tournament fixture on 2026-09-13                                          | Implement in this PR              | Named path and date in addendum                  |
| Cowbridge fixture on 2026-10-11                                           | Implement in this PR              | Named path and date in addendum                  |
| Caerau fixture on 2026-11-08                                              | Implement in this PR              | Named path and date in addendum                  |
| Cross-reference issue #60 and PR #61                                      | Implement in this PR              | Canonical GitHub links in addendum               |
| Do not rewrite historical plan content                                    | Implement and validate in this PR | Prefix comparison against saved pre-edit file    |
| Markdownlint and Prettier pass                                            | Validate in this PR               | Exact-file hooks and new-content Prettier checks |
| Fixture content or site behavior changes                                  | Intentionally out of scope        | Documentation-only changed-file classification   |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue #66 was fetched on 2026-08-05 and every affected path,
  suggested-fix constraint, acceptance criterion, and reference is represented
  in Issue traceability.
- GitHub confirms issue #60 is closed and PR #61 merged on 2026-08-05 at commit
  `b0d18beb5c8a6677856ed7a6a5f58bd29317f2fc`, so the supersession statement is
  supported by live repository state rather than historical inference.
- A repo-wide case-insensitive sweep for `Tournament`, `Cowbridge`, and `Caerau`
  found only the historical issue #35 plan and the completed issue #60 plan. The
  issue #60 references correctly document the cancellation and do not need
  another addendum; the issue #35 references are the only stale-looking
  occurrence requiring this fix.
- The replacement fixture files exist for Ynysowen, Abercwmboi, and Old
  Illtydians on the same three dates, while the three cancelled source paths no
  longer exist.
- Prefix comparison is stronger than a line-oriented visual check for the
  no-rewrite criterion and will detect whitespace or formatting churn above the
  addendum.
- The plan has no code-relevant or shell-bearing behavior. Exact-file hooks,
  new-content Prettier checks, and link/content assertions are proportional
  validation for this documentation-only change.

## Branch review

**Classification:** Non-code Markdown documentation and plan metadata.

**Review iteration 1:** Approved with no blocking or non-blocking findings.

- The live issue #66 was re-fetched on 2026-08-05 and its context, four named
  affected references, reproduction, suggested append-only fix, three acceptance
  criteria, and linked issue/PR references all remain represented in Issue
  traceability.
- Phase 3.5 found exactly the two expected paths: the historical issue #35 plan
  and this issue #66 plan. No source, fixture, dependency, workflow, or runtime
  file changed.
- Trail of Bits review skills were skipped because the branch has no
  code-relevant changes. The manual fallback inspected the complete content of
  both changed files, the complete diff, live GitHub references, current fixture
  paths, formatting behavior, and the original-file prefix hash.
- Neither changed Markdown file contains a Bash or shell fence, so executable
  fence validation is not applicable.
- The first 3,927 bytes of the historical plan still have SHA-256
  `e7b99ff02c83a4e8b21fa08bcf3e2a1265bcba3ca9969a265d0f6db6d25bd896`, matching
  the pre-edit file exactly.
- The configured pre-commit suite contains markdownlint but no Prettier hook.
  Whole-file Prettier also fails on the untouched historical prefix, so
  formatting that prefix would contradict the no-rewrite criterion. The new plan
  passes whole-file Prettier, and the addendum passes a range-scoped Prettier
  check beginning at byte 3,927.

## Validation results

- Failure-shaped baseline: passed; all three cancelled names appeared in the
  issue #35 plan with no supersession section.
- Current fixture-state check: passed; the three cancelled paths are absent and
  the three same-date Cup / Plate replacements are present.
- Historical-prefix SHA-256 comparison: passed byte-for-byte.
- Addendum content assertions: passed for the heading, date, three cancelled
  paths, issue #60 URL, and PR #61 URL.
- Complete-file shell-fence enumeration: passed with zero Bash or shell fences.
- New-content Prettier checks: passed for the complete issue #66 plan and the
  appended byte range in the issue #35 plan.
- `git diff --check`: passed.
- Repository pre-commit hooks: passed against the exact staged two-file set,
  including markdownlint and the configured secret/file-quality checks.
