---
status: In Progress
issue: 80
issue_url: https://github.com/denhamparry/squirrelsteam/issues/80
branch: denhamparry.co.uk/fix/gh-issue-080
deploy: no
---

# Plan: Derive Training pre-season fixtures

## Problem

The Training page duplicates the confirmed St Peters fixture's identity and
date as literal prose. Updating the fixture content therefore updates the
Fixtures page and calendar feed but leaves Training stale. Its remaining-game
count is also a second literal that must be manually recalculated whenever
another planned pre-season game is confirmed.

## Acceptance criteria

- [ ] Confirmed pre-season game entries on Training are generated from the
      fixtures content collection rather than literal opponent/date prose.
- [ ] One fixture `start:` edit updates Training, Fixtures, and `fixtures.ics`.
- [ ] The remaining unscheduled game retains the existing `tbc` treatment and
      provisional explanation.
- [ ] `npm run check`, `npm run build`, and repository pre-commit hooks pass.

## Implementation steps

1. Add an optional, default-false `preSeason` flag to the fixture schema and
   mark the confirmed St Peters friendly as pre-season data.
2. Add a shared `getPreSeasonFixtures()` selector that filters the already
   published and start-sorted fixture collection.
3. Load those fixtures in `training.astro` and render each fixture's content-
   owned title and shared `formatWhen()` date with the existing Fixtures link.
4. Declare the total planned pre-season game count once and derive the positive
   unscheduled count from the confirmed collection length, including singular
   and plural wording.
5. Build, assert generated output, temporarily vary the one fixture start date
   to prove all three consumers move together, restore it, and run all gates.

## Files expected to change

- `src/content.config.ts`
- `src/content/fixtures/st-peters-away-2026-08-28.md`
- `src/lib/fixtures.ts`
- `src/pages/training.astro`
- `docs/plan/issues/80_derive_training_preseason_fixtures.md`

No fixture component, calendar generator, dependency, workflow, style, or
deployment file is expected to change.

## Validation

- Failure-shaped baseline: build `origin/main` and confirm Training contains a
  literal 28 August/St Peters entry while the content source is independently
  consumed by Fixtures and the calendar feed.
- Assert the schema owns `preSeason`, exactly the intended fixture opts in, and
  the selector returns all and only published pre-season fixtures in start
  order.
- Run `npm ci`, `npm run check`, and `npm run build`.
- Inspect generated Training HTML for the data-derived title and formatted date,
  existing `/fixtures/` link, exactly one derived unscheduled game, `tbc` class,
  and provisional explanation.
- Temporarily change the source date to 29 August, rebuild, and assert Training
  and Fixtures render 29 August while the calendar emits `20260829`; then
  restore 28 August and repeat the build assertions.
- Confirm the original literal opponent/date expression no longer exists in
  `training.astro`, and unrelated fixture records remain unclassified.
- Run `git diff --check` and repository pre-commit hooks against the exact
  staged file set.

## Risks and open questions

- Inferring pre-season status from a title, Markdown body, or before-season
  date cutoff would silently misclassify records. The explicit typed flag keeps
  classification content-owned and reviewable.
- The total of two planned games remains a Training-page editorial commitment,
  not fixture data. Keeping it in one named constant prevents the count and
  rendering logic from drifting across separate literals.
- If confirmed fixtures ever exceed the declared total, the remaining count is
  clamped at zero rather than rendering a negative item.
- The existing confirmed fixture title is reused verbatim. Training does not
  invent a kick-off time while it remains TBC in the fixture note.
- No deployment is requested. The workflow stops with an open PR.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Training hard-codes St Peters and 28 August | Implement in this PR | Collection map plus source-level negative assertion |
| Fixtures and calendar already derive from fixture content | Validate without changing owners | Built Fixtures HTML and VEVENT |
| Add a pre-season selector if needed | Implement explicit typed selector | Schema flag, opted-in fixture, library function |
| Use the same date formatter as Fixtures | Implement in this PR | `formatWhen()` import and rendered date |
| Confirmed entries come from collection | Implement in this PR | `getPreSeasonFixtures()` call and map |
| One start edit updates all three outputs | Validate failure-shaped behavior | Temporary 29 August mutation and three output assertions |
| Keep the unscheduled TBC item | Implement derived positive count | Generated item retains visible TBC and class |
| Keep the provisional note | Validate without changing copy | Built Training HTML assertion |
| Drive remaining count from one total | Implement suggested improvement | Named total constant minus confirmed count |
| `npm run check`, build, and hooks | Validate in this PR | Recorded command and staged-hook results |
| PR #79, issue #73, and issue #71 provenance | Validate without a change | Merged history and completed plans establish the drift chain |
| Components, calendar logic, dependencies, workflow, deployment | Intentionally out of scope | Changed-file gate |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue was fetched on 2026-08-13 and every context statement,
  affected path, failure scenario, recommendation, acceptance criterion,
  reference, operator implication, and scope boundary is represented above.
