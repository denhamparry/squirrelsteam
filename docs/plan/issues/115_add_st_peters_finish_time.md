---
status: Complete
issue: 115
issue_url: https://github.com/denhamparry/squirrelsteam/issues/115
branch: denhamparry.co.uk/fix/gh-issue-115
deploy: no
---

# Plan: Add the St Peters away friendly finish time

## Problem

The 28 August 2026 St Peters away friendly has a confirmed 5:00 pm start but no
end time. The user has now confirmed that 7:00 pm is the finishing time, so the
source should carry an explicit offset `end`. This lets the calendar feed emit a
useful two-hour event and lets the Fixtures page show the complete time range.

## Acceptance criteria

- [x] `src/content/fixtures/st-peters-away-2026-08-28.md` sets
      `end: 2026-08-28T19:00:00+01:00` alongside the existing offset start.
- [x] The generated St Peters away VEVENT emits
      `DTSTART:20260828T160000Z` and `DTEND:20260828T180000Z`.
- [x] The Fixtures page card shows `5:00 pm–7:00 pm` rather than a bare start
      time.
- [x] `npm run check`, `npm run build`, generated-output assertions, and
      repository pre-commit hooks pass.

## Implementation steps

1. Add only the confirmed same-day offset `end` to the St Peters away fixture.
2. Build and inspect the complete generated VEVENT and fixture card for the
   corrected end time and range.
3. Confirm fixture identity, ordering, and the distinct St Peters home fixture
   remain unchanged.
4. Run type-check, build, audit, diff, and exact-file pre-commit validation.

## Files expected to change

- `src/content/fixtures/st-peters-away-2026-08-28.md`
- `docs/plan/issues/115_add_st_peters_finish_time.md`

No schema, formatter, calendar generator, component, dependency, workflow,
other fixture, or deployment file is expected to change.

## Validation

- Failure-shaped baseline: build `origin/main` and confirm the St Peters away
  VEVENT has `DTSTART:20260828T160000Z` with no `DTEND`, while the Fixtures page
  card shows only `5:00 pm`.
- Run `npm run check` and `npm run build` after implementation.
- Parse the friendly's complete VEVENT and require the exact UTC start and end,
  unchanged UID, summary, and description, and no date-valued properties.
- Inspect generated Fixtures HTML and require `Fri, 28 Aug 2026, 5:00 pm–7:00
  pm`, Match/Away presentation, and the retained pre-season note.
- Confirm the fixture still sorts after August training and before Llandaff
  North, and that the existing 1 November St Peters home fixture is unchanged.
- Run `npm audit --omit=dev`, `git diff --check`, and exact-file repository
  pre-commit hooks.

## Risks and open questions

- 28 August is within British Summer Time, so 7:00 pm is represented by
  `19:00:00+01:00` and emitted as 6:00 pm UTC.
- The confirmed finish is two hours after the existing start. The source schema
  and both output paths already support this same-day timed range.
- The issue's provisional example used 6:00 pm only while the finish was still
  unknown; the user's current 7:00 pm confirmation is authoritative.
- No follow-up issues, deployment, merge, or manual issue closure were
  requested. The workflow stops with an open PR.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Add an offset end matching the confirmed finish time | Implement in this PR | Exact fixture source assertion |
| User confirmed 7:00 pm as the finish on 2026-08-23 | Implement in this PR | `19:00:00+01:00` source and rendered range |
| Keep the existing 5:00 pm start | Validate without a change | Source and UTC `DTSTART` assertions |
| Generated VEVENT emits a timed `DTEND` | Implement and validate | Complete VEVENT parsing |
| Fixtures card shows a time range | Implement through fixture data and validate | Built HTML card assertion |
| Suggested 6:00 pm provisional example | Not applicable | Superseded by the user's confirmed 7:00 pm finish |
| Calendar clients receive a usefully sized event | Validate in this PR | Two-hour UTC start/end interval |
| `npm run check`, `npm run build`, and pre-commit hooks | Validate in this PR | Recorded command results |
| PR #113 and issues #75/#71 provenance | Validate without a change | Existing fixture and completed plans establish the current start and identity |
| Schema, formatter, generator, components, other fixtures, dependencies, workflows, deploy | Intentionally out of scope | Exact changed-file gate |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue was fetched on 2026-08-23 and remains open. Its context,
  affected paths, reproduction, provisional suggested fix, acceptance criteria,
  and references are all represented in Issue traceability, together with the
  user's newly confirmed 7:00 pm finish.
- The fixture schema already accepts optional offset `end` timestamps. The
  calendar generator emits a timed UTC `DTEND` when one is present, while the
  page formatter displays the same-day end as a time range. No shared-code
  change is needed.
- The analogous fixture sweep covered every fixture with an explicit end,
  timed matches, the St Peters home/away pair, the formatter, and the calendar
  generator. The requested two-hour range matches existing same-day timed
  fixture patterns; all other entries are intentionally different records.
- The failure-shaped baseline reproduced the exact current gap: the complete
  St Peters away VEVENT has the expected timed `DTSTART` but no `DTEND`, and
  the generated card shows only `5:00 pm`.
- Validation covers the corrected feed and page success paths, negative
  date-valued output, identity, ordering, unchanged related fixture, and exact
  file scope. No unresolved blocker remains.

## Implementation validation

