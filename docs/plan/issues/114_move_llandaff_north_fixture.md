---
status: Complete
issue: 114
issue_url: https://github.com/denhamparry/squirrelsteam/issues/114
branch: denhamparry.co.uk/fix/gh-issue-075
pr: 113
deploy: no
---

# Plan: Move the Llandaff North away fixture to 6 September

## Problem

The Llandaff North away fixture is stored and rendered on Saturday 5 September
2026, but it should be on Sunday 6 September 2026. The source filename embeds
the stale date, so both its frontmatter and slug-derived calendar UID need to
move together. The user explicitly requested that this related fixture fix be
added to the already-open issue #75 PR #113 rather than creating another PR.

## Acceptance criteria

- [x] Rename `src/content/fixtures/llandaff-north-away-2026-09-05.md` to
      `src/content/fixtures/llandaff-north-away-2026-09-06.md`.
- [x] Set the renamed fixture's frontmatter start to `2026-09-06` while
      retaining its all-day, away-match identity.
- [x] The generated Fixtures page shows the fixture on Sunday 6 September 2026.
- [x] `fixtures.ics` emits `DTSTART;VALUE=DATE:20260906` and exclusive
      `DTEND;VALUE=DATE:20260907` under the renamed UID, with no old UID/event.
- [x] `npm run check`, `npm run build`, generated-output assertions, and
      repository pre-commit hooks pass.
- [x] PR #113 closes both issues #75 and #114 and independently re-verifies
      both fixes at its expanded final head.

## Implementation steps

1. Rename the Llandaff North fixture to the corrected date-bearing filename and
   update only its date-only `start` value.
2. Build and inspect the complete generated VEVENT and fixture card for the new
   date and the absence of the old date/UID.
3. Re-run issue #75's St Peters timed-fixture assertions to prove the added
   change does not regress the existing PR scope.
4. Run type-check, build, audit, diff, exact-file pre-commit, and branch-review
   gates for the expanded PR.
5. Update PR #113's body and both issue plans with independent combined-head
   verification evidence and both closing keywords.

## Files expected to change

Implementation and primary plan:

- `src/content/fixtures/llandaff-north-away-2026-09-05.md` (renamed/deleted)
- `src/content/fixtures/llandaff-north-away-2026-09-06.md` (renamed/added)
- `docs/plan/issues/114_move_llandaff_north_fixture.md`

Post-PR combined-head evidence may also update:

- `docs/plan/issues/75_time_st_peters_away_friendly.md`

No schema, component, library, dependency, workflow, unrelated fixture,
historical plan, or deployment file is expected to change.

## Validation

- Failure-shaped baseline: build the current PR head and confirm the Llandaff
  North VEVENT uses old UID suffix `2026-09-05`, date start `20260905`, and
  exclusive end `20260906`, while the Fixtures card shows Saturday 5 September.
- Assert that 6 September 2026 is Sunday and that the corrected date aligns
  with the documented 26/27 season start in repository guidance.
- Run `npm run check` and `npm run build` after implementation.
- Parse the complete Llandaff North VEVENT and require new UID suffix
  `2026-09-06`, date start `20260906`, exclusive end `20260907`, unchanged
  summary, and no old UID/date event.
- Inspect generated Fixtures HTML and require `Sun, 6 Sept 2026`, unchanged
  Match/Away presentation, and chronological placement after St Peters and
  before Ynysowen.
- Re-run the exact St Peters issue #75 source, VEVENT, card, no-end, and no-TBC
  assertions against the expanded branch.
- Confirm `docs/plan/issues/35_update_2627_fixtures.md` remains unchanged as a
  historical record and no live source outside the renamed fixture retains the
  old filename, date, or UID.
- Run `npm audit --omit=dev`, `git diff --check`, and repository pre-commit
  hooks against the exact changed-file range.

## Risks and open questions

- Renaming the file changes the calendar UID. This is required by issue #114's
  filename criterion and removes the old generated event; validation must prove
  that exactly one corrected event remains.
- The event remains all-day because no kick-off time was supplied. Its RFC 5545
  `DTEND` therefore stays exclusive on the following date.
- Completed plan #35 intentionally documents the earlier source and filename.
  Rewriting it would corrupt historical evidence and is explicitly unnecessary.
- Combining two issues into one PR is an explicit user-directed exception to
  the one-issue/one-PR default. The fixes share the same fixture/calendar
  surface and both must remain independently traceable.
- No follow-up issues, deployment, merge, or manual issue closure were
  requested. The workflow leaves PR #113 open for user-managed review/merge.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Move Llandaff North from Saturday 5 September to Sunday 6 September 2026 | Implement in this PR | Renamed source, frontmatter, card, and VEVENT assertions |
