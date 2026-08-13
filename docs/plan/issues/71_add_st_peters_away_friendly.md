---
status: In Progress
issue: 71
issue_url: https://github.com/denhamparry/squirrelsteam/issues/71
branch: denhamparry.co.uk/feat/gh-issue-071
deploy: no
---

# Plan: Add St Peters away pre-season friendly

## Problem

The 28 August 2026 away friendly against St Peters is not present in the
fixture content, so subscribed calendars, the Fixtures page, and the home-page
"Next up" list omit the final match before the 2026/27 season begins.

## Acceptance criteria

- [x] The generated `fixtures.ics` feed contains an all-day St Peters away
      friendly on 28 August 2026, including the supplied note.
- [x] The Fixtures page shows the friendly under Upcoming with `Match` and
      `Away` chips, `Fri 28 Aug 2026`, and the supplied note.
- [x] The friendly sorts after the August training entries and before the
      5 September Llandaff North fixture, and appears in the home-page
      `Next up` list.
- [x] `npm run check`, `npm run build`, generated-output assertions, and the
      repository pre-commit hooks pass.

## Implementation steps

1. Add the requested fixture content with a date-only start, `allDay: true`,
   `home: false`, and no location or Cup flag.
2. Build the site and inspect the complete generated VEVENT, Fixtures page,
   and home page for content, chips, date, note, and ordering.
3. Verify the existing 1 November home fixture is unchanged and remains a
   distinct event.
4. Run type-check, build, diff, and exact-file pre-commit validation.

## Files expected to change

- `src/content/fixtures/st-peters-away-2026-08-28.md`
- `docs/plan/issues/71_add_st_peters_away_friendly.md`

No schema, component, library, dependency, workflow, or existing fixture file
is expected to change.

## Validation

- Failure-shaped baseline: build `origin/main` and confirm the St Peters away
  friendly and `20260828` are absent from `dist/fixtures.ics`, the Fixtures
  HTML, and the home-page HTML.
- Run `npm run check` and `npm run build`.
- Parse the friendly's VEVENT from `dist/fixtures.ics` and assert its all-day
  `DTSTART`, exclusive `DTEND`, summary, description, and absence of location.
- Inspect generated HTML for the requested title, `Match` / `Away` chips, date,
  note, and ordering relative to August training and Llandaff North.
- Confirm the home page contains the friendly in its three-item `Next up` list.
- Compare `st-peters-home-2026-11-01.md` with `origin/main` byte-for-byte.
- Run `git diff --check` and exact-file pre-commit hooks.

## Risks and open questions

- A time must not be invented while kick-off is TBC. The date-only all-day
  representation is intentionally temporary.
- Adding `location` or `cup: true` would contradict the issue and existing away
  fixture conventions.
- The existing 1 November St Peters home league fixture must remain unchanged.
- No deployment is requested. The workflow stops with an open PR.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Add the named fixture content file and supplied text | Implement in this PR | New Markdown fixture matches the issue payload |
| All-day event on 28 August while kick-off is TBC | Implement and validate in this PR | Date-only source plus generated `VALUE=DATE` fields |
| Standard Match and Away chips; no Cup chip | Implement and validate in this PR | `type: match`, `home: false`, default `cup: false`, built HTML |
| No location, matching other away fixtures | Implement and validate in this PR | Omitted source field and absent ICS `LOCATION` |
| Fixtures page date and note | Implement and validate in this PR | Built Fixtures HTML assertions |
| Sort between August training and 5 September opener | Validate without another change | Content-collection sort and generated HTML order |
| Appear in home-page Next up | Validate without another change | Built home-page list assertion |
| Existing 1 November home fixture remains distinct | Validate without a change | Source comparison and two generated St Peters events |
| Convert to a timed entry when coaches confirm kick-off | Non-blocking follow-up | PR body follow-up idea; no issue created by default |
| Schema, component, or new chip changes | Intentionally out of scope | Two-file data-and-plan diff |
| Deployment | Intentionally out of scope | `deploy: no` and open-PR handoff |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue was fetched on 2026-08-13 and every scope statement,
  acceptance criterion, named file, conditional time update, and explicit
  exclusion is represented in Issue traceability.
