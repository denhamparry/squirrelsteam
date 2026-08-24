---
status: Complete
issue: 123
issue_url: https://github.com/denhamparry/squirrelsteam/issues/123
branch: denhamparry.co.uk/fix/gh-issue-123
deploy: no
---

# Plan: Surface the Eastern Community Campus 4G pitch

## Problem

The five Eastern Community Campus home fixtures identify the Rumney venue on
the Fixtures page and in `fixtures.ics`, but neither output tells parents that
the games use a 4G pitch. That omission can lead to unsuitable boot choices.
The shared `location` field already feeds both outputs, so the smallest complete
fix is to add the surface there without changing titles, opponents, dates, or
times.

## Acceptance criteria

- [x] All five Eastern Community Campus fixture cards display the 4G surface.
- [x] All five corresponding VEVENT `LOCATION` fields display the 4G surface.
- [x] The five fixtures use one byte-identical location value.
- [x] The confirmed dates, 10:00-12:00 times, and explicit `+00:00` offsets do
      not change.
- [x] The change remains compatible with opponent-confirmation issues
      #117-#121 by leaving each title and optional `opponent` field untouched.
- [x] `npm run check` and `npm run build` pass.

## Implementation steps

1. Change the `location` frontmatter in each of the five named fixture records
   to `Eastern Community Campus (4G), Trowbridge Rd, Rumney, Cardiff CF3 1XZ`.
2. Leave every other frontmatter field and each empty fixture body unchanged.
3. Build the site and assert the exact source, rendered-card, and unfolded
   VEVENT values for all five dates.
4. Prove the dates, start/end times, offsets, titles, opponent state, and file
   scope did not drift.
5. Run the repository's check, build, audit, diff, and pre-commit gates.

## Files expected to change

- `src/content/fixtures/eastern-campus-home-2026-10-25.md`
- `src/content/fixtures/eastern-campus-home-2026-11-29.md`
- `src/content/fixtures/eastern-campus-home-2026-12-13.md`
- `src/content/fixtures/eastern-campus-home-2027-02-07.md`
- `src/content/fixtures/eastern-campus-home-2027-02-21.md`
- `docs/plan/issues/123_surface_4g_eastern_campus.md`

No title, schema, component, library, dependency, workflow, style, deployment,
or unrelated fixture file is expected to change.

## Validation

- Reproduce the baseline failure after `npm ci`, `npm run check`, and
  `npm run build`: all five source records, rendered cards, and VEVENTs contain
  the address, while none of their location values contains `4G`.
- Assert the five complete source records differ from `origin/main` only in the
  exact `location` line, all use the identical new value, and retain the exact
  date-bearing timestamps, `+00:00` offsets, titles, home flags, absent
  `opponent`, and empty bodies.
- Parse the generated Fixtures page and require five occurrences of the exact
  new display value and zero occurrences of the old display value for these
  cards.
- Unfold `dist/fixtures.ics`, isolate all five filename-derived UIDs, and
  require the exact escaped new `LOCATION` plus unchanged UTC `DTSTART`,
  `DTEND`, and `SUMMARY` values.
- Run `npm audit --omit=dev`, `git diff --check`, and pre-commit hooks against
  the exact selectively staged path set.

## Risks and open questions

- Parentheses are appropriate in the location name and require no special ICS
  escaping; the existing generator will still escape the address commas.
- Changing the title would duplicate venue information and collide with the
  title rewrites planned in #117-#121, so the title is intentionally unchanged.
- Adding body prose would contradict the fixture-prose cleanup direction from
  #97/#101, so the body stays empty.
- The content is executable fixture input even though the edit is Markdown;
  review must cover both the page and calendar outputs.
