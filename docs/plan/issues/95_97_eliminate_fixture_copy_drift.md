---
status: In Progress
issues:
  - 95
  - 96
  - 97
issue_urls:
  - https://github.com/denhamparry/squirrelsteam/issues/95
  - https://github.com/denhamparry/squirrelsteam/issues/96
  - https://github.com/denhamparry/squirrelsteam/issues/97
branch: denhamparry.co.uk/fix/gh-issue-095
deploy: no
---

# Plan: Eliminate remaining fixture-copy drift

## Problem

Three remaining copies of fixture-owned facts can drift from the fixture
collection. The About page hard-codes the training ground, the Training page
hard-codes the tour destination and dates, and both training fixture bodies
repeat schedule facts that are already represented by frontmatter and emitted
separately in the calendar feed. One coordinated change can make fixture
content the source of truth for all three consumers.

## Acceptance criteria

### Issue #95

- [x] The About page's training venue is generated from the fixture collection.
- [x] Editing the training fixture `location` updates `/about/` without a
      separate page edit.
- [x] `npm run check`, `npm run build`, and repository pre-commit hooks pass.

### Issue #96

- [x] The Training key-dates tour entry is generated from the tour fixture.
- [x] Editing the tour fixture dates updates `/training/`, `/fixtures/`, and
      `fixtures.ics` from one source edit.
- [x] The season-start line remains intentionally editorial prose because no
      owning fixture record exists, and that ownership decision is documented.
- [x] `npm run check`, `npm run build`, and repository pre-commit hooks pass.

### Issue #97

- [x] Editing a training fixture's `start`, `end`, `location`, or `rrule` does
      not leave contradictory schedule prose in its generated ICS description.
- [x] `npm run check`, `npm run build`, and repository pre-commit hooks pass.

## Implementation steps

1. Reuse `getTrainingFixtures()` on About, take the first published training
   record with a location, and render the ground-name portion of its location.
2. Add a typed, published, start-sorted `getTourFixtures()` selector beside the
   existing fixture selectors.
3. Render every published tour in Training's key-dates card with its
   content-owned title and shared `formatWhen()` output; leave the season start
   as documented editorial prose.
4. Replace the two training markdown bodies with useful schedule-neutral notes
   so the ICS description cannot contradict frontmatter-owned schedule fields.
5. Validate the generated About, Training, Fixtures, and ICS outputs, including
   safe temporary fixture mutations that are restored before commit.

## Files expected to change

- `src/lib/fixtures.ts`
- `src/pages/about.astro`
- `src/pages/training.astro`
- `src/content/fixtures/preseason-training.md`
- `src/content/fixtures/august-sunday-training.md`
- `docs/plan/issues/95_97_eliminate_fixture_copy_drift.md`

No fixture schema, tour record, component, ICS generator, dependency, workflow,
style, or deployment file is expected to change.

## Validation

- Failure-shaped baseline: build `origin/main` and confirm About renders the
  literal Caedelyn venue, Training renders the literal tour dates, and ICS
  descriptions repeat the two training schedules.
- Temporarily change a training fixture's `location`; build and confirm the
  committed page still renders Caedelyn before the fix, then restore it.
- Run `npm run check` and `npm run build` after implementation.
- Inspect generated About for the ground name derived from the first published
  training location and no literal venue in `about.astro`.
- Inspect generated Training for the tour record's title and shared formatted
  dates, the unchanged season-start prose, and no literal tour facts in
  `training.astro`.
- Inspect ICS descriptions and require no weekday, time, venue, recurrence, or
  month schedule facts from either training body.
- Temporarily mutate the training venue and the tour title/dates; rebuild and
  assert all intended consumers move together while the schedule-neutral ICS
  descriptions remain unchanged, then restore and rebuild.
- Run `git diff --check` and repository pre-commit hooks against the exact
  staged path set.

## Risks and open questions

