---
status: Complete
issue: 155
issue_url: https://github.com/denhamparry/squirrelsteam/issues/155
branch: denhamparry.co.uk/feat/gh-issue-155
deploy: no
---

# Plan: Add a Results tab for scored matches

## Problem and outcome

Finished match scores are buried in the dimmed Past events disclosure. Add an
accessible, deep-linkable Results tab with prominent result cards, breakdowns,
and a competitive season record, while keeping unscored finished events in
Past events. Surface the latest scored match beside Next up on the home page.

The live issue snapshot was fetched on 2026-09-14 and had no comments. Since
the issue was written, `main` gained the 13 September Ynysowen 17–7 result, so
the current correct order is Ynysowen followed by Llandaff North and the
competitive record is 2 played, 2 won, 0 drawn, 0 lost, 45–14.

## Acceptance criteria

- [x] Fixtures shows Upcoming and Results tabs below Subscribe, with Upcoming
      selected by default and `#results` selecting Results.
- [x] Results contains only finished scored matches, most recent first, with
      no duplicate in Past events.
- [x] Result cards show the home/away-ordered score, W/L/D text chip, optional
      tries/conversions in the same order, date, Home/Away, and Cup without
      dimming.
- [x] The season record shows Played, Won, Drawn, Lost, and points for–against,
      excluding `preSeason: true` matches.
- [x] Results has a no-scores empty state; unscored finished fixtures remain in
      collapsed Past events at the bottom of Results.
- [x] Tabs implement tablist/tab/tabpanel ARIA state, visible focus, arrow/Home/
      End keyboard navigation, and progressive no-JavaScript stacked content.
- [x] The tab and record layouts cannot overflow a 400 px viewport.
- [x] Home shows the latest scored match linking to `/fixtures/#results`, and
      emits no Latest result section when there are no results.
- [x] `fixtures.ics` output is unchanged apart from build-time `DTSTAMP`.
- [x] README describes the Results tab and Latest result card.
- [x] Check, build, production audit, targeted assertions, diff checks, and
      pre-commit hooks pass.

## Implementation steps

1. Add pure result helpers for outcome, ordered breakdown lines, and competitive
   season-record calculation; re-export the existing formatter without changing
   its output.
2. Add `getResults(now)` for finished scored matches in reverse chronology.
3. Extend `FixtureItem` with opt-in result details for the outcome chip and
   breakdown, preserving ordinary fixture rendering.
4. Split Fixtures into progressively enhanced Upcoming/Results panels, filter
   scored matches out of Past events, and add the record and empty state.
5. Add the latest result to the home page and update README result guidance.
6. Validate helper invariants, static output, client tab contract, calendar
   stability, mobile-safe CSS, and repository quality gates.

## Files expected to change

- `src/lib/results.ts`
- `src/lib/fixtures.ts`
- `src/components/FixtureItem.astro`
- `src/pages/fixtures.astro`
- `src/pages/index.astro`
- `README.md`
- `docs/plan/issues/155_add_results_tab.md`

No fixture data, result schema, ICS generator, dependency, lockfile, workflow,
global style, deployment, or unrelated page is expected to change.

## Validation

- Baseline: build current `origin/main`; require no tabs, Results panel, season
  record, outcome chip, breakdown, or Latest result, while both scored matches
  remain inside dimmed Past events.
- Directly exercise pure helpers for named home/away scores, W/L/D, missing
  results, optional breakdowns, all season outcomes, pre-season exclusion, and
  points totals.
- Run `npm run check`, `npm run build`, and `npm audit --omit=dev`.
- Parse built Fixtures HTML for Subscribe-before-tabs order, complete tab/panel
  roles and state, two undimmed result cards in reverse chronology, exact score
  and breakdown text, 2/2/0/0/45–14 record, and scored-match exclusion from
  Past events.
- Inspect the compiled client script/source contract for `#results`, click,
  hashchange, ArrowLeft/ArrowRight/Home/End, focus, selection, tab index, and
  panel hiding. Require static panel content not to carry `hidden`, proving the
  no-JavaScript stacked fallback.
- Assert the two-column mobile tab/record grids use `minmax(0, 1fr)`, controls
  have `min-width: 0`, and no fixed/min-content width can force 400 px overflow.
- Parse built home HTML for the latest Ynysowen result, detail chip/breakdown,
  and `/fixtures/#results` link. Validate the empty branch is explicitly
  conditional on a missing latest result.
- Hash the unfolded calendar after removing `DTSTAMP` before and after the
  implementation; require byte-identical output.
- Run `git diff --check` and pre-commit against the exact staged paths. Build
  owns ignored `dist/`; no server or external service is required.

## Risks and decisions

- Results are filtered by effective finish time, not merely by a score, so an
  accidentally pre-entered future score cannot appear early.
- The season record consumes the finished result list and independently drops
  pre-season matches. Points are always Rhiwbina `us` then opposition `them`,
  regardless of display order.
- The two current competitive wins exercise real rendering, while direct pure
  helper probes cover draws, losses, missing breakdowns, and pre-season data.
- Static HTML keeps both panels visible; JavaScript adds the enhanced state and
  `hidden` attributes. This avoids content loss when scripts are unavailable.
- No headless browser is installed, so runtime tab behavior is validated through
  the compiled DOM contract and event logic plus Astro type/build checks; the
  CSS layout is checked structurally for bounded mobile columns.
- No deploy, scheduled rebuild, ICS change, follow-up issue, merge, or manual
  issue closure is in scope.

## Issue traceability