- No deploy, merge, manual issue closure, or new follow-up issue is requested.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Surface 4G for all five Fixtures page entries | Implement in this PR | Exact five-card location assertion |
| Surface 4G for all five ICS events | Implement in this PR | Exact five-VEVENT `LOCATION` assertion |
| Express the detail identically | Implement in this PR | Byte-identical source values and generated counts |
| Preserve confirmed dates | Validated without a change | Source diff and UTC VEVENT assertions |
| Preserve 10:00-12:00 GMT times and `+00:00` offsets | Validated without a change | Source timestamp and VEVENT start/end assertions |
| Remain compatible with #117-#121 | Implement as constrained | Titles and absent `opponent` fields remain unchanged |
| Prefer suggested option 1, extending `location` | Implement in this PR | Five exact `location` line edits |
| Option 2, changing titles | Intentionally out of scope | Title byte-comparison against `origin/main` |
| Option 3, adding body prose | Intentionally out of scope | Empty-body assertions and #97/#101 precedent |
| Affected five fixture paths | Implement in this PR | Exact changed-file gate |
| PR #122 and issue #116 context | Validated without a change | Existing shared location data path remains in use |
| `npm run check` and `npm run build` | Validate in this PR | Recorded command results |
| Components, schema, libraries, dependencies, workflows, styles, deployment | Intentionally out of scope | Exact changed-file gate |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue was fetched on 2026-08-24 and remains open. Every acceptance
  criterion, suggested option, affected path, cited compatibility constraint,
  validation command, and explicitly rejected alternative is dispositioned in
  Issue traceability.
- A clean baseline `npm ci`, `npm run check`, and `npm run build` passed. Astro
  reported zero diagnostics and built six pages plus `fixtures.ics`; the
  production dependency tree reported zero vulnerabilities during install.
- Failure-shaped baseline evidence confirms all five source records, rendered
  cards, and VEVENTs have the full address, while zero location values surface
  `4G`. The first assertion incorrectly assumed Astro retained `.md` in the
  generated UID; inspection showed the live generator uses the extensionless
  entry ID, and the corrected complete-event assertion passed.
- The analogous-pattern sweep covered every fixture `location`, the schema,
  collection loading and sorting, `FixtureItem`, the Fixtures page, the Home
  page's shared Next up cards, and the complete ICS generator. `location` is
  rendered verbatim on cards and escaped once for ICS, so the five content-only
  edits reach the required outputs without shared-code changes.
- The About page derives a venue only from training fixtures, so the changed
  match locations cannot alter its training copy. The Home page intentionally
  shares `FixtureItem`; an affected match will therefore show the same improved
  location whenever it enters Next up, with no separate data path to maintain.
- Issues #117-#121 are open and instruct future changes to retain each
  `location` while rewriting the title and adding `opponent`. Updating only
  `location` therefore avoids a merge-level semantic collision with that work.
- Issues #97 and #101 confirm schedule and venue facts belong in frontmatter,
  not fixture body prose. The proposed option 1 is consequently the narrowest
  implementation and no unresolved blocker remains.

## Implementation validation

- Phase 3.5 found exactly the six planned paths: five modified fixture records
  and this new plan. No title, schema, component, library, dependency,
  workflow, style, deployment, or unrelated fixture file changed.
- `npm ci` installed the 269-package locked tree and reported zero
  vulnerabilities. It emitted the existing environment-level advisory for
  unapproved `esbuild` and `fsevents` install scripts, but the install passed
  and no tracked dependency file changed.
- `npm run check` passed across 19 files with zero errors, warnings, or hints.
  `npm run build` passed and generated six pages plus `fixtures.ics`.
- Exact source comparison against `origin/main` proves each fixture differs
  only in its `location` line. All five use the same new value and preserve the
  requested date, start/end time, `+00:00` offsets, TBC title, `home: true`,
  absent opponent, and empty body.
- Complete generated-output assertions found the exact new location five times
  on the Fixtures page and in five unfolded VEVENTs, with zero remaining old
  card locations. Every event retained its expected UTC start/end and summary
  and has no description.
- `npm audit --omit=dev` reported zero vulnerabilities and `git diff --check`
  passed.

## Branch review

**Classification:** Code-relevant fixture content because the Markdown records
compile into user-visible cards and executable calendar events; the plan is
non-executable documentation.

