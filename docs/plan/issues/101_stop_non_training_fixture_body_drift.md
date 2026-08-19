---
status: In Progress
issues:
  - 101
issue_urls:
  - https://github.com/denhamparry/squirrelsteam/issues/101
branch: denhamparry.co.uk/fix/gh-issue-101
deploy: no
---

# Plan: Stop non-training fixture body drift

## Problem

Fixture Markdown bodies flow unchanged into generated ICS `DESCRIPTION`
properties. The South of France tour body repeats the destination already owned
by `title` and `location`, so a destination edit can leave stale prose in an
otherwise-updated calendar event. Issue #101 also names the Cardiff Arms Park
match, but current `origin/main` has already removed that redundant body through
issue #106 and PR #108; its generated description is now the schedule-neutral
opponent fallback.

## Acceptance criteria

- [ ] Changing `start`, `end`, or `location` in
      `tour-south-of-france.md` leaves no contradictory prose in its generated
      ICS event.
- [ ] Changing `start`, `end`, or `location` in
      `cardiff-arms-park-2026-12-06.md` leaves no contradictory prose in its
      generated ICS event.
- [ ] `npm run check`, `npm run build`, and repository pre-commit hooks pass.

## Implementation steps

1. Remove the tour body sentence so its title, dates, and destination remain
   owned only by structured frontmatter.
2. Leave the already-correct Cardiff source unchanged and verify that its
   existing opponent fallback remains useful and schedule-neutral.
3. Build and inspect both complete VEVENTs, then run temporary, restored
   mutations of their structured schedule/location fields to prove their
   descriptions cannot drift.
4. Sweep every fixture body for the same frontmatter-restatement pattern and
   classify any credible adjacent occurrence without expanding this PR.
5. Run repository validation and exact-file staging gates.

## Files expected to change

- `src/content/fixtures/tour-south-of-france.md`
- `docs/plan/issues/101_stop_non_training_fixture_body_drift.md`

The Cardiff fixture is an issue-named validation target but is not expected to
change because its redundant body has already been removed. No component,
collection schema, selector, ICS generator, dependency, workflow, style, or
deployment file is expected to change.

## Validation

- Failure-shaped baseline: build current `origin/main`, temporarily change the
  tour `location`, and confirm the structured `LOCATION` moves while the body-
  sourced `DESCRIPTION` still names South of France; restore the source.
- Run `npm run check` and `npm run build` after implementation.
- Extract the complete tour VEVENT and require its title, inclusive all-day
  start/end representation, and escaped location, with no stale body-derived
  description.
- Extract the complete Cardiff VEVENT and require its current start, end,
  title, location, and synthesized `DESCRIPTION:vs Guildfordians RFC`.
- Temporarily change both records' `start`, `end`, and `location`; rebuild and
  require all structured properties to move while the tour has no contradictory
  description and Cardiff retains only its schedule-neutral opponent fallback;
  restore both records and rebuild.
- Enumerate every fixture body and search for destination, venue, date,
  weekday, and time facts duplicated from frontmatter.
- Run `npm audit --omit=dev`, `git diff --check`, and repository pre-commit hooks
  against the exact staged path set.

## Risks and open questions

- Removing the tour body produces no `DESCRIPTION` because the existing ICS
  fallback applies only to matches with an opponent. The removed sentence adds
  no information beyond the title and location, so omitting it is preferable to
  inventing editorial context.
- The Cardiff record has already been corrected on `origin/main` by issue #106.
  Re-editing it would create churn; direct and mutation-based validation covers
  issue #101's Cardiff requirement without a source change.
- `start` and `end` were never restated in the tour body, but mutation evidence
  will cover them because the acceptance criterion names them explicitly.
- The analogous sweep must distinguish genuine structured-data restatements
  from unique editorial notes such as cup round context or an unknown kick-off.
- No follow-up issues, deployment, merge, or manual issue closure were
  requested. The workflow stops with one open PR closing issue #101.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Tour body repeats destination owned by title/location | Implement in this PR | Remove the body and verify generated VEVENT |
| Cardiff body repeats venue and kick-off | Validated without a new change | Current source has no body; PR #108/issue #106 supplied the fix |
| Changing tour `start`, `end`, or `location` leaves no contradictory DESCRIPTION | Implement and validate | Restored multi-field mutation and complete VEVENT assertion |
| Changing Cardiff `start`, `end`, or `location` leaves no contradictory DESCRIPTION | Validate existing behavior | Restored multi-field mutation retains only opponent fallback |
| Rewrite both bodies with schedule-neutral context | Apply the narrow safe variant | Remove the redundant tour sentence; preserve already-removed Cardiff body |
| Alternatively document venue/kick-off prose as acceptable | Not applicable | Redundant schedule prose is not retained |
| Sweep future fixture bodies for the same pattern | Validate in this PR | Exhaustive current fixture-body inventory and classification |
| `npm run check`, `npm run build`, and pre-commit hooks | Validate in this PR | Recorded command results |
| References to PR #100 and issues #95-#97 | Context only | Live issue and merged PR history inspected |
| Components, schema, selectors, ICS generator, dependencies, workflows, styles, deploy | Intentionally out of scope | Exact changed-file gate |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue was fetched on 2026-08-19 and remains open. Its full context,
  two affected paths, reproduction, suggested alternatives, acceptance
  criteria, references, and future-body sweep are represented in Issue
  traceability.