- Phase 3.5 found exactly the two planned paths: the St Peters away fixture
  and this plan. No schema, formatter, generator, component, dependency,
  workflow, other fixture, or deployment file changed.
- The failure-shaped baseline build reproduced the original timed VEVENT with
  `DTSTART:20260828T160000Z` and no `DTEND`, while the card showed only `Fri,
  28 Aug 2026, 5:00 pm`.
- `npm ci` installed 267 packages and reported zero vulnerabilities. It emitted
  the existing environment-level allow-scripts advisory for `esbuild` and
  `fsevents` but no install failure or tracked-file change.
- `npm run check` passed across 19 files with zero errors, warnings, or hints.
- `npm run build` passed and generated six pages plus `fixtures.ics`.
- Exact source assertions require the existing `17:00:00+01:00` start and the
  confirmed `19:00:00+01:00` end.
- The complete generated VEVENT has `DTSTART:20260828T160000Z`,
  `DTEND:20260828T180000Z`, the unchanged UID, summary, and description, and no
  date-valued property.
- The generated Fixtures card retains Match/Away presentation and the
  pre-season note, and displays `Fri, 28 Aug 2026, 5:00 pm–7:00 pm`. Ordering
  remains August Sunday training, St Peters away, then Llandaff North.
- The existing 1 November St Peters home source matches `origin/main`
  byte-for-byte, and the feed still contains exactly two St Peters events.
- `npm audit --omit=dev`, generated-output assertions, and `git diff --check`
  passed.
- Every configured repository pre-commit hook passed against the exact staged
  fixture and plan paths, including Markdown lint and gitleaks, without
  modifying files.

## Branch review

**Classification:** Code-relevant fixture content because the Markdown record
changes generated site and calendar behavior; the plan is non-executable
documentation.

**Review iteration 1:** Approved with no blocking or non-blocking finding.

- The live issue was re-fetched on 2026-08-23 and remains open and unchanged.
  Its complete context, affected paths, failure scenario, provisional example,
  acceptance criteria, and references remain dispositioned by Issue
  traceability together with the user's authoritative 7:00 pm confirmation.
- The repository has no `docs/pre-pr-branch-review.md`. The named
  `differential-review` and Trail of Bits specialist skills are unavailable in
  this session, so the concrete manual fallback inspected the complete diff,
  fixture schema, calendar generator, page formatter, every explicit timed end,
  both St Peters fixtures, and complete generated event/card output.
- The new value is after the start, uses the correct August BST offset, and
  produces the expected two-hour UTC interval and same-day rendered range.
- The final analogous-pattern sweep found that every existing timed fixture
  with an end uses the same offset timestamp shape. Other fixture durations and
  all-day records are intentionally different events and need no change.
- Failure, success, and negative paths pass: the baseline reproduced the
  missing end; corrected feed/card output has the exact 7:00 pm finish; no
  date-valued output, identity change, related-fixture change, or ordering
  regression remains.
- Neither changed Markdown file contains an executable Bash or shell fence, so
  complete-file executable-fence validation is not applicable.
- Phase 4.5 produced no follow-up idea, so no additional issue or PR-body item
  is needed.

## Post-PR verification

**Implementation head reviewed:**
`80fc621abfca20e0089364c45cf5160361fb3a65`

**Outcome:** Passed independently with no blocking or non-blocking finding.

The local commit, fetched remote branch, and GitHub PR #125 head matched before
the independent review. This evidence update is inspected separately after it
is committed, and the final PR head is stored in the mutable PR body to avoid a
tracked-file/SHA loop.

| Criterion or issue statement | Independent evidence | Result |
| --- | --- | --- |
| Confirmed finish is 7:00 pm on 28 August 2026 | Exact source uses `2026-08-28T19:00:00+01:00` | Pass |
| Existing 5:00 pm start remains | Exact source and fresh VEVENT retain `17:00:00+01:00` / `DTSTART:20260828T160000Z` | Pass |
| Calendar emits a timed end | Fresh complete-event parsing found `DTEND:20260828T180000Z` exactly once | Pass |
| Event has the confirmed two-hour duration | Independent date arithmetic found exactly 7,200,000 milliseconds between source start and end | Pass |
| Fixtures page shows the full range | Fresh card extraction found `Fri, 28 Aug 2026, 5:00 pm–7:00 pm` | Pass |
| Identity and pre-season presentation remain | Fresh VEVENT/card assertions retain UID, summary, description, Match/Away chips, and note | Pass |
| Timed output is not accidentally all-day | Complete VEVENT contains no `VALUE=DATE` property | Pass |
| Ordering remains stable | Fresh HTML indices place August Sunday training before St Peters and Llandaff North after it | Pass |
| Existing St Peters home fixture stays distinct | Source matches `origin/main`; fresh feed contains exactly two St Peters events | Pass |
| Scope matches issue #115 | GitHub reports only the fixture and this plan; no shared code, other fixture, dependency, workflow, or deploy file changed | Pass |
| Check, build, audit, and hooks pass | Fresh clean install, Astro check/build, production audit, generated assertions, diff check, and exact-range hooks passed | Pass |
| Hosted repository checks pass | `Assign PR to denhamparry` and `Check, build, and audit` completed successfully | Pass |
| Closing linkage is configured | GitHub resolves the stored `Closes #115` line to issue #115 | Pass |
| Deployment remains out of scope | Plan has `deploy: no`; PR changes no deployment file | Pass |
