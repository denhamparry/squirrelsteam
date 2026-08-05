---
status: Complete
issue: 60
issue_url: https://github.com/denhamparry/squirrelsteam/issues/60
branch: denhamparry.co.uk/feat/gh-issue-060
---

# Plan: Add U12s Cup / Plate Pool 3 fixtures

## Problem

The 2026/27 fixtures currently contain three now-cancelled events on the dates
reserved for Rhiwbina's U12s Cup / Plate Pool 3 matches. The fixture schema has
no cup metadata, so the website and generated calendar cannot identify cup
matches distinctly.

## Source interpretation

The live issue is the implementation source as of 2026-08-05. Its pool graphic
lists fixtures in home-versus-away order and its maintainer-authored table maps
Rhiwbina as home against Ynysowen, away at Abercwmboi, and home against Old
Illtydians. The implementation will use `home: true`, `false`, and `true`
respectively and will not infer kickoff times or venue addresses that the source
does not provide.

## Acceptance criteria

- [x] Add cup fixtures dated 2026-09-13, 2026-10-11, and 2026-11-08.
- [x] Remove the Tournament, Cowbridge, and Caerau fixtures cancelled on those
      dates.
- [x] Show a visible `Cup` designation on cup fixture cards.
- [x] Include `Cup` in each cup event's generated calendar title.
- [x] Preserve the source's home, away, home ordering.
- [x] Pass `npm run check` and `npm run build`.

## Implementation steps

1. Extend the fixture content schema with a defaulted `cup` boolean, keeping cup
   status independent of the existing event type taxonomy.
2. Add three all-day match entries with the issue dates, opponents, source
   home/away values, and `cup: true`. Record the complete pool name in each
   fixture's note body.
3. Remove the three superseded fixture entries named by the issue.
4. Render a visually distinct `Cup` chip from cup metadata in the
   shared `FixtureItem` component, keeping the existing Match and Home/Away
   chips intact on every page that uses the component.
5. Derive the iCalendar summary from cup metadata so cup entries use
   the established `#1415 Cup:` prefix while ordinary fixture titles remain
   unchanged.
6. Validate the complete built Fixtures page and calendar feed, including
   positive cup assertions and negative assertions for cancelled fixtures.

## Files expected to change

- `docs/plan/issues/60_add_u12_cup_fixtures.md`
- `src/content.config.ts`
- `src/components/FixtureItem.astro`
- `src/lib/ics.ts`
- `src/content/fixtures/ynysowen-home-cup-2026-09-13.md` (new)
- `src/content/fixtures/abercwmboi-away-cup-2026-10-11.md` (new)
- `src/content/fixtures/old-illtydians-home-cup-2026-11-08.md` (new)
- `src/content/fixtures/tournament-2026-09-13.md` (deleted)
- `src/content/fixtures/cowbridge-home-2026-10-11.md` (deleted)
- `src/content/fixtures/caerau-away-2026-11-08.md` (deleted)

## Validation

- Record a failure-shaped baseline showing the three cancelled files present,
  the replacement files absent, and no cup field in the schema.
- Run `npm run check`.
- Run `npm run build`.
- Inspect `dist/fixtures/index.html` for three Cup chips, the three opponents,
  and the absence of Tournament, Cowbridge, and Caerau on the replaced dates.
- Inspect `dist/fixtures.ics` for the three expected dates and `#1415 Cup:`
  summaries, and assert the cancelled summaries are absent.
- Run `git diff --check` and the repository pre-commit hooks on the exact staged
  file set before committing.
- Visually inspect the built Fixtures page at mobile and desktop widths.

## Risks and open questions

- The source gives dates but no kickoff times, so the three entries must remain
  all-day events.
- The issue suggests editing `src/pages/fixtures.astro`, but the shared
  `FixtureItem` component owns fixture badges. Keeping the change there also
  makes the designation consistent in the home-page `Next up` rendering.
- Calendar prefixing must be limited to entries with `cup: true` so
  all existing summaries remain byte-for-byte unchanged.
- No deploy is requested. The workflow stops with an open PR.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Three Rhiwbina pool fixtures and dates | Implement in this PR | Three new content entries and built page/feed assertions |
| Other pool games not involving Rhiwbina | Intentionally out of scope | No entries created for those games |
| Tournament, Cowbridge, and Caerau cancellations | Implement in this PR | Three deletions and negative built-output assertions |
| Competition model recommendation | Implement in this PR | Defaulted `cup` schema field, one of the issue's proposed approaches |
| Distinctive black-and-white Cup badge | Implement in this PR | Shared fixture component and visual inspection |
| Cup designation in calendar titles | Implement in this PR | `cup`-aware summary generation and feed assertions |
| Home/away confirmation | Validate without an additional source change | Issue table and pool ordering map to home, away, home |
| Build and type-check | Validate in this PR | `npm run build` and `npm run check` |
| Deployment | Intentionally out of scope | No deploy flag or deploy plan metadata |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The shared `FixtureItem` component, rather than the page wrapper, is the
  correct badge owner because both the Fixtures page and home-page `Next up`
  list use it.
