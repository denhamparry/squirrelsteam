---
status: Complete
issue: 252
issue_url: https://github.com/denhamparry/squirrelsteam/issues/252
branch: denhamparry.co.uk/fix/gh-issue-252
deploy: no
---

# Plan: Record the Pontypool and Clwb Rygbi Caerdydd results

## Problem and outcome

The two latest away fixtures do not yet carry structured results, and the Clwb
Rygbi Caerdydd fixture is still represented as an all-day event. Record the
confirmed scores and breakdowns, and change the Clwb event to its confirmed
10:00–11:00 BST slot so the existing results UI and calendar generator publish
the correct data without match-body notes.

The live issue snapshot was fetched on 2026-09-27 at 20:08 BST. Issue #252 was
open. The owner's [final correction in comment
5858849301](https://github.com/denhamparry/squirrelsteam/issues/252#issuecomment-5858849301)
confirms Pontypool as 14–54 with 2T 2C v 8T 7C and supersedes the owner's earlier
14–52 comment.

The issue was re-fetched after the initial PR handoff on 2026-09-27 at 20:19
BST. The owner's [Clwb correction in comment
5858982802](https://github.com/denhamparry/squirrelsteam/issues/252#issuecomment-5858982802)
changes the result to 36–14 (6T 3C v 2T 2C), superseding the initial 36–12
record used by PR #253's first implementation SHA.

## Implementation

1. Add the confirmed 14–54 structured result and breakdown to the existing
   timed Pontypool away fixture.
2. Add the confirmed 36–14 structured result and breakdown to the Clwb away
   fixture, replace its date-only/all-day representation with the confirmed
   10:00–11:00 `+01:00` timestamps, and remove `allDay`.
3. Build the site and verify the generated Results page and exact Clwb VEVENT,
   then run all repository quality gates.

## Files expected to change

- `src/content/fixtures/pontypool-utd-away-2026-09-20.md`
- `src/content/fixtures/clwb-rygbi-caerdydd-away-2026-09-27.md`
- `docs/plan/issues/252_record_pontypool_clwb_results.md`

No schema, formatter, component, dependency, workflow, match-body, or deploy
file is expected to change.

## Validation

- Prerequisite: install the locked dependencies with `npm ci`; no service,
  generated-input, submodule, or remote runtime is required.
- Prove the baseline generated site lacks both results and emits Clwb as an
  all-day event, then prove the implementation build shows the exact two scores,
  W/L outcomes, and try/conversion breakdowns.
- Isolate and unfold the Clwb VEVENT in `dist/fixtures.ics`; require
  `DTSTART:20260927T090000Z`, `DTEND:20260927T100000Z`, and no `VALUE=DATE`.
- Assert both source records contain the exact structured values and have empty
  bodies; assert Clwb no longer has `allDay`.
- Run `npm run check`, `npm run build`, `npm audit --omit=dev`,
  `git diff --check`, and pre-commit against the exact staged paths.

## Risks and decisions

- This is a small content-only change. The existing schema, result formatter,
  Results page, and ICS generator already support the requested shapes, score
  breakdowns, home/away ordering, and timed events.
- Offset-bearing source timestamps preserve the confirmed Cardiff local time;
  the ICS generator converts them to the required UTC instants.
- No deployment, live runtime access, authorization change, destructive action,
  or high-risk independent review is required.

## Issue traceability and acceptance

| Issue item | Disposition | Timing / owner | Prerequisite and evidence | Current result |
| --- | --- | --- | --- | --- |
| Pontypool 14–54, 2T 2C v 8T 7C | Implement in this PR | Pre-merge / Codex | Exact source assertion and built Results card | Passed |
| Final comment supersedes earlier 14–52 correction | Implement in this PR | Pre-merge / Codex | Use comment `5858849301`; reject 14–52 in source/output | Passed |
| Clwb 36–14, 6T 3C v 2T 2C | Implement in this PR | Pre-merge / Codex | Exact source assertion and built Results card | Passed |
| Clwb timed 10:00–11:00 BST; remove all-day flag | Implement in this PR | Pre-merge / Codex | Exact source assertion and built VEVENT UTC times | Passed |
| No match notes in either body | Implement in this PR | Pre-merge / Codex | Frontmatter terminators are followed only by EOF | Passed |
| Schema accepts both result blocks | Validate without schema change | Pre-merge / Codex | `npm run check` and `npm run build` | Passed |
| Fixtures page shows loss/win, scores, and breakdowns | Validate without component change | Pre-merge / Codex | Generated `dist/fixtures/index.html` assertions | Passed |
| Clwb VEVENT is timed, not `VALUE=DATE` | Validate without generator change | Pre-merge / Codex | Isolated unfolded `dist/fixtures.ics` VEVENT | Passed |
| `npm run check`, `npm run build`, and pre-commit pass | Validate in this PR | Pre-merge / Codex | Recorded command exit statuses | Passed |
| Club D10 record `0-6570713` and coaches' confirmation | Documented provenance only | Pre-merge / issue owner | Issue body; no remote lookup required | Accepted |
| `Closes #246` and `Part of #10` body references | Context only; no implementation action | Pre-merge / Codex | Preserve scope to issue #252 | Accepted |
| Schema/UI/generator refactors, deploy, merge, and issue closure | Intentionally out of scope | External / repository owner | Exact changed-file gate and open PR | Confirmed |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The freshly fetched body and owner comments are fully dispositioned.
  Comment `5858849301` is the authoritative last correction and agrees with
  the body's arithmetic: 8 tries plus 7 conversions totals 54.
- The baseline build reproduced both gaps: neither fixture appears in Results,
  and the Clwb VEVENT emits `DTSTART;VALUE=DATE:20260927` plus the exclusive
  all-day `DTEND;VALUE=DATE:20260928`.
- The analogous fixture sweep found two existing structured results using the
  same schema shape. The shared formatter already emits away-team-first scores,
  pluralised try/conversion breakdowns, and W/L chips; the ICS generator already
  converts offset timestamps to UTC. No code change is needed.
- The locked dependency install and baseline build passed with zero
  vulnerabilities. The only install note was the existing npm allow-scripts
  advisory for `esbuild` and `fsevents`; no dependency file changed.
- Validation covers the original failure, corrected page and calendar output,
  source arithmetic, empty match bodies, exact file scope, and repository gates.
  No unresolved requirement, external-state assumption, or high-risk surface
  remains.
- The later owner correction in comment `5858982802` supersedes the initial
  Clwb result evidence. The same implementation shape remains valid; only the
  opponent score and conversion count change from 12/1 to 14/2.

## Implementation validation

- Phase 3.5 found exactly the three planned paths: both fixture records and this
  plan. No schema, formatter, component, dependency, workflow, match-body, or
  deployment file changed.
- `npm ci` installed the 268-package locked tree and reported zero
  vulnerabilities. The existing npm allow-scripts advisory named `esbuild` and
  `fsevents`; no tracked dependency file changed.
- `npm run check` passed across 25 files with zero errors, warnings, or hints.
  `npm run build` generated all eight pages plus `fixtures.ics`, and
  `npm audit --omit=dev` reported zero vulnerabilities.
- Exact assertions confirmed both source records, rejected the superseded 14–52
  score, and proved both fixture bodies remain empty. The generated page shows
  Pontypool as a Loss with 54 (8 tries, 7 conversions) to 14 (2 tries,
  2 conversions). The initial PR handoff showed Clwb as a Win with 12
  (2 tries, 1 conversion) to 36
  (6 tries, 3 conversions).
- The unfolded Clwb VEVENT contains `DTSTART:20260927T090000Z` and
  `DTEND:20260927T100000Z` and contains no `VALUE=DATE`. `git diff --check`
  also passed.
- The first staged `pre-commit run` exited 1 because markdownlint reported
  MD034 for a bare issue-comment URL in this plan (behavior assertion failure).
  The citation was converted to a Markdown link before the staged rerun; all
  other hooks passed on that first attempt.
- The corrected staged snapshot passed every configured pre-commit hook. The
  initial PR handoff was finalized on 2026-09-27 at 20:11 BST.

## Branch review

**Classification:** Code-relevant executable fixture content plus its plan.

**Review iteration 1:** Approved with no blocking or non-blocking finding.

- The live issue was re-fetched after implementation and remains open with the
  then-current body and two owner comments. That review was valid for the
  initial handoff but was superseded by the later Clwb correction; iteration 2
  will re-review the revised fixture and generated outputs.
- The repository has no `docs/pre-pr-branch-review.md`. The named
  `differential-review` and specialist Trail of Bits skills are unavailable in
  this session, so the concrete manual fallback inspected the complete changes,
  schema shape, result-formatting consumer, result selection, time conversion,
  and generated outputs.
- The final analogous sweep covered all four result-bearing fixtures and every
  offset-timed fixture. The new records match the established shapes; adjacent
  records are intentionally different fixtures and need no change.
- Failure-shaped baseline evidence, corrected page/calendar assertions,
  check/build/audit results, arithmetic, empty bodies, and exact file scope all
  pass. The three changed Markdown files contain zero executable Bash or shell
  fences.
- No authorization, secret, dependency, workflow, parser, deploy, or runtime
  risk surface changed, so no specialist or high-risk delegated review is
  indicated. Phase 4.5 produced no follow-up idea.

## Issue-update revision validation

- The live issue was re-fetched on 2026-09-27 at 20:19 BST. The updated body
  and owner comment `5858982802` consistently require 36–14 with 6T 3C v
  2T 2C; every other requirement is unchanged.
- `npm run check` again passed across 25 files with zero diagnostics,
  `npm run build` regenerated all eight pages plus `fixtures.ics`, and
  `npm audit --omit=dev` again reported zero vulnerabilities.
- Exact source and arithmetic assertions proved Rhiwbina's 6 tries and
  3 conversions total 36, while Clwb's 2 tries and 2 conversions total 14.
  They also reject the superseded opponent score 12 and conversion count 1.
- The generated result card shows a Win and the away-team-first line `Clwb
  Rygbi Caerdydd 14 (2 tries, 2 conversions) – 36 Rhiwbina Squirrels (6 tries,
  3 conversions)`. The season record updates from 95–80 to 95–82.
- The Clwb VEVENT retains the required 09:00–10:00Z timestamps, contains no
  `VALUE=DATE`, and includes the corrected result description. The fixture body
  remains empty and `git diff --check` passes.

## Branch review iteration 2

**Result:** Approved with no blocking or non-blocking finding.

- The complete PR branch still changes only the two planned fixtures and this
  plan; the post-handoff revision changes only the Clwb fixture and the plan.
- The same manual fallback rechecked the schema, arithmetic, away-team display
  order, season aggregation, ICS result text and time conversion, all four
  result-bearing fixtures, and all issue items against the fresh live issue.
- The two revised Markdown files contain zero executable Bash or shell fences.
  No adjacent fixture needs the Clwb-specific correction and no follow-up idea
  was found.
- The corrected two-path staged snapshot passed every configured pre-commit
  hook. The revised PR handoff was finalized on 2026-09-27 at 20:20 BST.
