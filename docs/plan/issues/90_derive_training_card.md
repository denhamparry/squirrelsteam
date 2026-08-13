---
status: In Progress
issue: 90
issue_url: https://github.com/denhamparry/squirrelsteam/issues/90
branch: denhamparry.co.uk/fix/gh-issue-090
deploy: no
---

# Plan: Derive the Training card from fixtures

## Problem

The Training card duplicates venue, cadence, session time, and start-date facts
already owned by the two training fixture records. Editing a fixture can update
the calendar feed while leaving `/training/` stale. The page should select the
published training entries and render those facts through the shared fixture
formatters instead of maintaining a second copy.

## Acceptance criteria

- [ ] The Training card's venue, cadence, session times, and start dates are
      generated from the fixtures collection.
- [ ] Fixture `start`, `end`, `location`, and `rrule` edits update every
      consumer that is intended to expose the changed training entry.
- [ ] No literal training date, time, or venue prose remains in
      `src/pages/training.astro`.
- [ ] `npm run check`, `npm run build`, and repository pre-commit hooks pass.

## Implementation steps

1. Add `getTrainingFixtures()` beside the existing fixture selectors. Reuse
   `getFixtures()` so drafts remain excluded and results remain start-sorted.
2. Load the training entries in `training.astro` and derive a de-duplicated
   location list from their optional `location` fields.
3. Render one compact schedule bullet per training entry using the content-owned
   title, shared `formatWhen()` first-session/time-window output, and shared
   `recurrenceText()` cadence when an RRULE is present.
4. Preserve the existing pre-season-game card behavior and every unrelated
   Training-page section.
5. Build and inspect generated Training, Fixtures, and ICS output, then perform
   safe temporary content mutations and restore the committed fixture data.

## Files expected to change

- `src/lib/fixtures.ts`
- `src/pages/training.astro`
- `docs/plan/issues/90_derive_training_card.md`

No fixture content, schema, component, calendar generator, dependency,
workflow, style, or deployment file is expected to change.

## Validation

- Failure-shaped baseline: build `origin/main` and confirm Training contains
  literal venue/date/time copy while the Tuesday training record is hidden from
  Fixtures by issue #37 and remains present in ICS.
- Run `npm run check` and `npm run build`.
- Inspect generated Training HTML for both fixture-owned titles, the
  de-duplicated venue, shared formatted first-session windows, and both shared
  recurrence summaries.
- Confirm `training.astro` contains no literal Caedelyn, weekday, date, or time
  copy and the page still renders its pre-season game and TBC sections.
- Temporarily mutate the Tuesday source's `start`, `end`, `location`, and
  `rrule`; rebuild and assert Training and ICS move together while Fixtures
  continues the intentional issue #37 exclusion. Restore and rebuild.
- Temporarily mutate the opted-in Sunday source; rebuild and assert Training,
  Fixtures, and ICS all move together. Restore and rebuild.
- Run `git diff --check` and repository pre-commit hooks against the exact
  staged path set.

## Risks and open questions

- Issue #90 says the recurring Tuesday record should visibly update
  `/fixtures/`, but closed issue #37 explicitly requires that exact record to
  stay absent from the Fixtures page. This plan preserves the narrower prior
  product rule: Tuesday changes are visible on Training and ICS, while the
  opted-in Sunday training record demonstrates the three-visible-consumer path.
- A training record may omit `location` or `rrule`. The page will skip missing
  locations and omit a recurrence suffix rather than rendering placeholder or
  malformed copy; `formatWhen()` still describes the first session.
- Multiple records may share a venue. De-duplicating locations avoids repeating
  the current Caedelyn address while still surfacing every distinct future
  location.
- `src/pages/about.astro` separately says `Caedelyn Park`. It is an independently
  stale-able join-us summary and a non-blocking follow-up, not part of issue
  #90's explicit Training-card scope.
- No deployment is requested. The workflow stops with an open PR.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Four affected literals in `training.astro` | Implement in this PR | Source-level negative assertions |
| Select `type: "training"` entries in a shared helper | Implement in this PR | `getTrainingFixtures()` using `getFixtures()` |
| Venue comes from fixture `location` | Implement in this PR | De-duplicated generated venue bullets |
| Cadence comes from `rrule` | Implement in this PR | `recurrenceText()` output for both records |
| Session window and start come from `start`/`end` | Implement in this PR | `formatWhen()` output for both records |
| Earliest start should replace a literal start date | Implement equivalent | Each series exposes its own first session, including the earliest, without duplicate summary copy |
| Keep generated strings mobile-friendly | Implement in this PR | One venue bullet per distinct place and one compact bullet per series |
| Tuesday source edit updates Training and ICS | Implement and failure-test | Temporary four-field mutation |
| Tuesday source visibly updates Fixtures | Not applicable due conflicting prior requirement | Issue #37 absence assertion and unchanged page filter |
| Opted-in Sunday source updates all three visible outputs | Validate without content change | Temporary Sunday mutation |
| No literal training facts remain on Training | Implement in this PR | Complete source scan |
| `npm run check`, build, and hooks | Validate in this PR | Recorded command results |
| PR #86 / issues #80 and #73 provenance | Validate without a change | Current shared selector/formatter architecture |
| About-page venue duplication | Non-blocking follow-up | PR-body Follow-up ideas entry |
| Fixture data, schema, components, ICS logic, dependencies, workflows, styles, deployment | Intentionally out of scope | Changed-file gate |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue was fetched on 2026-08-13 and every context statement,
  affected path, failure scenario, suggestion, acceptance criterion, reference,
  operator implication, and explicit scope boundary is represented above.
