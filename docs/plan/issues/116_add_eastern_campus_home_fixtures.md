---
status: In Progress
issue: 116
issue_url: https://github.com/denhamparry/squirrelsteam/issues/116
branch: denhamparry.co.uk/feat/gh-issue-116
deploy: no
---

# Plan: Add five Eastern Community Campus home fixtures

## Problem

Five confirmed home-game dates for the 2026/27 season are absent from the
fixture collection. Their opponents are not yet known, but their Sunday dates,
10:00-12:00 times, and Eastern Community Campus 4G venue are confirmed. Until
records exist, parents cannot see the dates on the Fixtures page or receive
them through the subscribed calendar feed.

## Acceptance criteria

- [ ] Add one fixture record for each of 25 October, 29 November, 13 December
      2026 and 7 and 21 February 2027.
- [ ] Every record is a timed home match at Eastern Community Campus from
      10:00 to 12:00, with explicit `+00:00` offsets.
- [ ] Every record uses the exact TBC title, omits `opponent` and `allDay`, and
      has an empty body.
- [ ] Each fixture appears exactly once on the generated Fixtures page with the
      correct time and venue, and exactly once in `fixtures.ics` with the
      correct UTC start/end, summary, and location.
- [ ] The existing 6 December 2026 Guildfordians fixture remains unchanged and
      no second event is added on that date.
- [ ] Create one follow-up issue per fixture so its opponent can be filled in
      when confirmed.
- [ ] `npm run check`, `npm run build`, generated-output assertions, production
      dependency audit, and repository pre-commit hooks pass.

## Implementation steps

1. Add five date-bearing Markdown fixture records using the schema's timed
   match shape, the exact Eastern Community Campus address, and the shared TBC
   title.
2. Leave every body empty and omit `opponent` and `allDay` so the existing card
   and calendar paths represent the currently known facts without inventing an
   opponent or all-day semantics.
3. Build and parse the complete generated fixture cards and VEVENTs for exact
   date, time, location, title, uniqueness, and chronological-order evidence.
4. Prove the five source records and outputs do not alter or duplicate the 6
   December Guildfordians event.
5. Run the repository validation and exact-file staging gates.
6. Create five concise opponent-confirmation follow-up issues, one for each
   date, linked back to issue #116, and include their links in the PR body.

## Files expected to change

- `src/content/fixtures/eastern-campus-home-2026-10-25.md`
- `src/content/fixtures/eastern-campus-home-2026-11-29.md`
- `src/content/fixtures/eastern-campus-home-2026-12-13.md`
- `src/content/fixtures/eastern-campus-home-2027-02-07.md`
- `src/content/fixtures/eastern-campus-home-2027-02-21.md`
- `docs/plan/issues/116_add_eastern_campus_home_fixtures.md`

No existing fixture, schema, component, library, dependency, workflow, style,
or deployment file is expected to change.

## Validation

- Baseline absence: confirm none of the five date-bearing source files, dates,
  generated cards, or VEVENT UIDs exists on `origin/main`.
- Confirm with a deterministic calendar-day check that all five dates are
  Sundays and that 25 October 2026 is after the Europe/London BST-to-GMT
  transition that morning.
- Run `npm ci`, `npm run check`, and `npm run build`.
- Assert every new source has exactly the requested title, `type: match`,
  `home: true`, full venue, and 10:00/12:00 `+00:00` timestamps, with no
  `opponent`, `allDay`, or body text.
- Parse each complete generated card and require Match/Home presentation, the
  TBC title, Sunday date, 10:00 am-12:00 pm range, venue, and one occurrence.
- Parse each complete VEVENT and require its filename-derived UID, UTC
  `DTSTART`/`DTEND`, TBC summary, escaped full location, no description, and
  one occurrence.
- Require the five cards and events to remain in chronological order among
  their surrounding existing fixtures.
- Compare the 6 December source byte-for-byte with `origin/main`; require its
  existing Guildfordians VEVENT exactly once and no second `20261206` event.
- Run `npm audit --omit=dev`, `git diff --check`, and repository pre-commit
  hooks against the exact staged path set.

## Risks and open questions

- The TBC title intentionally carries the unknown-opponent state because the
  optional `opponent` field must remain absent until a team is confirmed.
- Timed records must omit `allDay`; setting it would make the calendar ignore
  the supplied two-hour window.