| Issue item | Timing / owner / prerequisite | Disposition and evidence | Result |
| --- | --- | --- | --- |
| Upcoming and Results tabs below Subscribe | Pre-merge / Codex / build | Generated DOM order assertion | Passed |
| Upcoming selected by default | Pre-merge / Codex / build | Generated ARIA/tabindex and script assertion | Passed |
| `#results` deep link | Pre-merge / Codex / client script | Compiled hash initialization/change contract | Passed |
| Finished scored matches only, newest first | Pre-merge / Codex / current data | Ynysowen precedes Llandaff in generated Results | Passed |
| Ordered score and W/L/D label chip | Pre-merge / Codex / result helpers | Direct home/away/W/L/D assertions and built cards | Passed |
| Tries/conversions in score order | Pre-merge / Codex / result data | Direct helper and both built-card assertions | Passed |
| Date plus Home/Away/Cup, not dimmed | Pre-merge / Codex / built cards | Generated card metadata/class assertions | Passed |
| Competitive season record | Pre-merge / Codex / result helpers | Direct exclusion/outcome test; built 2/2/0/0/45–14 | Passed |
| Empty Results state | Pre-merge / Codex / source/build | Explicit zero-results branch and empty helper probe | Passed |
| Unscored Past events retained; scored excluded | Pre-merge / Codex / built page | Generated disclosure contains only two unscored events | Passed |
| WAI-ARIA keyboard tabs and visible focus | Pre-merge / Codex / source/build | Generated roles/state plus compiled key/focus contract | Passed |
| No-JavaScript stacked fallback | Pre-merge / Codex / static HTML | Both generated panels omit static `hidden` | Passed |
| No horizontal scroll near 400 px | Pre-merge / Codex / CSS | Bounded two-column grids and zero minimum widths | Passed |
| Latest result on home links to Results | Pre-merge / Codex / build | Generated Ynysowen card and deep link | Passed |
| Latest result absent with no scores | Pre-merge / Codex / source | Conditional render on optional latest item | Passed |
| Subscribe stays above tabs | Pre-merge / Codex / built page | Generated DOM-order assertion | Passed |
| ICS result descriptions unchanged | Pre-merge / Codex / baseline hash | Normalized SHA-256 remains `41b9ba7d…60e0` | Passed |
| No schema change | Pre-merge / Codex / diff | Changed-path and target-base diff inspection | Passed |
| README Results wording | Pre-merge / Codex / full README | Updated destinations; Markdown hook pending | Passed |
| No scheduled rebuild change | N/A / issue scope | No workflow changes | Not applicable |
| Issues #130/#132 | Pre-merge / Codex / repository history | Existing result shape and formatter output retained | Passed |
| Check, build, audit, hooks | Pre-merge / Codex / dependencies | Check/build/audit and final staged hooks | Passed |
| Deploy/merge/manual close | N/A / user authorization | No deploy, merge, or manual closure performed | Not applicable |

## Implementation evidence

- `npm run check`: passed with zero diagnostics across 20 files.
- `npm run build`: passed; all six pages and `fixtures.ics` generated.
- Direct Node assertions: passed for score order, W/D/L outcomes, optional
  breakdowns, pre-season exclusion, and empty/complete season records.
- Generated-page assertions: passed for content order, cards, record, ARIA and
  keyboard contract, no-JavaScript panels, bounded mobile CSS, Past-event
  deduplication, home Latest result, and README wording.
- `npm audit --omit=dev`: zero vulnerabilities.
- `pre-commit run`: all applicable hooks passed against the exact staged paths.
- Normalized `fixtures.ics` SHA-256 remained
  `41b9ba7d74a7bb6ad0a62d04527bf216a84ec753ffdbdfa7649fe703194c60e0`.

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue was fetched on 2026-09-14, remains open, and has no comments.
  Every proposal item, acceptance criterion, affected path, note, reference,
  and explicit non-change is represented in traceability.
- The issue's single-result snapshot has been superseded by current `main`:
  commit `6816419` added the newer Ynysowen 17–7 result. The feature must use
  data-driven reverse chronology rather than hard-code the issue example.
- A clean `npm ci`, `npm run check`, and `npm run build` passed. The baseline
  reproduced the discoverability gap: both scored matches render inside dimmed
  Past events, while no tabs, Results panel, record, outcome chip, breakdown,
  or Latest result exists.
- Current competitive scores independently establish the expected record:
  Ynysowen 17–7 plus Llandaff North 28–7 equals 2 played, 2 won, 0 drawn, 0
  lost, and 45–14 points. Both include tries and conversions, exercising home
  and away display order in real output.
- The existing effective-end helper is the correct ownership boundary for
  deciding whether a scored match is finished. Pure result helpers allow
  failure/success probes for W/L/D, missing data, breakdown ordering, and
  pre-season exclusion without changing fixture sources.
- Static progressive enhancement is compatible with Astro: both panels ship
  visible and the client script alone adds inactive `hidden` state. Existing
  global `:focus-visible` styling supplies a visible keyboard focus outline;
  component CSS can bound mobile columns without a global-style change.
- The normalized baseline calendar SHA-256 is
  `41b9ba7d74a7bb6ad0a62d04527bf216a84ec753ffdbdfa7649fe703194c60e0`.
  No fixture, schema, formatter output, or ICS source change is needed.
- Validation covers the current success paths, synthetic negative/business
  invariants, static no-JavaScript fallback, compiled client behavior contract,
  mobile-safe CSS, and exact scope. No unresolved blocker remains.