- The default-branch failure baseline passed: generated Training contains the
  literal 4 August date and Caedelyn venue; the recurring Tuesday title is
  absent from Fixtures; and its summary and RRULE remain in ICS.
- `getFixtures()` is the single published/start-sorted collection owner.
  Filtering it by `data.type === "training"` matches the successful
  `getPreSeasonFixtures()` selector pattern without changing calendar or page
  visibility policy.
- `formatWhen()` already owns Europe/London date and start/end formatting, and
  `recurrenceText()` already owns RRULE wording. Reusing both avoids new date,
  time, timezone, and cadence logic.
- The complete training-entry sweep found exactly the Tuesday and August Sunday
  records. The latter explicitly opts into Fixtures display; the former must
  remain hidden there under issue #37 while both remain in ICS.
- The analogous source sweep covered fixture helpers and consumers, fixture
  records, Training, Fixtures, ICS, and About. The only adjacent stale-able
  literal is About's venue summary, classified as a non-blocking follow-up.
- Failure, success, negative/no-op, empty-optional-field, exact-scope, and
  restored-source validation are specific enough to catch the original drift
  without deployment or unrelated refactoring.

## Implementation validation

- Phase 3.5 found exactly the three planned paths: the shared fixture helper,
  Training page, and this plan. Both temporarily mutated fixture sources match
  `origin/main` again; no content, schema, component, calendar generator,
  dependency, workflow, style, or deployment file changed.
- `npm ci` installed 267 packages, reported zero vulnerabilities, and warned
  only that two transitive install scripts are not yet listed in npm's optional
  `allowScripts` policy.
- `npm run check` passed across 19 files with zero errors, warnings, or hints.
- The final `npm run build` passed and generated six pages plus `fixtures.ics`.
- Generated Training contains one de-duplicated `Caedelyn Park, CF14 6EJ`
  venue and the two content-owned series. Their shared formatter output is
  `Tue, 4 Aug 2026, 7:00 pm-8:00 pm` and
  `Sun, 9 Aug 2026, 10:30 am-11:30 am`; shared recurrence output names the
  correct weekday and end date for each.
- Training source contains none of the old literal venue, weekday, date, or
  time expressions. The pre-season-game entry, remaining TBC count, provisional
  explanation, and unrelated cards remain in generated output.
- Failure-shaped Tuesday mutation passed: changing only that content record's
  start, end, location, and RRULE made Training render 12 August, 18:30-20:15,
  Test Ground, and Wednesdays, and made ICS emit the matching UTC dates,
  location, and rule. Fixtures retained the required issue #37 absence.
- Three-consumer Sunday mutation passed: changing its same four fields made
  Training and Fixtures render 16 August, 09:15-10:45, Sunday Test Field, and
  the new recurrence, while ICS emitted the matching UTC values. Restoring the
  record restored all three outputs.
- `git diff --check` passed. Exact staged-file pre-commit remains the Phase 5
  gate.
- In-app browser discovery returned no available browser, so a truthful visual
  phone-viewport check could not run. Generated HTML inspection confirms the
  compact structure, but this is recorded as a validation limitation rather
  than a visual pass.

## Branch review

**Classification:** Code-relevant Astro collection selection and page
rendering.

**Review iteration 1:** Approved with no blocking finding and one non-blocking
follow-up idea.

- The live issue was re-fetched on 2026-08-13 and remains open and unchanged.
  Every context statement, affected path, failure detail, recommendation,
  acceptance criterion, reference, and scope boundary remains represented in
  Issue traceability.
- `differential-review` and matching Trail of Bits specialist skills are
  unavailable in this Codex session. The concrete manual fallback inspected
  the complete diff and changed files, both training fixture records, schema,
  every fixture-library consumer, page visibility policy, shared formatter
  behavior, generated Training/Fixtures/ICS output, and both restored mutation
  probes.
- The selector reuses the published and start-sorted `getFixtures()` primitive,
  filters only the typed `training` discriminator, and does not alter drafts,
  upcoming/past calculations, Fixtures visibility, home selection, or ICS.
- Location de-duplication preserves start order, skips absent optional values,
  and exposes every distinct future venue. Schedule rendering retains every
  training record in start order, uses its content-owned title, and omits only
  an unparseable or absent optional recurrence instead of inventing copy.
- Reusing `formatWhen()` and `recurrenceText()` keeps timezone, inclusive UNTIL,
  time range, weekday, and pluralization logic in their established owners.
- Failure, success, negative/no-op, and restored-state evidence pass. The
  intentional Tuesday Fixtures absence is preserved, while the opted-in Sunday
  record proves the visible three-consumer path.
- The analogous sweep found the About page's separate `Caedelyn Park` join-us
  copy. Deriving that summary is a non-blocking follow-up idea because changing
  it would expand issue #90 beyond the named Training card.
- The changed plan contains no shell fence and the changed Astro/TypeScript
  files are not shell-bearing Markdown, so executable-fence validation is not
  applicable.