| Rename the old date-bearing fixture filename | Implement in this PR | Git rename from `...09-05.md` to `...09-06.md` |
| Set `start: 2026-09-06` | Implement in this PR | Exact source assertion |
| Fixtures page lists Sunday 6 September | Validate in this PR | Built card extraction |
| Calendar emits all-day start `20260906` and exclusive end `20260907` | Validate in this PR | Complete VEVENT parsing |
| Remove the old slug/UID event | Validate in this PR | Generated feed uniqueness and negative assertions |
| Keep all-day/away-match identity | Validate without another change | Source and Match/Away card fields |
| `npm run build`, `npm run check`, and pre-commit hooks pass | Validate in this PR | Recorded fresh command results |
| Plan #35 is historical and need not change | Intentionally unchanged | Byte-for-byte comparison with current PR parent |
| No other source file references the old date or slug | Validate without another change | Hidden-inclusive source sweep |
| Align with documented Sunday 6 September season start | Validate without guidance change | `CLAUDE.md` and calendar-day assertion |
| Part of epic #10 | Context only | PR links and closes issue #114; no epic mutation needed |
| Add issue #114 to existing PR #113 | Implement as explicitly requested | Expanded branch diff, PR body, and closing references for #75/#114 |
| Schema, components, libraries, dependencies, workflows, unrelated fixtures, deploy | Intentionally out of scope | Exact changed-file gate |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue was fetched on 2026-08-23 and remains open. Its summary,
  current/desired states, every acceptance criterion, historical-plan note,
  source-reference claim, and epic context are represented in Issue
  traceability.
- Repository guidance states that the 26/27 season begins Sunday 6 September
  2026, and a calendar-day assertion confirms the corrected date is Sunday.
- The fixture collection derives entry IDs from filenames, sorts by parsed
  start, formats all-day dates in UTC, and emits exclusive all-day ends. A
  focused source rename plus date edit is sufficient; no shared-code change is
  needed.
- The analogous sweep covered every date-bearing fixture filename, all all-day
  match records, the collection schema, page formatter, ICS generator, and all
  old-date/slug occurrences. Only the named live fixture needs correction.
  References in completed plans #35 and #71 are historical evidence, while
  generic Llandaff North examples in `README.md` contain no stale date or slug.
- Validation covers the original wrong-day event, corrected new event,
  old-UID/date removal, ordering, unchanged all-day/away semantics, issue #75
  regression paths, exact scope, and both PR closing links. No unresolved
  blocker remains.

## Implementation validation

- Phase 3.5 found the three planned issue #114 paths: the old fixture deletion,
  corrected fixture addition, and this plan. Against `origin/main`, the
  expanded PR also contains exactly issue #75's existing fixture and plan; no
  unrelated path is present.
- The failure-shaped baseline build reproduced the old filename-derived UID,
  `DTSTART;VALUE=DATE:20260905`, exclusive `DTEND;VALUE=DATE:20260906`, and
  `Sat, 5 Sept 2026` card.
- `npm ci` installed 267 packages and reported zero vulnerabilities. It emitted
  the existing environment-level allow-scripts advisory for `esbuild` and
  `fsevents` but no install failure or tracked-file change.
- `npm run check` passed across 19 files with zero errors, warnings, or hints.
- `npm run build` passed and generated six pages plus `fixtures.ics`.
- Exact source assertions confirm that the old path is absent and the renamed
  file retains its title, Match/Away fields, and all-day flag with only the
  start date changed to `2026-09-06`. A calendar-day assertion confirms the
  corrected date is Sunday.
- The generated VEVENT has the new `...2026-09-06` UID, date start `20260906`,
  exclusive end `20260907`, and unchanged summary. The old UID/date event is
  absent and the corrected event occurs exactly once.
- The generated Fixtures card retains Match/Away presentation and displays
  `Sun, 6 Sept 2026`. Ordering is St Peters, Llandaff North, then Ynysowen.
- The first custom order probe used an incorrect Ynysowen title suffix and
  failed to find its comparison marker. Direct generated-output inspection
  identified the exact existing title; the corrected assertion then passed.
  No implementation change was needed for this validation-script mistake.
- Issue #75's exact 5:00 pm source, timed VEVENT, card, no-end, no-all-day, and
  no-TBC assertions pass unchanged on the expanded branch.
- Completed plan #35 matches the published PR parent byte-for-byte. A live
  source sweep finds no old Llandaff North filename, date, or UID. Historical
  plan references remain intentionally unchanged.
