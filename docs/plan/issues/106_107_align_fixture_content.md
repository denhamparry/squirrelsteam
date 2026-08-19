---
status: In Progress
issues:
  - 106
  - 107
issue_urls:
  - https://github.com/denhamparry/squirrelsteam/issues/106
  - https://github.com/denhamparry/squirrelsteam/issues/107
branch: denhamparry.co.uk/fix/gh-issue-106
deploy: no
---

# Plan: Align Cardiff and cup fixture content

## Problem

Four fixture records contain presentation copy that duplicates structured data
or differs from the established league-title pattern. The Cardiff Arms Park
body repeats its `location` and start time, so the Fixtures card and generated
VEVENT describe the same facts twice and can drift after a schedule edit. The
three cup titles name Rhiwbina as well as the opponent, while league titles name
only the opponent and Home/Away side.

Both issues affect the same fixture-content source, rendered card, and calendar
feed, so the user explicitly requested one coordinated pull request.

## Acceptance criteria

### Issue #106

- [x] Remove the Cardiff Arms Park body note so venue and kick-off are owned
      only by frontmatter.
- [x] The built fixture card remains coherent without the redundant note.
- [x] The Cardiff VEVENT retains its summary, start, end, location, and a
      useful synthesized description.

### Issue #107

- [x] Retitle Ynysowen to `#1415 Gameday: Ynysowen (Home)`.
- [x] Retitle Old Illtydians to `#1415 Gameday: Old Illtydians (Home)`.
- [x] Retitle Abercwmboi to `#1415 Gameday: Abercwmboi (Away)`.
- [x] No fixture card or calendar summary contains `Rhiwbina vs` or
      `vs Rhiwbina`.
- [x] All three cup fixtures retain their Cup chip, Home/Away chip, and round
      note.

### Shared validation

- [x] `npm run check`, `npm run build`, generated-output assertions,
      `git diff --check`, and repository pre-commit hooks pass.

## Implementation steps

1. Remove the Cardiff body sentence while preserving all frontmatter.
2. Change only the three named cup `title` fields to the league fixture pattern.
3. Build and inspect the complete Cardiff and cup fixture cards and VEVENTs,
   including negative assertions for stale duplicate and self-versus copy.
4. Run the repository validation and exact-file staging gates.

## Files expected to change

- `src/content/fixtures/cardiff-arms-park-2026-12-06.md`
- `src/content/fixtures/ynysowen-home-cup-2026-09-13.md`
- `src/content/fixtures/old-illtydians-home-cup-2026-11-08.md`
- `src/content/fixtures/abercwmboi-away-cup-2026-10-11.md`
- `docs/plan/issues/106_107_align_fixture_content.md`

No component, collection schema, selector, ICS generator, dependency, workflow,
style, or deployment file is expected to change.

## Validation

- Failure-shaped baseline: build `origin/main` and confirm the Cardiff card and
  VEVENT repeat `Match at Cardiff Arms Park, Cardiff. Kick-off 12:30pm.`, while
  the three card titles and `SUMMARY` lines contain `Rhiwbina vs` or
  `vs Rhiwbina`.
- Run `npm run check` and `npm run build` after implementation.
- Extract the complete Cardiff VEVENT and require its existing UTC start/end,
  location, summary, and synthesized `DESCRIPTION:vs Guildfordians RFC`, with
  no stale venue or kick-off sentence.
- Inspect the Cardiff card for its title, time range, and venue, and confirm the
  redundant body note is absent.
- Require the three exact normalized cup titles on the page and corresponding
  `#1415 Cup:` calendar summaries.
- Require exactly three Cup chips, the expected Home/Away chips on the three
  relevant cards, and exactly one occurrence of each unchanged round note.
- Search all fixture sources plus generated page/feed output for the stale
  `Rhiwbina vs`, `vs Rhiwbina`, and Cardiff body sentence.
- Confirm surrounding fixture order and all non-title frontmatter/body bytes in
  the three cup records remain unchanged through focused diff review.
- Run `git diff --check` and repository pre-commit hooks against the exact
  staged file set.

## Risks and open questions

- Removing the Cardiff body causes the existing ICS generator to synthesize
  `vs Guildfordians RFC` because the record has `type: match` and an `opponent`.
  This is useful, schedule-neutral copy and needs no generator change.
- The three cup records intentionally lack `opponent`; this issue is a
  title-only normalization and must not expand into schema or semantic-data
  work.
- Cup calendar summaries intentionally keep the existing `#1415 Cup:` prefix
  supplied by `eventSummary`; only the opponent/title payload changes.
- Issue #107's acceptance wording covers the Fixtures page and `fixtures.ics`.
  The exhaustive source/output search also prevents a hidden stale title in a
  different fixture record.
- No follow-up issues, deployment, merge, or manual issue closure were
  requested. The workflow stops with one open PR closing both issues.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| #106 affected Cardiff path and exact stale sentence | Implement in this PR | Body removed from the named source; stale sentence absent from page/feed |