- About needs a short ground name rather than a postal address mid-sentence.
  The first comma-delimited part of the first published training location is
  used, matching the issue's suggested compact mobile copy.
- If no published training record has a location, About omits the venue clause
  but retains the link to current training details instead of rendering an
  empty value.
- More than one future tour can be represented without another page edit; the
  key-dates card renders all published tour records in start order.
- The season-start line has no source record. Creating one would invent a new
  content type or ownership policy, so it remains intentionally editorial prose
  and is documented here rather than expanding this refactor.
- The training bodies retain descriptive context but no day, time, venue,
  recurrence, or date/month wording that could conflict with frontmatter.
- An analogous sweep found the tour and Cardiff Arms Park bodies also restate
  frontmatter facts. They are outside the two training records named by #97 and
  are retained as one non-blocking PR-body follow-up idea.
- The user explicitly requested one PR for the three closely related issues.
- No follow-up issues or deployment were requested; the workflow stops with one
  open PR.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| #95 About literal duplicates training `location` | Implement in this PR | About loads published training fixtures and renders the first ground name |
| #95 fixture location edit updates About | Implement and failure-test | Temporary venue mutation changes generated About |
| #95 keep the sentence short for parents on phones | Implement in this PR | Render only the comma-delimited ground name |
| #95 PR #94 / issue #90 provenance | Validate without a change | Reuse the selector introduced by #90 |
| #96 Training literal duplicates tour title/start/end | Implement in this PR | Tour selector plus `formatWhen()` rendering |
| #96 tour edit updates Training, Fixtures, and ICS | Implement and failure-test | Temporary title/date mutation across all three outputs |
| #96 season-start ownership choice | Intentionally prose | Documented decision; no unsupported content record is introduced |
| #96 shared-selector recommendation | Implement in this PR | Add `getTourFixtures()` beside existing typed selectors |
| #96 PR #94 / issue #90 provenance | Validate without a change | Follow the shared selector/formatter architecture |
| #97 Tuesday body repeats day, time, and venue | Implement in this PR | Replace with schedule-neutral training context |
| #97 Sunday body repeats month, day, time, venue, and adjacent schedule | Implement in this PR | Replace with schedule-neutral training context |
| #97 any start/end/location/RRULE edit must not contradict DESCRIPTION | Implement and failure-test | Mutated generated ICS retains neutral descriptions beside changed fields |
| #97 option to derive a schedule sentence in the ICS generator | Intentionally not selected | Neutral fixture bodies solve the drift without duplicating formatter logic in ICS |
| Build, Astro check, and pre-commit hooks for all issues | Validate in this PR | Recorded command results |
| Schema, components, ICS logic, dependencies, workflows, styles, deployment | Intentionally out of scope | Exact changed-file gate |

## Research validation

**Overall assessment:** Approved after one review iteration.

- All three live issues were fetched on 2026-08-13 and remain open. Their full
  contexts, affected paths, reproduction scenarios, recommendations, criteria,
  references, conditional choices, and explicit alternatives are represented
  in the traceability table.
- The default-branch build reproduces each stale-copy class: About contains the
  literal `Caedelyn Park`, Training contains the literal `1–4 May 2027`, and
  both generated training descriptions contain fixture-owned schedule facts.
- `getFixtures()` is the published and start-sorted source used by the site and
  ICS. The existing `getTrainingFixtures()` and `getPreSeasonFixtures()` helpers
  establish the correct selector pattern for a typed tour helper.
- `formatWhen()` already owns all-day inclusive range formatting, so using it
  avoids a second tour-date formatter and preserves the content schema's date
  semantics.
- The consumer sweep covered every `getFixtures()`, fixture-type check,
  `formatWhen()`, and training selector use. Only the About venue, Training tour
  line, and two training bodies match the three reported drift classes.
- Failure, corrected-success, missing-optional-location, multi-tour, exact-scope,
  and restored-source checks are defined without requiring deployment.