- `npm audit --omit=dev` and `git diff --check` pass.
- The first exact-path staging assertion expected Git `--name-only` to list
  both sides of a detected rename, but Git correctly lists only its destination.
  The corrected gate requires the exact added plan plus the `R083` old/new
  name-status record. A redundant attempt to re-add the already staged deleted
  path then reported that the path no longer exists; it did not alter the
  stable staged rename.
- Every configured repository pre-commit hook passed twice against the exact
  added-plan and detected-rename staged content, including Markdown lint and
  gitleaks, without modifying files.

## Branch review

**Classification:** Code-relevant fixture content because the Markdown rename
changes generated page and calendar behavior; both plans are non-executable
documentation.

**Review iteration 1:** Approved with no blocking or non-blocking finding.

- Live issues #75 and #114 were re-fetched on 2026-08-23 and remain open and
  unchanged. Issue #114's complete body remains dispositioned by Issue
  traceability, and issue #75's existing completed plan remains applicable.
- The repository has no `docs/pre-pr-branch-review.md`. The named
  `differential-review` and Trail of Bits specialist skills are unavailable in
  this session, so the concrete manual fallback inspected the expanded diff,
  fixture schema, filename-derived IDs, page formatter, ICS generator, every
  all-day match shape, all old-date/slug references, surrounding fixtures, and
  complete generated events/cards for both issues.
- The rename deliberately changes only Llandaff North's slug-derived UID and
  date. All-day and away semantics are preserved, and the next-day `DTEND`
  remains the RFC-required exclusive boundary.
- The final analogous-pattern sweep confirms all other all-day matches retain
  date-aligned filenames and intentionally different dates. Only historical
  plans retain the old Llandaff North date/slug; no live source does.
- Failure, success, and negative paths pass for issue #114, while the full
  issue #75 source/feed/card regression suite also passes on the expanded
  branch. No shared code, unrelated content, or deployment behavior changed.
- Neither changed plan contains an executable Bash or shell fence, so
  complete-file executable-fence validation is not applicable.
- Phase 4.5 produced no follow-up idea, so no new issue or PR-body follow-up is
  needed.

## Post-PR verification

**Expanded implementation head reviewed:**
`a8c6a9386262e21f54c5e497cac14de62db82d98`

**Outcome:** Passed independently with no blocking or non-blocking finding.

The local commit, fetched remote branch, and GitHub PR #113 head matched before
the combined review. This plan and issue #75's plan receive only evidence
updates afterward; that evidence-only delta is inspected separately, and the
final PR head is stored in the mutable PR body to avoid a tracked-file/SHA loop.

| Criterion or issue statement | Independent evidence | Result |
| --- | --- | --- |
| Llandaff North moves to Sunday 6 September 2026 | Exact source uses `2026-09-06`; a fresh calendar-day assertion identifies it as Sunday | Pass |
| Old filename is renamed to the corrected date | GitHub reports an 83% rename to `llandaff-north-away-2026-09-06.md`; the old path is absent | Pass |
| All-day away-match semantics remain | Exact source retains `type: match`, `allDay: true`, and `home: false`; fresh card retains Match/Away chips | Pass |
| Fixtures page shows Sunday 6 September | Fresh card extraction found `Sun, 6 Sept 2026` and no Saturday 5 September value | Pass |
| Calendar start is 6 September | Fresh complete-event parsing found `DTSTART;VALUE=DATE:20260906` exactly once | Pass |
| Calendar end is the exclusive next date | The same event has `DTEND;VALUE=DATE:20260907` | Pass |
| Filename-derived UID is corrected | Feed has exactly one new `...2026-09-06` UID and no old `...2026-09-05` UID | Pass |
| Identity and ordering remain correct | Summary is unchanged; fresh card indices place St Peters before Llandaff North and Ynysowen after it | Pass |
| No stale live source reference remains | Hidden-inclusive `src/` sweep found no old filename, date, or UID | Pass |
| Historical plan #35 remains unchanged | Fresh byte-for-byte comparison with `origin/main` passed | Pass |
| Issue #75 remains correct on the expanded head | Exact 5:00 pm source, timed event, no-end/all-day/TBC paths, card, uniqueness, and ordering assertions passed | Pass |
| Check, build, audit, and hooks pass | Fresh clean install, Astro check/build, production audit, combined generated assertions, diff check, and exact-range hooks passed | Pass |
| Expanded GitHub scope is exact | PR reports the two issue plans, St Peters edit, and Llandaff North rename only | Pass |
| Closing linkage covers both issues | GitHub resolves stored `Closes #75` and `Closes #114` lines to both live issues | Pass |
| Hosted repository check passes | Final implementation-head `Check, build, and audit` completed successfully | Pass |
| Deployment remains out of scope | Both plans use `deploy: no`; PR changes no deployment file | Pass |
