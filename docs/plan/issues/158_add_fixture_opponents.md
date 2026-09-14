---
status: Complete
issue: 158
issue_url: https://github.com/denhamparry/squirrelsteam/issues/158
branch: denhamparry.co.uk/fix/gh-issue-158
deploy: no
---

# Plan: Add opponents to named match fixtures

## Problem and outcome

Eighteen match records name their opponent only in `title`. A later `result`
would therefore render as an unnamed win, draw, or loss instead of a score line
with both teams in home/away order. Add structured `opponent` values matching
the titles and document that requirement, while leaving the five Eastern
Community Campus fixtures without an opponent until their TBC names are known.

Issue #158 was fetched on 2026-09-14. It is open, assigned to `denhamparry`,
labelled `calendar` and `content`, and has no comments.

## Acceptance criteria

- [x] Every non-TBC match fixture has an `opponent` matching its title.
- [x] All 18 affected fixtures produce named, home/away-ordered score lines
      when exercised with a representative result.
- [x] The same formatter path supplies named results to the Fixtures page and
      generated calendar descriptions.
- [x] README Results guidance says `opponent` is required for named score
      lines.
- [x] The five Eastern Campus TBC fixtures remain unchanged and without an
      invented opponent.
- [x] Calendar output changes only as intended: 14 note-free affected events
      gain synthesized descriptions, while four note-led events retain their
      existing descriptions and every other property remains stable.
- [x] Astro check/build, production audit, generated-output assertions, diff
      checks, and exact staged pre-commit hooks pass.

## Implementation

1. Add an `opponent` field after `home` in each of the 18 issue-listed fixture
   files, using the opponent spelling already present in its title.
2. Amend the README Results note to make the structured-field dependency
   explicit.
3. Build and inspect the complete fixture collection, generated page, and
   unfolded calendar feed for consistency and unintended drift.

## Files expected to change

- `README.md`
- `src/content/fixtures/abercwmboi-away-cup-2026-10-11.md`
- `src/content/fixtures/clwb-rygbi-caerdydd-away-2026-09-27.md`
- `src/content/fixtures/cricc-away-2027-03-21.md`
- `src/content/fixtures/fairwater-away-2027-04-18.md`
- `src/content/fixtures/llandaff-away-2026-10-18.md`
- `src/content/fixtures/llanharan-away-2027-02-28.md`
- `src/content/fixtures/llanishen-home-2027-04-04.md`
- `src/content/fixtures/old-illts-away-2027-01-10.md`
- `src/content/fixtures/old-illtydians-home-cup-2026-11-08.md`
- `src/content/fixtures/old-penarthians-home-2026-11-22.md`
- `src/content/fixtures/penarth-home-2027-03-14.md`
- `src/content/fixtures/pentyrch-away-2027-01-17.md`
- `src/content/fixtures/pontyclun-home-2027-01-31.md`
- `src/content/fixtures/rumney-home-2026-11-15.md`
- `src/content/fixtures/st-albans-away-2027-01-24.md`
- `src/content/fixtures/st-peters-away-2026-08-28.md`
- `src/content/fixtures/st-peters-home-2026-11-01.md`
- `src/content/fixtures/whitchurch-away-2027-02-14.md`
- `docs/plan/issues/158_add_fixture_opponents.md`

No Eastern Campus fixture, result, title, body, schema, component, library,
dependency, workflow, style, or deployment file is expected to change.

## Validation

- Preserve the failure-shaped baseline probe: it exits 1 and identifies exactly
  the 18 named match fixtures without `opponent`; baseline check, build, and
  audit otherwise pass.
- Parse all fixture frontmatter and require each non-TBC match opponent to
  equal the title segment between `#1415 Gameday:` and its context suffix.
- Require the five TBC fixtures to remain opponent-free and byte-identical to
  `origin/main`.
- Exercise `formatResult` for all 18 records using `us: 17, them: 7`; require
  the Squirrels first for home fixtures and the opponent first for away
  fixtures.
- Verify the generated Fixtures HTML contains each opponent exactly in its
  existing title without an appended duplicate `vs` label.
- Normalize volatile `DTSTAMP` values, unfold both baseline and corrected ICS,
  and compare every VEVENT property. Require only 14 new `DESCRIPTION` lines:
  `Home match vs <opponent>` or `Away match vs <opponent>` for affected events
  without notes. Require the four note-led descriptions to remain unchanged.
- Run `npm run check`, `npm run build`, `npm audit --omit=dev`, `git diff
  --check`, scope assertions, and pre-commit against the exact staged paths.

## Risks and decisions

- `opponent` changes generated calendar descriptions even before a score is
  recorded. That existing behavior is useful fixture context and is accepted
  only for the 14 entries currently lacking notes; complete event comparison
  guards all other calendar fields.
- The four affected note-led fixtures are Abercwmboi, Old Illtydians, St Peters
  away, and Whitchurch. Existing generator precedence must preserve those
  notes rather than synthesize replacement descriptions.
- A schema rule requiring `opponent` whenever `result` exists is optional in
  the issue and unnecessary for this complete content repair. It would also
  introduce a separate validation-policy change, so it remains out of scope.