**Review iteration 1:** Approved with no blocking or non-blocking finding.

- The live issue was re-fetched on 2026-08-24, remains open, and has not changed
  since its `2026-08-23T15:03:36Z` update. Its full body remains dispositioned
  in Issue traceability.
- The repository has no `docs/pre-pr-branch-review.md`. The named
  `differential-review` and Trail of Bits specialist skills are unavailable in
  this session, so the concrete manual fallback inspected the complete diff,
  every fixture location, the schema, shared card rendering, Fixtures and Home
  consumers, training-only About derivation, and complete ICS generation.
- The five edits are byte-identical except for their existing date-bearing
  paths. Parentheses require no text escaping, while the generator continues to
  escape all four address commas correctly.
- The final analogous-pattern sweep found no other Eastern Community Campus
  fixture or stale location value. The five unchanged titles intentionally omit
  `4G` to avoid duplicate ownership and stay compatible with #117-#121.
- Failure-shaped baseline evidence, corrected page/feed behavior, exact
  source-only diffs, negative opponent/body checks, and repository validation
  all pass. No security, dependency, authentication, workflow, or deployment
  surface changed, so no specialist risk review is indicated.
- All six changed Markdown files contain zero executable `bash` or `sh` fences.
  Phase 4.5 produced no follow-up idea, so no follow-up issue or PR-body section
  is required.

## Post-PR verification

**Implementation head reviewed:**
`4843b4d9d7bb6ad72f19946508dcf37da39d3194`

**Outcome:** Passed independently with no blocking or non-blocking finding.

The local commit, fetched remote branch, and GitHub PR #126 head matched before
verification. A fresh detached worktree from the exact published implementation
commit was installed, validated, and removed cleanly. The first independent
card parser assumed the weekday lacked punctuation and that the `li` tag had no
Astro data attribute; inspection of the real built HTML corrected both parser
assumptions, after which the complete-card assertions passed. This plan-only
evidence update is inspected separately after push, and the final reviewed PR
head is stored in the mutable PR body to avoid a tracked-file/SHA loop.

| Criterion or issue statement | Independent evidence | Result |
| --- | --- | --- |
| Five affected source paths | GitHub PR metadata and detached diff show exactly the five issue-named fixtures plus this plan | Pass |
| 4G visible on all five Fixtures page entries | Fresh complete-card parsing finds one exact 4G venue for each requested Sunday and five total | Pass |
| 4G visible in all five calendar events | Fresh unfolded-event parsing finds one exact escaped 4G `LOCATION` for every filename-derived UID | Pass |
| All five express the detail identically | Source comparison and generated counts show one byte-identical location value in every record and output | Pass |
| Confirmed dates remain unchanged | Every source differs from `origin/main` only on the location line; each complete card retains its requested date | Pass |
| 10:00-12:00 GMT and `+00:00` remain unchanged | Sources retain exact offset timestamps and VEVENTs retain exact 10:00/12:00 UTC fields | Pass |
| Opponent-confirmation compatibility | Titles and absent opponent fields are unchanged; live issues #117-#121 explicitly retain the location field | Pass |
| No body, all-day, recurrence, or description drift | Fresh sources stay frontmatter-only and the five VEVENTs have no description, RRULE, or date-only start | Pass |
| Suggested option 1 used without schema work | Complete diff changes only the five `location` lines; no shared source file changed | Pass |
| Prose-removal precedent retained | Empty fixture bodies remain unchanged, so #97/#101 ownership does not regress | Pass |
| Required project validation | Fresh detached `npm ci`, Astro check/build, production audit, diff check, and changed-range pre-commit all passed | Pass |
| Hosted repository checks | `Assign PR to denhamparry` and required `Check, build, and audit` completed successfully on the implementation head | Pass |
| PR closes issue #123 | GitHub resolves the stored `Closes #123` line to the open issue | Pass pre-merge |
| Deployment remains out of scope | Plan has `deploy: no`; no deployment or live-site mutation occurred | Pass |
