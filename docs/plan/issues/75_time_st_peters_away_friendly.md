---
status: In Progress
issue: 75
issue_url: https://github.com/denhamparry/squirrelsteam/issues/75
branch: denhamparry.co.uk/fix/gh-issue-075
deploy: no
---

# Plan: Time the St Peters away pre-season friendly

## Problem

The 28 August 2026 away friendly against St Peters is still represented as an
all-day fixture because its kick-off was unknown when it was added. The user
has now confirmed a 5:00 pm kick-off, so subscribed calendars and site fixture
cards should show the timed start instead of an all-day block and TBC note.

## Acceptance criteria

- [x] `src/content/fixtures/st-peters-away-2026-08-28.md` uses the offset start
      `2026-08-28T17:00:00+01:00` and no longer sets `allDay: true`.
- [x] The fixture body no longer says that kick-off is TBC.
- [x] The generated VEVENT emits timed UTC `DTSTART:20260828T160000Z` without
      date-valued start/end fields, and the Fixtures page card shows `5:00 pm`.
- [x] `npm run check`, `npm run build`, generated-output assertions, and
      repository pre-commit hooks pass.

## Implementation steps

1. Replace the date-only start with the confirmed Europe/London offset
   timestamp and remove the all-day flag.
2. Remove only the obsolete TBC sentence from the fixture body while retaining
   the pre-season-friendly description.
3. Build and inspect the complete generated VEVENT and fixture card for the
   corrected timed behavior and the absence of stale all-day/TBC output.
4. Run type-check, build, diff, and exact-file pre-commit validation.

## Files expected to change

- `src/content/fixtures/st-peters-away-2026-08-28.md`
- `docs/plan/issues/75_time_st_peters_away_friendly.md`

No end time has been supplied, so no `end` field will be invented. No schema,
component, library, dependency, workflow, other fixture, or deployment file is
expected to change.

## Validation

- Failure-shaped baseline: build `origin/main` and confirm the St Peters away
  VEVENT uses `DTSTART;VALUE=DATE:20260828` plus exclusive date end, while its
  generated card omits a time and includes `Kick-off time TBC.`
- Run `npm run check` and `npm run build` after implementation.
- Parse the friendly's complete VEVENT and require timed UTC start
  `20260828T160000Z`, its existing identity and description, and no `VALUE=DATE`
  or `DTEND` property.
- Inspect generated Fixtures HTML and require the St Peters card to show
  `Fri, 28 Aug 2026, 5:00 pm`, retain Match/Away presentation, and omit all TBC
  wording.
- Confirm the fixture still sorts after August training and before Llandaff
  North, and that the existing 1 November St Peters home fixture is unchanged.
- Run `git diff --check` and exact-file repository pre-commit hooks.

## Risks and open questions

- 28 August is within British Summer Time, so 5:00 pm in the repository's
  Europe/London display zone is represented by `+01:00` and emitted as 4:00 pm
  UTC in the calendar feed.
- The finish time remains unknown. Omitting `end` matches the issue's
  conditional instruction and avoids inventing a duration.
- The fixture's date, away/pre-season flags, title, and ordering must remain
  unchanged.
- No follow-up issues or deployment were requested. The workflow stops with an
  open PR.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Convert the named St Peters away fixture after kick-off confirmation | Implement in this PR | Focused fixture source diff |
| Confirmed 5:00 pm kick-off supplied by the user on 2026-08-23 | Implement in this PR | Offset `17:00:00+01:00` source and page time |
| Replace date-only `start` with an offset timestamp | Implement and validate | Source assertion plus timed UTC VEVENT |
| Remove `allDay: true` | Implement and validate | Source assertion and absence of date-valued VEVENT fields |
| Remove the TBC body note | Implement in this PR | Source and generated-output negative assertions |
| Add `end` if the finish time is known | Not applicable | No finish time was supplied; omit `end` |
| Fixtures card shows the kick-off time | Validate in this PR | Built HTML card assertion |
| `npm run check`, `npm run build`, and pre-commit hooks | Validate in this PR | Recorded command results |
| Follow the Cardiff Arms Park timed pattern | Implement the timestamp pattern | Offset source parsed through the existing schema and calendar generator |
| PR #72 and issue #71 provenance | Validate without a change | Existing fixture and completed #71 plan establish the original all-day state |
| Schema, components, calendar generator, other fixtures, dependencies, workflows, deploy | Intentionally out of scope | Exact changed-file gate |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue was fetched on 2026-08-23 and remains open. Its context,
  affected path, reproduction, suggested conversion, conditional end field,
  acceptance criteria, and references are all represented in Issue
  traceability, together with the user's newly confirmed 5:00 pm requirement.