- Issues #117-#121 own the five Eastern Campus opponent confirmations. No
  placeholder value will be invented here.
- No follow-up issue, deployment, merge, or manual issue closure is authorized.

## Issue traceability

| Source item | Timing / prerequisite | Disposition and evidence target | Result |
| --- | --- | --- | --- |
| 18 named matches lack `opponent` | Pre-merge / fixture data | Add exact title-derived values | Passed |
| Every non-TBC match has matching opponent | Pre-merge / source sweep | Parse all match frontmatter and title segments | Passed |
| Named home/away result on `/fixtures` | Pre-merge / formatter and build | Exercise all 18 and inspect generated HTML | Passed |
| Named result in `fixtures.ics` | Pre-merge / shared formatter path | Exercise formatter and inspect calendar caller | Passed |
| README explains named-score requirement | Pre-merge / documentation | Amend Results guidance | Passed |
| Calendar descriptions may change | Pre-merge / clean baseline | Complete normalized VEVENT comparison | Passed |
| Four note-led descriptions remain | Pre-merge / generator precedence | Require byte-identical description values | Passed |
| Five Eastern Campus fixtures excluded | Pre-merge / issues #117-#121 | Preserve exact files without opponents | Passed |
| Optional schema refinement | N/A / separate policy choice | Intentionally out of scope | Not applicable |
| PR #157 and issue #156 context | Pre-merge / existing result path | Preserve established named-result format | Passed |
| Check, build, audit, diff, and hooks | Pre-merge / dependencies | Run repository quality gates | Passed |
| Deploy, merge, and manual issue closure | N/A / authorization | Intentionally out of scope | Not applicable |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue, its complete affected-file list, exclusions, acceptance
  criteria, calendar warning, suggestions, and references are represented in
  this plan. No comment or unresolved user choice changes the requested scope.
- A source-level failure probe reproduced exactly 18 named matches without an
  opponent. The only other missing match opponents are the five TBC Eastern
  Campus records explicitly excluded by the issue.
- A clean baseline passed `npm run check`, `npm run build`, and `npm audit
  --omit=dev`. The baseline calendar was retained for post-change property
  comparison.
- Existing `formatResult` already orders named scores correctly, both the card
  and calendar call that formatter, and `FixtureItem` suppresses a duplicate
  opponent when the title already contains it. Structured content edits are
  therefore sufficient; no shared-code or schema change is justified.
- Four affected records have markdown notes and 14 do not. The validation now
  distinguishes stable note descriptions from intentional synthesized ones,
  closing the issue's stated calendar-risk gap.
- The planned scope, negative checks, and generated-output assertions cover the
  defect and likely regressions. No unresolved prerequisite remains.

## Implementation validation

- `npm ci` installed 261 packages and found zero vulnerabilities. It emitted
  the existing environment-level allow-scripts advisory for `esbuild` and
  `fsevents` without an install failure or tracked-file change.
- The failure-shaped source probe exited 1 against `origin/main` and listed
  exactly the 18 issue-named fixtures. After implementation, the collection
  sweep validated 22 named matches and five opponent-free TBC matches.
- Each affected source differs from `origin/main` only by its exact
  `opponent` line. The five Eastern Campus files are byte-identical, and no
  title, date, time, flag, location, result, or body changed.
- Representative `17-7` results passed through `formatResult` for all 18
  fixtures. Every home line puts Rhiwbina Squirrels first and every away line
  puts the named opponent first.
- `npm run check` passed across 20 files with zero errors, warnings, or hints.
  `npm run build` generated all six pages and the calendar successfully, and
  `npm audit --omit=dev` found zero production vulnerabilities.
- The generated Fixtures page contains every affected title without an
  appended duplicate opponent. The card and ICS paths continue to share the
  same result formatter.
- Complete unfolded calendar comparison covered all 30 VEVENTs after removing
  volatile `DTSTAMP` values. Exactly 14 note-free events gained their expected
  home/away description; the four note-led events and every other event
  property remained stable.
- `git diff --check`, exact path-scope assertions, and all configured
  pre-commit hooks passed against the staged change set without modifying it.

## Branch review

**Classification:** Code-relevant fixture content because the records compile
into user-visible page and calendar output; README and this plan are
non-executable documentation.

**Review iteration 1:** Approved with no blocking or non-blocking finding.

- The live issue remains open, assigned, and without comments. Every named
  path, acceptance criterion, exclusion, suggestion, calendar consequence, and
  reference is covered by the traceability table.
- The repository has no `docs/pre-pr-branch-review.md`, and no specialist
  differential-review skill is available. The manual fallback inspected the
  complete target-base diff, all fixture records, schema, card renderer,
  result formatter, calendar generator, built page, and every generated event.
- The analogous-pattern sweep found no other named match without an opponent.
  Only the five intentionally TBC fixtures remain opponent-free.
- Failure, success, and negative paths pass: the baseline reproduced the exact
  18-file gap; corrected score lines and calendar output are exact; no TBC,
  note-led description, unrelated event property, or shared implementation
  drift remains.
- The changed Markdown contains no new executable shell fence. The README's
  pre-existing local-development Bash example is unchanged by this work.
- Phase 4.5 produced no follow-up idea; no additional issue is needed.
