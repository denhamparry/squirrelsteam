---
status: In Progress
issue: 103
issue_url: https://github.com/denhamparry/squirrelsteam/issues/103
branch: denhamparry.co.uk/fix/gh-issue-103
deploy: no
---

# Plan: Add Pontypool and Guildfordians fixtures

## Problem

The 20 September 2026 away fixture is missing from the fixture collection, and
the existing 6 December 2026 Cardiff Arms Park fixture has neither an opponent
nor an end time. As a result, the Fixtures page and generated calendar feed are
incomplete. The issue's proposed `Guildordoldians RFC` spelling is not the
club's current official name; the club identifies itself as Guildfordians RFC.

The shared fixture card currently appends `opponent` after `title`. Because the
issue also requires opponent-bearing calendar titles, adding the requested
field without a small display guard would render each opponent twice on the
Fixtures page.

## Acceptance criteria

- [x] Add a Pontypool Utd away match on Sunday 20 September 2026 as a date-only
      all-day fixture while kick-off remains TBC.
- [x] Update the Cardiff Arms Park match to name Guildfordians RFC, retain the
      Cardiff Arms Park location and 12:30pm start, and end at 1:30pm.
- [x] Both fixtures render once, without duplicated opponent text, on the
      Fixtures page and appear with the correct fields in `fixtures.ics`.
- [x] `npm run check`, `npm run build`, generated-output assertions, and the
      repository pre-commit hooks pass.

## Implementation steps

1. Add the Pontypool fixture using the established all-day away-match shape and
   an opponent-bearing title suitable for the calendar summary.
2. Update the Cardiff Arms Park fixture with the verified current club name,
   opponent-bearing title, and one-hour end timestamp while preserving the
   location and start.
3. Guard the shared fixture-card opponent suffix when the title already names
   the opponent, preserving the suffix for future generic titles.
4. Build and inspect the generated Fixtures page and complete VEVENTs for both
   matches, including negative assertions for duplication and invented time or
   location data.

## Files expected to change

- `src/content/fixtures/pontypool-utd-away-2026-09-20.md`
- `src/content/fixtures/cardiff-arms-park-2026-12-06.md`
- `src/components/FixtureItem.astro`
- `docs/plan/issues/103_add_pontypool_guildfordians_fixtures.md`

No schema, fixture selector, ICS generator, dependency, workflow, style, or
deployment file is expected to change.

## Validation

- Failure-shaped baseline: build `origin/main` and confirm Pontypool and its
  `20260920` event are absent, while the Cardiff Arms Park VEVENT has no
  opponent-derived description or `DTEND`.
- Run `npm run check` and `npm run build` after implementation.
- Parse the Pontypool VEVENT and require `DTSTART;VALUE=DATE:20260920`, exclusive
  `DTEND;VALUE=DATE:20260921`, the away title/description, and no location.
- Parse the Guildfordians VEVENT and require UTC start `20261206T123000Z`, UTC
  end `20261206T133000Z`, the Cardiff Arms Park location, and verified opponent.
- Inspect generated Fixtures HTML for Match/Away presentation, both dates,
  Cardiff's one-hour range and location, and exactly one visible occurrence of
  each opponent per fixture card.
- Confirm surrounding fixtures remain in chronological order and no unrelated
  fixture source changes.
- Run `git diff --check` and exact-file repository pre-commit hooks.

## Risks and open questions

- The issue's `Guildordoldians RFC` value is a typo. The current club site and
  RFU club page both use `Guildfordians RFC`; the older `Old Guildfordians`
  name is historical. This plan uses the current official name:
  <https://www.grfc.co.uk/> and
  <https://guildfordiansrfc.rfu.club/information>.
- Kick-off for Pontypool must not be invented. The all-day representation is
  temporary and should become a timed start after confirmation.
- `title` remains the ICS summary, while `opponent` supports semantic rendering
  and the synthesized calendar description. The display guard is needed so
  those two valid representations do not duplicate text on the page.
- The existing Cardiff body repeats its venue and kick-off. Rewriting that
  prose is not required to add the opponent and end time, so it remains outside
  this focused fixture update.
- No follow-up issues or deployment were requested. The workflow stops with an
  open PR.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Create the named Pontypool fixture file | Implement in this PR | New fixture source at the requested path |
| `type: match`, `home: false`, `opponent: Pontypool Utd` | Implement and validate | Source assertions plus Match/Away card and ICS description |
| TBC kick-off represented by date-only start and `allDay: true` | Implement and validate | Source plus all-day VEVENT with exclusive next-day end |
| Switch Pontypool to timed start once confirmed | Non-blocking follow-up | PR-body follow-up idea; no time invented here |
| Update the existing Cardiff Arms Park file | Implement in this PR | Focused edit to the named fixture source |
| Add opponent and reflect it in the Cardiff title | Implement with corrected official name | Source, page card, summary, and description assertions |
| Add 1:30pm end while retaining 12:30pm start | Implement and validate | Timed VEVENT and page range assertions |
| Keep `location: Cardiff Arms Park, Cardiff` | Validate without changing the value | Source and VEVENT location assertions |
| Confirm `Guildordoldians RFC` spelling before publishing | Implement with verified correction | Official club and RFU sources identify Guildfordians RFC |
| Verify Fixtures page and `fixtures.ics` with build/check | Validate in this PR | Generated-output checks plus Astro commands |
| Schema supports the requested fields | Validate without a schema change | Existing `src/content.config.ts` inspection and Astro check |
| Part of epic #10 | Context only | PR links and closes only issue #103 |
| Schema, selectors, ICS generator, dependencies, workflows, styles, deploy | Intentionally out of scope | Exact changed-file gate |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue was fetched on 2026-08-19 and remains open. Its tasks, exact
  fields, named paths, spelling warning, build/check requirement, conditional
  future time update, schema reference, and epic context are represented in
  Issue traceability.