- The failure-shaped baseline passed: the current `origin/main` build contains
  neither the requested event nor its date in the feed, Fixtures HTML, or home
  HTML.
- The existing schema accepts all requested fields and defaults `cup` to false;
  `getFixtures()` sorts by start time; the shared fixture renderer derives the
  Match/Away chips, all-day date, and note; and the calendar generator emits
  exclusive all-day end dates and Markdown-body descriptions.
- The analogous fixture sweep covered every away match, all all-day matches,
  the Cardiff Arms Park timed pattern, and the existing St Peters home record.
  Away league fixtures omit locations, all league fixtures with unknown times
  use the same date-only/all-day shape, and the 1 November home record is
  intentionally different.
- A content-only record is therefore sufficient. Generated-output assertions
  exercise the absent baseline, corrected feed/page behavior, ordering,
  distinct home fixture, and negative location/Cup paths.

## Implementation validation

- Failure-shaped baseline passed: the `origin/main` build omitted the friendly
  and `20260828` from the feed, Fixtures HTML, and home HTML.
- `npm run check` passed with 19 files and zero errors, warnings, or hints.
- `npm run build` passed and generated all six pages plus `fixtures.ics`.
- A Node assertion parsed the friendly VEVENT and verified
  `DTSTART;VALUE=DATE:20260828`, exclusive `DTEND;VALUE=DATE:20260829`, the
  exact summary and description, and no `LOCATION` field.
- Generated Fixtures HTML contains the Match and Away chips, standard rendered
  date `Fri, 28 Aug 2026`, and exact note, with no Cup chip. The comma is the
  existing site-wide `en-GB` formatter punctuation; the issue's data-only scope
  deliberately leaves that formatter unchanged.
- Generated ordering is August Sunday training, the friendly, then Llandaff
  North. The home page contains the friendly in the third `Next up` slot.
- The feed contains exactly two distinct St Peters events, and the existing
  home fixture matches `origin/main` byte-for-byte.
- `git diff --check` passed.
- Repository pre-commit hooks passed against the exact two-file staged set,
  including markdownlint and gitleaks.

## Branch review

**Classification:** Code-relevant fixture content because the new Markdown
record changes generated site and calendar behavior; the plan itself is
non-executable documentation.

**Review iteration 1:** Approved with no blocking finding.

- The live issue was re-fetched on 2026-08-13 and remains open and unchanged.
  Its full scope, conditions, exclusions, acceptance criteria, and follow-up
  are still represented in Issue traceability.
- Phase 3.5 found exactly the two planned untracked paths and no committed or
  unrelated worktree changes. The existing St Peters home fixture has no diff.
- `differential-review` and Trail of Bits specialist skills are unavailable in
  this Codex session. The concrete manual fallback inspected the complete new
  fixture and plan, content schema, sort/query helpers, fixture card renderer,
  ICS generator, both generated pages, the generated VEVENT, every away and
  all-day fixture shape, and both St Peters events.
- The final analogous-pattern sweep confirms every ordinary away league fixture
  omits `location` and uses the same all-day representation while its time is
  unknown. The timed Cardiff Arms Park fixture remains the correct future
  conversion pattern. No adjacent fixture needs a current change.
- Negative paths pass: the friendly has no Cup chip or ICS location, no schema
  or component changed, the existing home fixture is unchanged, and Llandaff
  North remains immediately after the friendly.
- Neither changed Markdown file contains a Bash or shell fence, so executable
  fence validation is not applicable.
- `npm audit` and `npm audit --omit=dev` report a newly disclosed high-severity
  transitive `nanoid` advisory in the existing Astro/Vite/PostCSS dependency
  chain. The lockfile is unchanged by this branch and no matching GitHub issue
  exists, so this is a non-blocking dependency follow-up rather than scope for
  the fixture PR.

## Follow-up ideas

- When coaches confirm kick-off, replace the date-only start with an offset
  timestamp and remove `allDay`, following the Cardiff Arms Park fixture.
- Update the existing transitive `nanoid` 3.3.16 resolution to 3.3.17 or newer
  in a separately reviewed dependency PR to clear GHSA-2v37-7h3g-55p8.
