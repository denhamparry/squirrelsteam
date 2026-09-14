---
status: Complete
issue: 127
issue_url: https://github.com/denhamparry/squirrelsteam/issues/127
branch: denhamparry.co.uk/fix/gh-issue-127
deploy: no
---

# Plan: Add missing home fixture locations

## Problem and outcome

Eight ordinary home-match records have no venue, so their Fixtures cards and
calendar events omit information parents need. The user has confirmed the home
venue is `Caedelyn Park, CF14 6EJ`. Add that exact existing location value to
all eight issue-listed records while preserving the five Eastern Community
Campus home fixtures at their confirmed alternate venue.

Issue snapshot fetched on 2026-09-14; the issue was open and had no comments.

## Acceptance criteria

- [x] All eight issue-listed home fixtures set
      `location: Caedelyn Park, CF14 6EJ`.
- [x] Every home fixture has a location; the five Eastern Community Campus
      records retain their existing byte-identical venue.
- [x] Each affected Fixtures card renders the confirmed venue line.
- [x] Each affected VEVENT emits the matching escaped `LOCATION` value.
- [x] Titles, dates, times, offsets, home/cup flags, and bodies remain
      unchanged.
- [x] Repository check, build, production audit, generated-output assertions,
      diff checks, and pre-commit hooks pass.

## Implementation steps

1. Add the exact confirmed venue after `home: true` in each of the eight named
   fixture records.
2. Build and inspect all eight complete generated cards and VEVENTs.
3. Confirm all thirteen home fixtures have a location, the five Eastern Campus
   values remain unchanged, and every away fixture remains untouched.
4. Run repository validation and exact staged-file pre-commit hooks.

## Files expected to change

- `src/content/fixtures/llanishen-home-2027-04-04.md`
- `src/content/fixtures/old-illtydians-home-cup-2026-11-08.md`
- `src/content/fixtures/old-penarthians-home-2026-11-22.md`
- `src/content/fixtures/penarth-home-2027-03-14.md`
- `src/content/fixtures/pontyclun-home-2027-01-31.md`
- `src/content/fixtures/rumney-home-2026-11-15.md`
- `src/content/fixtures/st-peters-home-2026-11-01.md`
- `src/content/fixtures/ynysowen-home-cup-2026-09-13.md`
- `docs/plan/issues/127_add_home_fixture_locations.md`

No away fixture, Eastern Campus fixture, title, schema, component, library,
dependency, workflow, style, or deployment file is expected to change.

## Validation

- Failure-shaped baseline: after a clean build, require all eight sources,
  cards, and corresponding VEVENTs to lack a location while the five Eastern
  Campus home fixtures retain their location.
- Run `npm run check`, `npm run build`, and `npm audit --omit=dev`.
- Parse each complete affected source, card, and unfolded VEVENT; require the
  exact source/display value and ICS value `Caedelyn Park\, CF14 6EJ`.
- Compare every affected source with `origin/main` after removing only the new
  location line, proving no title, date, time, offset, flag, or body drift.
- Assert all thirteen `home: true` records have a location, exactly eight use
  Caedelyn Park, and the five Eastern Campus records retain their existing
  location.
- Confirm no away fixture or shared implementation file changed.
- Run `git diff --check` and repository pre-commit hooks against the exact
  staged paths. No server or external service is required; `npm run build`
  owns ignored `dist/` generation.

## Risks and open questions

- The confirmation applies to the eight issue-listed ordinary home fixtures;
  Eastern Community Campus is a known alternate venue and must not be
  overwritten.
- Reusing the exact training-fixture string avoids display and calendar
  spelling drift. ICS comma escaping is handled by the existing generator.
- Away grounds remain intentionally out of scope because the issue says they
  require opponent confirmation.
- Venue facts remain in frontmatter; no body prose is added, following issues
  #97 and #101.
- No follow-up issue, deployment, merge, or manual issue closure was requested.

## Issue traceability

| Issue item | Timing / owner / prerequisite | Disposition and evidence | Current result |
| --- | --- | --- | --- |
| Eight named home fixtures lack `location` | Pre-merge / Codex / user confirmation | Add the exact venue to all eight sources | Pass |
| Every home fixture has a location or pending note | Pre-merge / Codex / source collection | Validate all thirteen home records have locations | Pass |
| Cards render venue lines | Pre-merge / Codex / successful build | Parse each complete affected card | Pass |
| VEVENTs emit matching `LOCATION` | Pre-merge / Codex / successful build | Parse each complete unfolded event | Pass |
| Reuse `Caedelyn Park, CF14 6EJ` exactly | Pre-merge / Codex / user confirmation | Byte-identical source and display assertions | Pass |
| Preserve titles, dates, times, and offsets | Pre-merge / Codex / base comparison | Remove only added lines and compare with `origin/main` | Pass |
| Preserve home/cup flags and body prose | Pre-merge / Codex / base comparison | Complete-file comparison and output assertions | Pass |
| Five Eastern Campus fixtures use another confirmed venue | Pre-merge / Codex / existing records | Validate without changes | Pass |
| Away fixture locations are secondary and unconfirmed | Pre-merge / Codex / issue scope | Intentionally out of scope; changed-file gate | Pass |
| `src/lib/ics.ts` and card rendering already support locations | Pre-merge / Codex / existing code | Validate existing paths without shared-code changes | Pass |
| PR #126 and issues #123/#116 context | Pre-merge / Codex / repository history | Preserve the completed Eastern Campus implementation | Pass |
| Issues #105 and #117–#121 relate to opponent/kick-off follow-ups | Pre-merge / Codex / issue scope | Not applicable to home-venue additions | Pass |
| Issues #97/#101 keep facts in frontmatter | Pre-merge / Codex / repository precedent | Add no body prose | Pass |
| Check, build, audit, diff, and hooks | Pre-merge / Codex / local dependencies | Run and record repository validation | Pass |
| Deploy or live-site mutation | N/A / user / explicit authorization | Intentionally out of scope | Pass |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue was fetched on 2026-09-14 and remains open with no comments.
  Its eight affected home paths, five alternate-venue records, thirteen away
  paths, output expectations, preservation constraints, and references are all
  dispositioned above together with the user's venue confirmation.