- The failure-shaped baseline passed: the built feed and Fixtures page contain
  neither Pontypool nor `20260920`; the existing Cardiff VEVENT starts at
  `20261206T123000Z` but has no `DTEND` or opponent.
- The official Guildfordians site and its RFU club page both identify the
  current club as Guildfordians RFC and describe Old Guildfordians as the
  historical name. `Guildordoldians RFC` is therefore corrected rather than
  published.
- The analogous fixture sweep covered every away and all-day match, every
  existing fixture field, the shared page card, formatter, schema, and ICS
  generator. The Pontypool record follows the established date-only away shape;
  Cardiff follows the existing timed-event shape and requires no schema or
  calendar-generator change.
- Research exposed a real edge case absent from the issue's proposed content:
  `FixtureItem` unconditionally appends semantic opponent data, while the ICS
  summary comes only from `title`. A small shared guard is required to satisfy
  both complete calendar titles and non-duplicated page rendering.
- Validation covers the original absence/incomplete event, corrected all-day
  and timed paths, opponent de-duplication, negative location/time behavior,
  ordering, and exact scope. No unresolved blocker remains.

## Implementation validation

- Phase 3.5 found exactly the four planned paths: two fixture records, the
  shared fixture card, and this plan. No schema, selector, ICS generator,
  dependency, workflow, style, or deployment file changed.
- `npm ci` installed 267 packages, reported zero vulnerabilities, and emitted
  only npm's advisory that two transitive install scripts are not yet covered
  by the optional `allowScripts` policy. `npm audit --omit=dev` also passed.
- `npm run check` passed across 19 files with zero errors, warnings, or hints.
- The final `npm run build` passed and generated six pages plus `fixtures.ics`.
- The Pontypool VEVENT has date start `20260920`, exclusive end `20260921`, the
  requested away summary and synthesized description, and no timed start or
  location. The page renders Match/Away chips and `Sun, 20 Sept 2026`.
- The Guildfordians VEVENT has UTC start `20261206T123000Z`, UTC end
  `20261206T133000Z`, the corrected current club name, Cardiff Arms Park
  location, and existing note. The page renders the one-hour range and venue.
- Generated Fixtures HTML contains each opponent exactly once. A temporary
  generic Pontypool title proved the component still appends `vs Pontypool Utd`
  when the title does not name the opponent; restoring the opponent-bearing
  title proved the suffix is suppressed. The first probe's overly specific
  HTML-marker assertion was corrected after direct output inspection; the
  rendered behavior itself was correct.
- Chronology assertions place Pontypool before Clwb Rygbi Caerdydd and the
  Cardiff match after Old Illtydians. Incorrect `Guildordoldians` and
  historical `Old Guildfordians` spellings are absent from generated output.
- The in-app browser runtime reported no available browser, so a visual runtime
  check could not run. Generated HTML card inspection covers the exact visible
  labels, dates, range, venue, order, and opponent de-duplication.
- `git diff --check` passed, and all temporary content changes were restored
  before the final build.
- Exact-path staging contained only the four planned files. All configured
  pre-commit hooks passed against the staged implementation, including YAML,
  large-file, merge/case-conflict, private-key, gitleaks, and Markdown checks,
  without modifying files.

## Branch review

**Classification:** Code-relevant Astro rendering plus fixture content.

**Review iteration 1:** Approved with no blocking finding and two concise
non-blocking follow-up ideas.

- The live issue was re-fetched on 2026-08-19 and remains open and unchanged.
  Its complete body is still dispositioned by Issue traceability.
- The repository has no `docs/pre-pr-branch-review.md`, and the named
  `differential-review` and specialist Trail of Bits skills are unavailable in
  this session. The manual fallback inspected the complete component diff,
  both fixture records, the collection schema, all fixture title/opponent
  shapes, the shared card, date formatter, fixture selectors, ICS generator,
  and generated cards and VEVENTs.
- The title guard is case-insensitive, suppresses only a redundant semantic
  opponent already present in the title, and retains the existing `vs ...`
  suffix for generic titles. Temporary mutation exercised both paths.
- The final analogous sweep found no pre-existing fixture with semantic
  `opponent` data and no adjacent event requiring a current change. Every
  existing TBC away league fixture uses the same date-only/all-day shape, while
  Cardiff remains intentionally timed and has no home/away value because the
  issue supplies none.
- Negative paths pass: Pontypool has no invented time or location; Cardiff
  retains its exact venue and start; neither incorrect club-name variant is
  published; and surrounding fixtures preserve chronological order.
- None of the changed Markdown files contains an executable shell fence, so
  complete-file shell-fence validation is not applicable.
- No unrelated refactor, schema, selector, ICS, dependency, workflow, style,
  or deploy change is present.

## Follow-up ideas

- Replace the Pontypool date-only/all-day start with an offset timestamp after
  coaches confirm kick-off.
- In a separate content-cleanup change, consider removing the Cardiff note's
  duplicated venue/kick-off prose so frontmatter remains the sole schedule
  source of truth.

## Post-PR verification

Pending PR creation.