- Fresh `origin/main` inspection showed that issue #106 and PR #108 already
  removed the Cardiff body after issue #101 was filed. Its current generated
  VEVENT retains the structured start, end, summary, and location plus the
  existing schedule-neutral `DESCRIPTION:vs Guildfordians RFC` fallback.
- The failure-shaped tour baseline passed. Changing the tour title and location
  to `Verification Coast` moved `SUMMARY` and `LOCATION`, while the unchanged
  body still generated `DESCRIPTION:End-of-season tour to the South of France.`
  The temporary edit was restored exactly.
- The analogous sweep enumerated every non-empty body across all fixture
  records. The cup round notes, two neutral training notes, Whitchurch query,
  and St Peters `Kick-off time TBC` note add information not represented by
  their current frontmatter. Only the tour body duplicates a current structured
  destination; Cardiff is already corrected.
- Removing the tour body follows the accepted Cardiff precedent and avoids
  fabricating new editorial context. The tour's title, inclusive dates, and
  location remain independently represented by frontmatter and generated ICS
  properties.
- Validation covers the original stale-description failure, the corrected
  behavior for both named records, negative/no-op behavior for body fallbacks,
  complete source sweep, restored state, and repository gates. No unresolved
  blocker remains.

## Implementation validation

- Phase 3.5 found exactly the two planned paths: the tour fixture and this plan.
  The issue-named Cardiff fixture is unchanged from `origin/main`; no component,
  schema, selector, generator, dependency, workflow, style, or deployment file
  changed.
- `npm ci` installed the locked dependency tree. `npm run check` passed across
  19 files with zero errors, warnings, or hints, and `npm run build` generated
  six pages plus `fixtures.ics`.
- The final tour VEVENT retains `DTSTART;VALUE=DATE:20270501`, exclusive
  `DTEND;VALUE=DATE:20270505`, its summary, and its location, with no
  `DESCRIPTION` property sourced from duplicate prose.
- The final Cardiff VEVENT retains its exact UTC start/end, summary, escaped
  location, and schedule-neutral `DESCRIPTION:vs Guildfordians RFC`.
- A restored combined mutation moved the tour to 5-9 June at Verification
  Coast and the Cardiff match to 14:00-15:30 at Verification Stadium. Every
  structured VEVENT property moved as expected, the tour remained free of a
  body-derived description, and Cardiff retained only its opponent fallback.
- All temporary fixture mutations were reversed through explicit patches. A
  final clean build returned the committed dates, titles, and locations.
- The complete body inventory contains seven remaining notes: three cup-round
  notes, two schedule-neutral training notes, one TBC kick-off note, and one
  Whitchurch team query. None duplicates a current structured destination,
  venue, day, date, or known time.
- `npm audit --omit=dev` reported zero production vulnerabilities and
  `git diff --check` passed.
- Exact-path staging contained only the two planned files. All configured
  pre-commit hooks passed against the staged content without modifying files.

## Branch review

**Classification:** Code-relevant fixture content because the changed Markdown
is compiled into user-visible cards and an executable calendar feed.

**Review iteration 1:** Approved with no blocking or non-blocking finding.

- The live issue was re-fetched on 2026-08-19 and remains open and unchanged.
  Its complete contents remain dispositioned in Issue traceability.
- The repository has no `docs/pre-pr-branch-review.md`. The named
  `differential-review` and Trail of Bits specialist skills are unavailable in
  this session, so the concrete manual fallback inspected the complete diff,
  both issue-named fixtures, every fixture body, the collection schema, shared
  fixture loader/formatters, both card consumers, and the complete ICS summary
  and description paths.
- Removing the tour body cannot create an empty note wrapper because
  `FixtureItem.astro` checks trimmed body content before rendering notes. The
  ICS builder similarly omits `DESCRIPTION` for a bodyless tour while retaining
  all structured properties.
- The final analogous sweep found no other body that duplicates current
  structured destination, venue, day, date, or known-time data. Cardiff remains
  intentionally different because its match/opponent fallback supplies a
  useful neutral description.
- Both changed Markdown files contain zero `bash` or `sh` fences, so
  complete-file executable-fence validation is not applicable.
- Failure, success, restored-state, negative-description, exact-scope, Astro,
  audit, and whitespace evidence all pass. No unrelated refactor or follow-up
  idea was found.

## Post-PR verification

Pending.