- A clean baseline build reproduced the complete defect: exactly eight of the
  thirteen `home: true` records lack `location`; all eight corresponding cards
  lack `fixture__where`; and all eight corresponding unfolded VEVENTs lack
  `LOCATION`. The five Eastern Campus home records retain their exact venue.
- The schema already accepts optional `location`, `FixtureItem` renders it as a
  venue line, and `src/lib/ics.ts` emits and escapes it. The same Caedelyn Park
  value is already used by both training fixtures and documented in the
  repository, so no shared-code or copy decision remains.
- The analogous-pattern sweep covered all thirty fixtures, all thirteen home
  records, both existing Caedelyn training values, the five Eastern Campus
  values, and all source/card/calendar consumers. The issue-listed eight are
  the complete ordinary-home gap.
- Issues #117–#121 remain open and own only the five Eastern Campus opponent
  confirmations; retaining those fixture locations and titles avoids a
  semantic collision. Away venues remain intentionally unconfirmed and out of
  scope.
- Failure, success, preservation, exact-scope, and negative away/alternate
  venue checks are practical before merge. No deferred acceptance or
  unresolved blocker remains.

## Implementation validation

- Phase 3.5 found exactly the nine planned paths: eight home fixtures and this
  plan. No away fixture, Eastern Campus fixture, shared code, dependency,
  workflow, style, or deployment file changed.
- `npm ci` installed 261 packages and found zero vulnerabilities. It emitted
  the existing environment-level allow-scripts advisory for `esbuild` and
  `fsevents` without an install failure or tracked-file change.
- `npm run check` passed across 19 files with zero errors, warnings, or hints.
- `npm run build` passed and generated six pages plus `fixtures.ics`.
- Exact complete-file comparisons prove each affected source differs from
  `origin/main` only by one `location: Caedelyn Park, CF14 6EJ` line, retaining
  titles, dates, all-day values, home/cup flags, and bodies.
- All eight generated cards contain one Caedelyn venue line, and all eight
  unfolded VEVENTs contain one escaped `LOCATION:Caedelyn Park\, CF14 6EJ`.
- All thirteen home records now have a location: eight Caedelyn Park values
  and five unchanged Eastern Campus values. No away fixture changed.
- `npm audit --omit=dev` found zero vulnerabilities and `git diff --check`
  passed.
- Every configured repository pre-commit hook passed against the exact staged
  eight fixtures and plan, including Markdown lint and gitleaks, without
  modifying files.

## Branch review

**Classification:** Code-relevant fixture content because the Markdown records
compile into user-visible cards and calendar events; the plan is
non-executable documentation.

**Review iteration 1:** Approved with no blocking or non-blocking finding.

- The live issue was re-fetched on 2026-09-14 and remains open and unchanged,
  with no comments. Every affected path, acceptance criterion, related issue,
  suggested constraint, and explicit away-fixture exclusion remains covered by
  traceability.
- The repository has no `docs/pre-pr-branch-review.md`. The named
  `differential-review` and Trail of Bits specialist skills are unavailable in
  this session, so the manual fallback inspected the complete diff, all thirty
  fixture sources, all thirteen home records, the schema, card renderer,
  calendar generator, and complete generated cards and events.
- Every edit is the same confirmed value at the same frontmatter ownership
  boundary. ICS escaping remains correct, and existing alternate venues are
  byte-identical to `origin/main`.
- The final analogous sweep found no location-free home fixture. Away records
  remain intentionally different because their grounds are unconfirmed, and
  issues #117–#121 remain limited to Eastern Campus opponent confirmations.
- Failure, success, and negative paths pass: the baseline reproduced eight
  missing venues; corrected outputs contain all eight; no alternate venue,
  away fixture, schedule field, flag, body, or shared implementation changed.
- All nine changed Markdown files contain zero executable `bash` or `sh`
  fences, so complete-file shell-fence validation is not applicable.
- Phase 4.5 produced no follow-up idea; no additional issue is needed.
