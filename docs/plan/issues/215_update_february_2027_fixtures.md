---
status: Complete
issue: 215
issue_url: https://github.com/denhamparry/squirrelsteam/issues/215
branch: denhamparry.co.uk/fix/gh-issue-215
deploy: no
---

# Plan: Update February 2027 fixtures

## Problem and outcome

The fixtures collection is missing the newly scheduled Llanishen home match at
Cardiff Arms Park on Friday 5 February 2027 and still contains a cancelled
Eastern Community Campus home match on Sunday 7 February. Add the new match as
an all-day event while its kick-off time is unknown, and remove only the
cancelled entry so the Fixtures page and generated calendar agree.

Issue #215 and its empty discussion were fetched on 2026-09-17. Related issue
120 was also fetched that day and remains open; deleting its target fixture makes
its opponent-confirmation work obsolete, so this PR will close it.

## Implementation

1. Add `llanishen-home-2027-02-05.md` with the exact requested title, match,
   home, opponent, Cardiff Arms Park location, date-only start, and all-day
   fields.
2. Delete only `eastern-campus-home-2027-02-07.md`.
3. Build the site and inspect the rendered Fixtures page plus calendar output
   for the added, removed, duplicate-Llanishen, and retained Eastern Community
   Campus entries.

## Files expected to change

- `docs/plan/issues/215_update_february_2027_fixtures.md`
- `src/content/fixtures/llanishen-home-2027-02-05.md` (new)
- `src/content/fixtures/eastern-campus-home-2027-02-07.md` (deleted)

Code, tests, other fixtures, deployment, and merge are out of scope.

## Validation

- Run `npm ci`, `npm run check`, and `npm run build` (Node.js 22+; no local
  service or generated-input prerequisite).
- Inspect `dist/fixtures/index.html` for Llanishen on 5 February as a home game
  at Cardiff Arms Park and confirm 7 February is absent.
- Inspect `dist/fixtures.ics` for an all-day event with
  `DTSTART;VALUE=DATE:20270205`, no event on `20270207`, the intended April
  Llanishen match, and Eastern Community Campus matches on 25 October,
  29 November, 13 December, and 21 February.
- Search the repository outside `docs/plan/` to confirm no other file matches
  `2027-02-07` or references the deleted fixture, and that only the intended
  fixture file was removed.
- Run `git diff --check`, `npm audit --omit=dev`, and all pre-commit hooks on the
  exact staged handoff. Pull-request CI is unfiltered and should schedule its
  check/build/audit job after publication.

## Risks and decisions

- A date-only start plus `allDay: true` deliberately represents the unknown
  kick-off without inventing a time; the schema and April Llanishen fixture
  establish this repository pattern.
- Two Llanishen home fixtures are intentional and differ by both date and
  venue.
- The cancellation must not remove the four other Eastern Community Campus
  home matches; explicit built-output assertions protect them.

## Implementation validation

- `npm ci` installed the locked dependencies and reported zero vulnerabilities.
- `npm run check` passed with zero errors, warnings, or hints.
- `npm run build` generated the production site and calendar successfully.
- Built-output assertions passed for the 5 February all-day VEVENT, rendered
  Friday date, home chip, venue, and opponent; they also proved 7 February is
  absent from both outputs.
- The same assertions preserved the 25 October, 29 November, 13 December, and
  21 February Eastern Community Campus events and the 4 April Llanishen event.
- The repository sweep found no remaining non-plan `2027-02-07` or deleted-file
  references. `git diff --check` passed.

## Branch review

**Classification:** non-code fixture content and planning documentation, low
risk. The repository has no `docs/pre-pr-branch-review.md`; Trail of Bits review
skills were skipped because no code-relevant file changed. Manual review covered
the complete intended file set, exact frontmatter values, content schema,
generated HTML and ICS behavior, issue #120 closure, live issue #215 and its
empty discussion, and adjacent fixture preservation. No blocking issue or
non-blocking follow-up idea remains.

## Issue traceability

| Requirement | Timing / owner / prerequisite | Evidence | Current result |
| --- | --- | --- | --- |
| Add the exact 5 February Llanishen home fixture at Cardiff Arms Park as all-day | Pre-merge / Codex / fixture schema | Source diff, check, rendered page, and ICS assertions | Passed |
| Remove the 7 February Eastern Community Campus fixture and nothing else | Pre-merge / Codex | Diff and repository/built-output searches | Passed |
| Preserve the four named Eastern Community Campus fixtures | Pre-merge / Codex | Source and ICS assertions | Passed |
| Keep both intended Llanishen home matches | Pre-merge / Codex | Source, page, and ICS assertions | Passed |
| Validate with check and build | Pre-merge / Codex | Command exit statuses | Passed |
| Close obsolete issue #120 with this PR | Pre-merge / GitHub after user merge | Standalone PR closing reference and derived metadata | Ready for PR body |
| Replace the all-day event with a timed event when kick-off is confirmed | Future / maintainer / confirmed time | Future fixture update | Intentionally out of scope |
| Deployment and merge | User-managed | Open PR handoff | Intentionally out of scope |

## Plan review

**Overall assessment:** Approved after one review iteration.

The requested fields are supported by `src/content.config.ts`, the all-day
shape matches the existing April Llanishen fixture, and the venue string matches
the existing Cardiff Arms Park fixture. The repository-wide analogous search
found exactly one non-plan `2027-02-07` occurrence and no consumers of its file
name; the four other Eastern Community Campus records are independent entries.
The validation plan covers the original stale date, the corrected date, both
intended Llanishen matches, retained adjacent fixtures, schema/rendering, and
the generated ICS feed. No external service or runtime-state assumption is
needed.
