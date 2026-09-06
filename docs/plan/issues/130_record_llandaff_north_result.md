---
status: Complete
issue: 130
issue_url: https://github.com/denhamparry/squirrelsteam/issues/130
branch: denhamparry.co.uk/feat/gh-issue-130
deploy: no
---

# Plan: Record the Llandaff North away result

## Problem

Fixtures cannot store a structured match result. Consequently the completed
Llandaff North away fixture has no score on the past-fixtures list or in its
calendar event. The result must remain independent of optional Markdown notes
so hiding past-event notes cannot hide the score.

The live issue snapshot was fetched on 2026-09-06 at 13:21 Europe/London. Issue
Issue #130 was open and last updated at `2026-09-06T12:16:45Z`; it had no
comments.

## Acceptance criteria

- [x] The fixture schema accepts an optional match-only, non-negative integer result with
      required `us` and `them` scores and optional complete `tries` and
      `conversions` breakdowns.
- [x] The Llandaff North fixture records Rhiwbina Squirrels 28 (4 tries, 4
      conversions) and Llandaff North 7 (1 try, 1 conversion).
- [x] Its dimmed Past events card shows `Llandaff North 7 – 28 Rhiwbina
      Squirrels` without relying on fixture-body notes.
- [x] Its calendar description includes the same score.
- [x] Existing fixtures without a result retain their current presentation and
      calendar description behaviour.
- [x] `npm run check` and `npm run build` pass.

## Implementation steps

1. Extend the collection schema with a reusable non-negative integer score
   shape and optional `result`, `tries`, and `conversions` objects, rejecting a
   result attached to a non-match fixture.
2. Add a shared match-result formatter that orders the named teams according to
   the existing `home` flag and falls back to a W/L/D score when an opponent is
   unavailable.
3. Render that formatter in `FixtureItem` independently of `showNotes`.
4. Append the formatted result to the ICS description while preserving the
   existing note-first-or-synthesised-description behaviour.
5. Add the existing `opponent` field and the complete result breakdown to the
   Llandaff North record.
6. Build and inspect the exact source, card, and unfolded VEVENT; compare
   result-free output behaviour and run repository quality gates.

## Files expected to change

- `src/content.config.ts`
- `src/lib/fixtures.ts`
- `src/components/FixtureItem.astro`
- `src/lib/ics.ts`
- `src/content/fixtures/llandaff-north-away-2026-09-06.md`
- `docs/plan/issues/130_record_llandaff_north_result.md`

No other fixture, dependency, workflow, page, deployment, or global style file
is expected to change.

## Validation

- Baseline failure (observed before implementation): after `npm ci`,
  `npm run check`, and `npm run build` passed, the complete Llandaff North card
  ended after its date with no result element and its VEVENT had no
  `DESCRIPTION`.
- Run `npm run check`, `npm run build`, and `npm audit --omit=dev`.
- Require the source to contain exact `us`/`them`, tries, conversions, and
  opponent values, and require the built Past events card to show the exact
  away-team-first score outside any notes container.
- Unfold `dist/fixtures.ics`, isolate the exact filename-derived UID, and
  require its unchanged all-day dates and summary plus a description containing
  the exact result.
- Inspect all result-free fixture cards and VEVENT descriptions for unintended
  result output; compare representative body, opponent-only, and no-description
  paths against a clean `origin/main` build.
- Run `git diff --check` and pre-commit against the exact staged path set.

## Risks and decisions

- `opponent` is added to the Llandaff North record because the schema already
  owns that identity and a structured result should not parse the display title.
  `FixtureItem` already suppresses duplicate opponent text when the title names
  it, so this does not change the heading.
- The UI and ICS use one formatter to avoid home/away score-order drift. The
  breakdown remains structured source data but is not separately rendered; the
  issue only requires the score in generated outputs.
- The optional ICS enhancement is included because the issue explicitly names
  missing calendar results and `src/lib/ics.ts` as an affected path.
- This is local static-site work. No runtime, authorization, networking,
  deployment, destructive operation, or independent high-risk review is
  required.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Optional result with required side scores | Implement in this PR | Schema plus successful content validation |