| #106 remove the note or rewrite it with non-frontmatter information | Implement by removal | Frontmatter remains the sole schedule source of truth |
| #106 card remains coherent | Validate without component change | Generated card retains title, time range, venue, and no empty note wrapper |
| #106 VEVENT remains coherent | Validate without generator change | Existing match/opponent fallback supplies a useful description |
| #106 future schedule changes should not require two edits | Implement in this PR | No body-owned venue or start remains |
| #106 reference to PR #104 and issue #103 | Context only | Current source and generator behavior inspected from `origin/main` |
| #107 Ynysowen exact title | Implement in this PR | Named source, card title, and Cup summary assertions |
| #107 Old Illtydians exact title | Implement in this PR | Named source, card title, and Cup summary assertions |
| #107 Abercwmboi exact title | Implement in this PR | Named source, card title, and Cup summary assertions |
| #107 title-only edit; no `opponent` fields | Implement as constrained | Diff contains no new field or shared component change |
| #107 retain Cup context and round copy | Validate without changing | Chips and all three round notes in built card output |
| #107 no self-versus copy on page or calendar | Implement and validate | Negative source/page/feed search |
| #107 run build and check | Validate in this PR | Astro commands and generated-output assertions |
| #107 part of epic #10 | Context only | PR closes only #106 and #107 |
| Components, schema, selectors, ICS generator, dependencies, workflows, styles, deploy | Intentionally out of scope | Exact changed-file gate |

## Research validation

**Overall assessment:** Approved after one review iteration.

- Both live issues were fetched on 2026-08-19 and remain open. Their complete
  bodies, named files, exact requested titles, build/check requirements,
  references, epic context, and explicit title-only constraint are represented
  in Issue traceability.
- The failure-shaped baseline passed. A fresh `npm run check` reported zero
  diagnostics and `npm run build` generated six pages plus `fixtures.ics`. The
  Cardiff body sentence appears in both its card and VEVENT, and all three cup
  self-versus titles appear in both card titles and Cup summaries.
- The analogous fixture sweep covered every fixture title, all occurrences of
  `Rhiwbina vs` and `vs Rhiwbina`, the shared card, collection schema, fixture
  page, and complete ICS event builder. Only the three issue-named cup records
  use the inconsistent self-versus form.
- Removing the Cardiff body is safer than replacing it with invented prose:
  `src/lib/ics.ts` already synthesizes `vs Guildfordians RFC` for an empty-body
  match with an opponent, while the card already renders the structured title,
  time range, and location.
- The cup title change flows unchanged through the card and through the
  existing `eventSummary` Gameday-to-Cup transformation. The Cup and Home/Away
  chips are driven by unchanged `cup` and `home` fields, and the round notes are
  independent body content.
- Validation covers the original failures, corrected page/feed behavior,
  negative stale-copy paths, preserved chips/notes, exact scope, and repository
  gates. No unresolved blocker remains.

## Implementation validation

- Phase 3.5 found exactly the five planned paths: four fixture records and this
  combined plan. No component, schema, selector, ICS generator, dependency,
  workflow, style, or deployment file changed.
- `npm ci` installed the locked dependency tree. `npm run check` passed across
  19 files with zero errors, warnings, or hints, and `npm run build` generated
  six pages plus `fixtures.ics`.
- Generated-output assertions found the three normalized card titles and Cup
  summaries, exactly three Cup chips, the expected Home/Away chips, and all
  three unchanged round notes. The cup cards remain in chronological order.
- The Cardiff card retains the complete 12:30pm-1:30pm range and venue, has no
  note wrapper, and the VEVENT retains the exact UTC start/end, summary, escaped
  location, and synthesized `DESCRIPTION:vs Guildfordians RFC`.
- Complete source/page/feed searches contain none of `Rhiwbina vs`,
  `vs Rhiwbina`, or the removed Cardiff body sentence.
- Byte-level comparisons confirmed the three cup files differ from
  `origin/main` only on line 2, and the Cardiff frontmatter is byte-identical.
- The first Cardiff VEVENT assertion expected a `.md` suffix in the content
  entry UID and failed. Direct output inspection showed the real unchanged UID
  omits that suffix; the corrected complete-event extraction passes every
  expected field. This was an assertion defect, not an implementation defect.
- `npm audit --omit=dev` reported zero vulnerabilities and `git diff --check`
  passed.
- Exact-path staging contained only the five planned files. All configured
  pre-commit hooks passed against that staged implementation, including file
  quality, large-file, merge/case-conflict, private-key, gitleaks, and Markdown
  checks, without modifying files.

## Branch review

**Classification:** Code-relevant fixture data because the changed Markdown is
compiled into user-visible cards and an executable calendar feed.

**Review iteration 1:** Approved with no blocking or non-blocking finding.

- The live issues were re-fetched on 2026-08-19 and remain open and unchanged.
  Their complete contents are still dispositioned in Issue traceability.
- The repository has no `docs/pre-pr-branch-review.md`. The named
  `differential-review` and Trail of Bits specialist skills are unavailable in
  this session, so the concrete manual fallback inspected the complete diff,
  every fixture title, the three full cup records, Cardiff frontmatter, both
  `FixtureItem` consumers, the collection schema, and the complete event
  summary/description paths in `src/lib/ics.ts`.
- The final analogous sweep found no other self-versus fixture title and no
  other Cardiff schedule sentence. Only the three issue-named records had the
  root-cause title shape, and the Cardiff body was the only duplicated source
  identified by issue #106.
- Cup/Home/Away chips and round notes remain driven by unchanged frontmatter
  and body fields. The Cardiff empty-body path uses the existing semantic
  opponent fallback and renders no empty note wrapper.
- All five changed Markdown files contain zero `bash` or `sh` fences, so
  complete-file executable-fence validation is not applicable.
- No unrelated refactor or scope expansion is present. No follow-up idea was
  found.