## Implementation validation

- Phase 3.5 found exactly the six planned paths: the shared fixture helper, two
  pages, two training content records, and this plan. The temporarily mutated
  tour record matches `origin/main` again; no schema, component, ICS generator,
  dependency, workflow, style, or deployment file changed.
- `npm ci` installed 267 packages, reported zero vulnerabilities, and emitted
  only npm's environment-level advisory about two transitive install scripts
  not yet covered by the optional `allowScripts` policy.
- `npm run check` passed across 19 files with zero errors, warnings, or hints.
- The final `npm run build` passed and generated six pages plus `fixtures.ics`.
  `npm audit --omit=dev` and `git diff --check` also passed.
- Generated About renders `We train at Caedelyn Park. Check the training page`
  with correct spacing, while `about.astro` contains no literal venue.
- Generated Training renders the content-owned `Tour — South of France` title
  and shared `Sat, 1 May 2027 – Tue, 4 May 2027` range. The intentional
  season-start prose remains, and `training.astro` contains no literal tour
  destination or dates.
- Generated ICS retains the two training events' frontmatter-derived start,
  end, location, and RRULE fields, while their descriptions are now
  schedule-neutral.
- Failure-shaped combined mutation passed: changing the first training record
  to 6 August, 18:30-20:15, Verification Ground, and Thursdays updated About,
  Training, and ICS. Changing the tour to Verification Coast on 8-11 May
  updated Training, Fixtures, and ICS. Both neutral training descriptions
  remained valid beside the changed fields.
- Missing-location and multiple-tour checks passed: removing both training
  locations omitted About's venue clause but retained its training link, and a
  temporary second tour rendered beside the original in start order.
- All temporary content mutations were restored through explicit patches and a
  final clean build returned the committed venue, schedules, and tour values.
- The in-app browser runtime exposed no available browser, so a visual
  phone-viewport check could not run. This is a recorded limitation rather than
  a visual pass; generated HTML assertions cover exact text and spacing.
- Exact staged-file pre-commit passed all configured hooks against the six
  intended paths without modifying them.

## Branch review

**Classification:** Code-relevant Astro collection selection, page rendering,
and calendar-description content.

**Review iteration 1:** Approved with no blocking finding and one grouped
non-blocking follow-up idea.

- All three live issues were re-fetched on 2026-08-13 and remain open and
  unchanged. Their contexts, affected paths, failure scenarios, alternatives,
  criteria, and references remain fully represented in Issue traceability.
- `differential-review` and matching Trail of Bits specialist skills are not
  available in this Codex session. The concrete manual fallback inspected the
  complete diff, collection schema, every fixture selector and consumer, both
  page render paths, the ICS description path, every training record, generated
  outputs, optional-data behavior, and restored mutation probes.
- `getTourFixtures()` follows the established typed selector pattern and
  preserves draft exclusion plus start ordering through `getFixtures()`.
- About selects the first non-empty ground-name portion from published training
  locations and omits only the clause when none exists. It retains compact copy
  and does not expose the postcode mid-sentence.
- Training renders all published tours from content and delegates inclusive
  all-day range formatting to `formatWhen()`. The season-start line remains the
  only intentional literal because it has no owning fixture record.
- The two changed Markdown bodies contain no executable shell fences. The plan
  is non-executable documentation, so shell-fence validation is not applicable.
- Failure, success, negative/no-op, multi-record, and restored-state evidence
  all pass. The final source scan finds no old About or Training literals and no
  schedule-owned facts in the two changed training bodies.
- The analogous body sweep found `tour-south-of-france.md` repeating its
  destination and `cardiff-arms-park-2026-12-06.md` repeating venue/kick-off.
  Auditing non-training descriptions is one non-blocking follow-up idea rather
  than an unrequested expansion of #95-#97.

## Post-PR verification

Pending PR creation.