| Optional tries/conversions breakdown | Implement in this PR | Exact nested fixture data and schema |
| Record the 7–28 result and 1/4 try/conversion counts | Implement in this PR | Exact source assertion |
| Show score in Past events despite `showNotes={false}` | Implement in this PR | Complete built-card assertion |
| Suggested full team-name line or W/L shorthand | Implement full line when opponent is known, W/L/D fallback otherwise | Shared formatter assertions and built card |
| Append result to synthesised ICS description | Implement in this PR | Complete unfolded VEVENT assertion |
| Existing result-free fixtures unaffected | Validate without changing them | Exact changed-file gate and representative output comparison |
| Affected schema, component, fixture, and ICS paths | Implement in this PR | Diff contains every named path |
| Shared formatter ownership | Implement in `src/lib/fixtures.ts` | Both output consumers import one helper |
| `npm run check` and `npm run build` | Validate in this PR | Recorded command results |
| Issue #114 date correction | Validate without a change | Source and VEVENT remain on 6 September 2026 |
| Epic #10 | Context only | No separate implementation action |
| Merge, issue closure, deployment, unrelated fixtures | Intentionally out of scope | Open PR and exact changed-file gate |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue is fully covered by the criteria and traceability table. Its
  body and empty comment set contain no conflicting or unresolved requirement.
- The baseline build reproduced both user-visible gaps after a clean install:
  the Llandaff North card has no result markup and its complete VEVENT has no
  description. The fixture date and all-day end are already correct from #114.
- The analogous sweep covered all match records, every `FixtureItem` caller,
  collection typing, and every ICS description branch. Existing generated
  descriptions fall into body-note, opponent-only synthesis, and absent modes;
  appending only a non-null shared result preserves each mode for result-free
  fixtures.
- Most match records do not yet carry `opponent`, so parsing titles would create
  a new implicit data contract. Adding the already-supported field to this one
  completed fixture is smaller and more reliable, while the formatter's W/L/D
  fallback safely handles a future result whose opponent is not yet structured.
- Non-negative integers reject fractional and impossible negative counts.
  Requiring both sides inside each optional breakdown avoids partial statistics,
  and restricting results to match fixtures prevents accidental result display
  on training or social events.
- Validation covers the new success path, unchanged result-free paths, exact
  source values, output ordering for an away match, and the repository gates.
  No unresolved blocker or external-state assumption remains.

## Implementation validation

- Phase 3.5 found exactly the six planned paths: the five implementation files
  plus this plan. No other fixture, dependency, workflow, page, deployment, or
  global style file changed.
- `npm ci` installed the 261-package locked tree and reported zero
  vulnerabilities. It emitted the existing environment-level allow-scripts
  advisory for `esbuild` and `fsevents`; no tracked dependency file changed.
- Clean `npm run check` passed across 19 files with zero diagnostics,
  `npm run build` generated all six pages plus `fixtures.ics`, and
  `npm audit --omit=dev` reported zero vulnerabilities.
- Temporary invalid-content probes proved the schema rejects a negative score,
  a fractional score, and a valid-shaped result attached to a training event.
  Both probes failed with their intended validation messages and were removed
  before the clean validation rerun.
- The source contains the exact opponent, 28–7 score, 4–1 tries, and 4–1
  conversions. The generated card contains exactly one result row with the
  requested away-team-first text, independently of the hidden notes path.
- The unfolded target VEVENT retains its `20260906` start, exclusive `20260907`
  end, and summary, and adds the exact result after its synthesised away-match
  description. RFC line folding preserves the complete Unicode result text.
- A clean `origin/main` build and the implementation build contain the same 30
  events. After normalising generated `DTSTAMP`, all 29 result-free VEVENTs are
  byte-identical. `git diff --check` also passed.

## Branch review

**Classification:** Code-relevant schema, TypeScript, Astro component, ICS
generation, and executable fixture content.

**Review iteration 1:** Approved with no blocking or non-blocking finding.

- The live issue was re-fetched on 2026-09-06, remains open, has no comments,
  and is unchanged from the plan snapshot. Every issue item remains mapped in
  Issue traceability.
- The repository has no `docs/pre-pr-branch-review.md`. The named
  `differential-review` and Trail of Bits specialist skills are unavailable in
  this session, so the concrete manual fallback inspected the complete diff,
  collection output typing, all `FixtureItem` callers, all three existing ICS
  description modes, home/away ordering, RFC escaping/folding, and every match
  record.
- The final analogous sweep found one structured result and no competing score
  field or formatter. The existing opponent-in-title suppression prevents the
  added `opponent` value from duplicating the Llandaff North heading. Future
  named home/away results use the shared formatter; incomplete opponent data
  receives the explicit W/L/D fallback.
- Failure-shaped baseline evidence, malformed-schema probes, corrected output,
  result-free event comparison, full build/check/audit, and exact file scope all
  pass. No dependency, CI, authorization, secret, network, or deployment risk
  surface changed, so no specialist or high-risk delegated review is indicated.
- The two changed Markdown files contain zero executable `bash` or `sh` fences.
  Phase 4.5 produced no follow-up idea, so no issue or PR-body follow-up section
  is needed.