- The existing fixture schema coerces offset timestamps to `Date`, shared page
  formatting renders timed fixtures in `Europe/London`, and the calendar
  generator emits non-all-day starts as UTC timestamps. No shared-code change
  is needed.
- The analogous fixture sweep covered the Cardiff Arms Park timed event, every
  date-only/all-day match, both St Peters fixtures, the formatter, and the ICS
  generator. The requested conversion follows the sole established timed-match
  pattern; other all-day fixtures remain intentionally different because their
  times are still unknown.
- Validation covers the original all-day failure, corrected timed success,
  negative all-day/TBC/end paths, chronological ordering, unchanged home
  fixture, and exact file scope. No unresolved blocker remains.

## Implementation validation

- Phase 3.5 found exactly the two planned paths: the St Peters away fixture and
  this plan. No schema, component, library, dependency, workflow, other fixture,
  or deployment file changed.
- The failure-shaped baseline build reproduced the original all-day VEVENT
  (`DTSTART;VALUE=DATE:20260828` and `DTEND;VALUE=DATE:20260829`) and TBC card
  note, with no 5:00 pm display.
- `npm ci` installed 267 packages and reported zero vulnerabilities. It emitted
  the existing environment-level allow-scripts advisory for `esbuild` and
  `fsevents` but no install failure or tracked-file change.
- `npm run check` passed across 19 files with zero errors, warnings, or hints.
- `npm run build` passed and generated six pages plus `fixtures.ics`.
- Fresh source assertions require the exact `17:00:00+01:00` start and confirm
  the absence of `allDay`, `end`, and TBC text.
- The generated VEVENT has `DTSTART:20260828T160000Z`, the unchanged summary,
  and `DESCRIPTION:Pre-season friendly.` It contains no `VALUE=DATE`, `DTEND`,
  or TBC text.
- The generated Fixtures card contains Match/Away chips, `Fri, 28 Aug 2026,
  5:00 pm`, and the retained pre-season note with no TBC text. Ordering remains
  August Sunday training, St Peters away, then Llandaff North.
- The existing 1 November St Peters home source matches `origin/main`
  byte-for-byte. `npm audit --omit=dev` and `git diff --check` also passed.

## Branch review

**Classification:** Code-relevant fixture content because the Markdown record
changes generated site and calendar behavior; the plan is non-executable
documentation.

**Review iteration 1:** Approved with no blocking or non-blocking finding.

- The live issue was re-fetched on 2026-08-23 and remains open and unchanged.
  Its complete context, affected path, reproduction, suggested fix, conditional
  end field, criteria, and references remain represented in Issue traceability.
- The repository has no `docs/pre-pr-branch-review.md`. The named
  `differential-review` and Trail of Bits specialist skills are unavailable in
  this session, so the concrete manual fallback inspected the complete diff,
  fixture schema, date formatter, calendar generator, comparable timed match,
  every timed/all-day fixture shape, both St Peters fixtures, and generated
  card and VEVENT output.
- The confirmed 5:00 pm local time is correctly encoded with the August BST
  offset and becomes 4:00 pm UTC in the feed. Omitting `end` is correct because
  the user supplied no finish time, and the generator already supports a timed
  start without an end.
- The final analogous-pattern sweep found no stale kick-off-TBC text under
  `src/`. Other all-day matches remain intentionally different because their
  kick-off times are not part of issue #75.
- Failure, success, and negative paths pass: the baseline reproduced the
  all-day event; corrected feed/card output is timed; no TBC, all-day field,
  invented end, unrelated fixture change, or ordering regression remains.
- Neither changed Markdown file contains an executable Bash or shell fence, so
  complete-file executable-fence validation is not applicable.
- Phase 4.5 produced no follow-up idea, so no additional issue or PR-body item
  is needed.

## Post-PR verification

Pending PR creation.