- Although 25 October is the clock-change date, the fixture begins well after
  the 02:00 transition. Its explicit `+00:00` offset is therefore required and
  must not be normalized to summer time.
- All five games use the Eastern Community Campus 4G venue rather than the
  usual home ground. The full address must flow through both rendered cards and
  the ICS `LOCATION` field.
- Issue #116 explicitly requires an opponent-confirmation issue for each game.
  Those five deliverables are treated as scoped issue work, distinct from the
  workflow's default handling of incidental review follow-up ideas.
- No deployment, merge, or manual issue closure was requested. The workflow
  stops with one open PR and leaves deployment to the normal main-branch flow.

## Follow-up issues

- [#117](https://github.com/denhamparry/squirrelsteam/issues/117) - confirm the
  opponent for 25 October 2026.
- [#118](https://github.com/denhamparry/squirrelsteam/issues/118) - confirm the
  opponent for 29 November 2026.
- [#119](https://github.com/denhamparry/squirrelsteam/issues/119) - confirm the
  opponent for 13 December 2026.
- [#120](https://github.com/denhamparry/squirrelsteam/issues/120) - confirm the
  opponent for 7 February 2027.
- [#121](https://github.com/denhamparry/squirrelsteam/issues/121) - confirm the
  opponent for 21 February 2027.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Add 25 October 2026 home 4G game | Implement in this PR | Exact source, card, and VEVENT assertions |
| Add 29 November 2026 home 4G game | Implement in this PR | Exact source, card, and VEVENT assertions |
| Add 13 December 2026 home 4G game | Implement in this PR | Exact source, card, and VEVENT assertions |
| Add 7 February 2027 home 4G game | Implement in this PR | Exact source, card, and VEVENT assertions |
| Add 21 February 2027 home 4G game | Implement in this PR | Exact source, card, and VEVENT assertions |
| Use venue-and-date filenames following the Cardiff precedent | Implement in this PR | Five requested `eastern-campus-home-YYYY-MM-DD.md` paths |
| `type: match` and `home: true` for every record | Implement and validate | Exact source fields plus Match/Home card chips |
| Full Eastern Community Campus address | Implement and validate | Source, rendered card, and escaped ICS location |
| Exact 10:00-12:00 timestamps in GMT | Implement and validate | Source offsets, UTC VEVENT fields, and rendered local times |
| 25 October clock-change warning | Implement and validate | Explicit `+00:00` source plus Europe/London offset assertion |
| Omit `opponent` until confirmation | Implement as constrained | Negative source field and VEVENT description assertions |
| Omit `allDay` for timed fixtures | Implement as constrained | Negative source field plus timed VEVENT form |
| Use the proposed TBC title consistently | Implement in this PR | Exact title and summary assertions across all five records |
| Leave fixture bodies empty | Implement as constrained | Frontmatter-only source files and no generated description |
| Fixtures page and ICS each include every date once | Validate in this PR | Complete-card/event uniqueness assertions |
| Preserve the 6 December Guildfordians fixture; add no duplicate | Intentionally unchanged and validate | Source comparison and complete-feed uniqueness check |
| Raise an issue to fill each opponent later | Implement as issue deliverables | Five linked follow-up issue URLs in the PR body |
| Schema reference `src/content.config.ts` | Validate without a change | Existing optional fields accept the planned record shape |
| Existing cadence and surrounding fixtures | Validate without a change | Generated chronological-order assertions |
| Part of epic #10 | Context only | PR closes #116; no epic mutation is required |
| Components, schema, libraries, dependencies, workflows, styles, deployment | Intentionally out of scope | Exact changed-file gate |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue was fetched on 2026-08-23 and remains open. Its complete
  summary, five exact records, proposed title, schema constraints, validation
  requirements, clock-change note, dropped 6 December date, follow-up action,
  and epic context are represented in Issue traceability.
- A clean `npm ci`, `npm run check`, and `npm run build` passed on the baseline;
  Astro reported zero diagnostics and generated six pages plus `fixtures.ics`.
- Baseline assertions confirm that none of the five date-bearing source files,
  UIDs, UTC starts, or Eastern Community Campus cards exists. The current
  Guildfordians UID and 6 December UTC start each occur exactly once.
- A deterministic Europe/London check confirms all five dates are Sundays and
  use GMT at 10:00. On 25 October 2026, the offset changes from `GMT+01:00` at
  00:30 UTC to GMT at 01:30 UTC, well before the fixture begins.
- The analogous sweep covered every match record, all timed and home-match
  shapes, the fixture schema, shared card, date formatter, collection sorting,
  and complete VEVENT generator. The schema defaults omitted `allDay` to false,
  supports an absent opponent, and emits no fallback description for an empty
  TBC match, so content-only additions are sufficient.
- Existing records provide the required pieces: date-bearing fixture filenames,
  timed `+00:00` matches, home flags, locations, empty bodies, and opponent-free
  matches. No existing record needs modification and no shared-code change is
  justified.
- Validation covers the original absence, corrected source/page/feed behavior,
  exact uniqueness, chronological placement, GMT semantics, empty description,
  unchanged 6 December event, exact scope, and repository gates. No unresolved
  blocker remains.

## Implementation validation

- Phase 3.5 found exactly the six planned paths: five new fixture records and
  this plan. No existing fixture, schema, component, library, dependency,
  workflow, style, or deployment file changed.
- `npm ci` installed the 267-package locked tree and reported zero
  vulnerabilities. It emitted the existing environment-level advisory for the
  `esbuild` and `fsevents` install scripts but no install failure or tracked
  dependency change.
- `npm run check` passed across 19 files with zero errors, warnings, or hints.
  `npm run build` passed and generated six pages plus `fixtures.ics`.
- Exact source assertions passed for all five requested paths, titles, types,
  GMT start/end values, home flags, and venue values. Every file is
  frontmatter-only and omits both `opponent` and `allDay`.
- Complete generated-card assertions found exactly one card per date with
  Match/Home chips, the TBC title, Sunday date, 10:00 am-12:00 pm range, and
  full venue. The five cards occur in the expected surrounding chronology and
  have no rendered note or all-day output.
- Complete unfolded-VEVENT assertions found exactly one filename-derived UID
  per record with exact UTC start/end, escaped summary/location, and no
  `DESCRIPTION`, all-day field, or RRULE. There are exactly five matching TBC
  events.
- The 6 December Guildfordians source matches `origin/main` byte-for-byte. Its
  UID and UTC start occur in exactly one VEVENT, and the feed has no second 6
  December event.
- `npm audit --omit=dev` reported zero vulnerabilities and `git diff --check`
  passed. All six changed Markdown files contain zero executable shell fences.
- The exact six intended paths were selectively staged with no unstaged
  changes. Every configured pre-commit hook passed without modifying content,
  including file quality, large-file, merge/case-conflict, private-key,
  gitleaks, and Markdown checks.
- Follow-up issues #117-#121 were created with the existing `enhancement`,
  `calendar`, and `content` labels, one for each opponent-confirmation task.

## Branch review

**Classification:** Code-relevant fixture content because the five Markdown
records compile into user-visible page cards and executable calendar events;
the plan is non-executable documentation.

**Review iteration 1:** Approved with no blocking or incidental non-blocking
finding.

- The live issue was re-fetched on 2026-08-23 and remains open and unchanged.
  Its full contents remain dispositioned in Issue traceability.
- The repository has no `docs/pre-pr-branch-review.md`. The named
  `differential-review` and Trail of Bits specialist skills are unavailable in
  this session, so the concrete manual fallback inspected the complete staged
  diff, schema, every match shape, collection sorting, card rendering, date
  formatting, complete event generation, surrounding fixture data, and all
  relevant generated cards and VEVENTs.
- Each addition is structurally identical except for its requested date. The
  shared title and address are byte-consistent, the timestamps use explicit
  GMT offsets, and the omitted optional fields select the intended timed,
  opponent-unknown, description-free paths.
- The analogous-pattern sweep found no other Eastern Community Campus record
  or occurrence of the five dates. Existing all-day opponent-unknown matches,
  timed matches, home flags, locations, and empty bodies are intentionally
  different combinations supported by the same schema and rendering paths.
- Failure-shaped absence evidence, corrected page/feed behavior, negative
  optional-field paths, ordering, GMT transition, uniqueness, and 6 December
  preservation all pass. No unrelated refactor or behavior change is present.
- Phase 4.5 produced no incidental review idea. Issues #117-#121 satisfy the
  original issue's explicit per-date follow-up requirement rather than a newly
  discovered review suggestion.

## Post-PR verification

Pending PR creation.