- A defaulted `cup` boolean is the smallest schema change proposed by the issue
  and preserves every existing fixture without frontmatter churn.
- The calendar change will preserve existing summaries and use a fallback
  `Cup:` prefix if a future cup title does not use the current `#1415
  Gameday:` convention.
- Failure-shaped baseline on 2026-08-05 confirmed that all three cancelled
  entries exist, all three replacements are absent, and the schema/content have
  no cup field.
- The source contains no kickoff times or venue addresses; all-day entries and
  no invented locations are therefore required.
- Scope inspection found the cancelled occurrences only in their fixture files
  and found `FixtureItem` consumers in `src/pages/fixtures.astro` and
  `src/pages/index.astro`. No unrelated analogous fixture requires a change.

## Branch review

**Classification:** Code-relevant Astro/TypeScript, schema, and content changes.

**Review iteration 1:** Approved with no blocking findings.

- Live issue #60 was re-fetched on 2026-08-05 and every issue statement remains
  represented in Issue traceability.
- Phase 3.5 found exactly the ten expected paths: four modified, three added,
  and three deleted. No unrelated path changed.
- `differential-review` and the named Trail of Bits specialist skills are not
  available in this Codex session. The manual fallback inspected the complete
  diff, both `FixtureItem` consumers, the calendar endpoint and collection
  call chain, schema defaults, content dates, generated HTML, and all generated
  calendar summaries.
- The `cup` default keeps all 19 non-cup fixture records behaviorally unchanged.
  A full metadata-to-calendar comparison confirmed all 22 generated summaries.
- Generated HTML contains exactly three Cup chips with the expected home, away,
  home values and dates; the three cancelled event names are absent.
- The in-app browser backend was unavailable after the required discovery and
  troubleshooting steps. Manual generated-markup/CSS inspection confirmed the
  scoped Cup styles and responsive component reuse, but no rendered screenshot
  was available.
- Changed Markdown files contain no Bash or shell fences, so complete-file shell
  fence validation is not applicable.
- `npm audit --omit=dev` reports zero production vulnerabilities. Full
  `npm audit` reports five pre-existing development-tool findings (four
  moderate, one high); dependency manifests and the lockfile are unchanged.

## Follow-up ideas

- Non-blocking: update the Astro language-server development dependency chain
  in a separate dependency PR to clear the existing `fast-uri` and `yaml`
  audit findings.

## Post-PR verification

**Implementation head reviewed:**
`447c0328ac7cac493dee9636bdf3d88b1a42f3f1`

**Outcome:** Passed independently with no blocking finding. The existing
development-dependency audit item remains the only non-blocking follow-up.

| Criterion or issue statement | Independent evidence | Result |
| --- | --- | --- |
| Three cup fixtures have the specified dates | Parsed the three replacement files and asserted one generated DTSTART for 20260913, 20261011, and 20261108 | Pass |
| Cancelled Tournament, Cowbridge, and Caerau fixtures are removed | Confirmed all three source paths and generated page/feed summaries are absent | Pass |
| Fixtures page displays Cup designation | Fresh build contains exactly three scoped Cup-chip elements on the Fixtures page | Pass |
| Calendar titles display Cup designation | Fresh feed contains the three expected `#1415 Cup:` summaries | Pass |
| Home/away status is home, away, home | Parsed `home: true`, `false`, `true` and checked corresponding generated Home/Away chips | Pass |
| Other pool games stay out of scope | Asserted all three non-Rhiwbina pairings are absent from the built page and feed | Pass |
| Existing fixture behavior remains intact | Independently mapped all 22 source titles through cup metadata and matched every generated calendar summary with no duplicates | Pass |
| Shared rendering remains safe | Confirmed the Fixtures page has three Cup chips and the home-page `Next up` list has the expected one current Cup chip | Pass |
| Type and production builds succeed | Re-ran `npm run check` and `npm run build` from the PR head | Pass |
| Required GitHub checks succeed | `Assign PR to denhamparry` and `CI Placeholder` both passed for PR #61 | Pass |

The local, remote branch, and GitHub PR head all matched the reviewed
implementation SHA. The in-app browser remained unavailable, so the independent
pass inspected generated markup and CSS rather than claiming a rendered visual
check.