- PR #79 is merged and the branch contains its confirmed Training copy, so the
  issue's prerequisite and failure baseline are live on `origin/main`.
- `getFixtures()` is the shared published/start-sorted collection owner;
  `formatWhen()` is the shared Europe/London/all-day formatter used by the
  Fixtures component; and the ICS endpoint independently consumes the same
  collection. A selector in `fixtures.ts` therefore centralizes only the new
  classification without duplicating query or formatting behavior.
- The fixture schema already uses optional/default-false booleans for explicit
  content classifications such as `cup`, `draft`, and page visibility. A
  default-false `preSeason` boolean matches that model and keeps every existing
  record unchanged unless it opts in.
- The analogous sweep covered all fixture records and every pre-season source
  occurrence. Only the St Peters away record describes a pre-season game;
  recurring August/Tuesdays entries are training rather than games, and the 5
  September Llandaff North match does not identify itself as pre-season.
- Rendering the content-owned title avoids reconstructing opponent/home labels
  from incomplete optional fields. Deriving the remaining count from a named
  total completes the issue without changing the fixture renderer or calendar
  generator.
- Validation covers the current divergent state, corrected 28 August output,
  a deterministic one-source 29 August change across all consumers, the
  remaining TBC/no-negative path, and unrelated-record negative checks.

## Implementation validation

- Phase 3.5 found exactly the five planned paths: fixture schema, St Peters
  content, shared fixture helper, Training page, and this plan. Components,
  other fixtures, calendar generation, dependencies, workflows, styles, and
  deployment configuration are unchanged.
- The default-branch failure baseline contains literal St Peters/date prose and
  a literal remaining count in `training.astro` while the independent fixture
  source owns `start: 2026-08-28`.
- The complete fixture sweep found exactly one `preSeason: true` record: the
  intended St Peters away friendly. Every existing record receives the schema's
  default false value.
- `npm ci` installed 269 packages and reported zero vulnerabilities.
- `npm run check` passed across 19 files with zero errors, warnings, or hints.
- The final `npm run build` passed and generated six pages plus `fixtures.ics`.
- Generated output contains the fixture-owned title and shared formatted
  `Fri, 28 Aug 2026` date on Training and Fixtures, plus
  `DTSTART;VALUE=DATE:20260828` in the feed.
- Training source contains neither the old literal opponent phrase nor the
  literal Friday/date copy. Its generated HTML retains the Fixtures link,
  exactly one derived unscheduled game, a visible scoped `tbc` badge, and the
  unchanged provisional explanation.
- Failure-shaped mutation passed: changing only the fixture start to 29 August
  made Training and Fixtures render `Sat, 29 Aug 2026` and the feed emit
  `20260829`. Restoring 28 August and rebuilding restored all three outputs.
- `git diff --check` passed.

## Branch review

**Classification:** Code-relevant Astro content schema, query helper, fixture
data, and page rendering.

**Review iteration 1:** Approved with no blocking or non-blocking finding.

- The live issue was re-fetched on 2026-08-13 and remains open and unchanged.
  Every context statement, affected path, failure detail, recommendation,
  acceptance criterion, reference, and scope boundary remains represented in
  Issue traceability.
- `differential-review` and relevant Trail of Bits specialist skills are
  unavailable in this Codex session. The concrete manual fallback inspected
  the complete diff and full changed files, content schema defaults, every
  fixture record, all fixture-library consumers, shared formatter behavior,
  generated Training and Fixtures HTML, generated VEVENT date, and temporary
  mutation results.
- The explicit default-false classification is safer than title/body matching
  or a season-date cutoff. It cannot classify existing fixtures without a
  reviewed opt-in, and it reuses `getFixtures()` publication filtering and
  start ordering.
- The Training page maps fixture-owned titles and the same `formatWhen()` used
  by `FixtureItem`. It does not duplicate the opponent, date, timezone, or
  all-day formatting logic and does not invent the TBC kick-off time.
- The remaining count is computed from one named total and clamped at zero.
  The current one-confirmed state renders the established singular wording;
  a second confirmation will remove the provisional game item without a
  separate count edit.
- The analogous sweep found only one live pre-season game. August/Tuesdays
  records are training sessions and Llandaff North does not identify itself as
  pre-season, so none should opt in.
- Failure, success, and negative/no-op evidence pass: default-branch copy can
  drift; the branch follows both tested dates across all consumers; unrelated
  fixtures remain unclassified; and no component, ICS algorithm, dependency,
  workflow, or deploy file changed.
- The changed fixture Markdown and plan contain no Bash or shell fence, so
  executable-fence validation is not applicable.
