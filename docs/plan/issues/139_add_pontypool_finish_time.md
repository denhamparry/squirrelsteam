---
status: Complete
issue: 139
issue_url: https://github.com/denhamparry/squirrelsteam/issues/139
branch: denhamparry.co.uk/fix/gh-issue-139
deploy: no
---

# Plan: Add the Pontypool Utd away match finish time

## Problem and outcome

The 20 September 2026 Pontypool Utd away match has a confirmed 11:00 am BST
start but no end. The user has now confirmed that it finishes at 12:00 pm
(midday), so the source should carry an explicit BST `end`. The generated
calendar event should span one hour and the Fixtures page should show the full
time range.

Issue snapshot fetched on 2026-09-14; the issue was open and had no comments.

## Acceptance criteria

- [x] `src/content/fixtures/pontypool-utd-away-2026-09-20.md` sets
      `end: 2026-09-20T12:00:00+01:00` alongside the existing offset start.
- [x] The generated Pontypool VEVENT emits timed
      `DTSTART:20260920T100000Z` and `DTEND:20260920T110000Z`.
- [x] The Fixtures page card shows `11:00 am–12:00 pm` rather than a bare start.
- [x] Repository check, build, production audit, generated-output assertions,
      diff checks, and pre-commit hooks pass.

## Implementation steps

1. Add only the confirmed same-day offset `end` to the Pontypool fixture.
2. Build and inspect the complete generated VEVENT and fixture card.
3. Confirm identity, match metadata, neighboring ordering, and unrelated
   fixtures remain unchanged.
4. Run the repository validation and exact staged-file pre-commit workflow.

## Files expected to change

- `src/content/fixtures/pontypool-utd-away-2026-09-20.md`
- `docs/plan/issues/139_add_pontypool_finish_time.md`

No schema, formatter, calendar generator, component, dependency, workflow,
other fixture, or deployment file is expected to change.

## Validation

- Failure-shaped baseline: build `origin/main` and confirm the Pontypool VEVENT
  has `DTSTART:20260920T100000Z` with no `DTEND`, while the Fixtures card shows
  only `11:00 am`.
- Run `npm run check`, `npm run build`, and `npm audit --omit=dev`.
- Parse the complete Pontypool VEVENT and require its exact UTC start/end,
  unchanged UID, summary, description, and absence of date-valued properties.
- Inspect generated Fixtures HTML for `Sun, 20 Sept 2026, 11:00 am–12:00 pm`,
  Match/Away presentation, and stable neighboring order.
- Confirm the source end is exactly one hour after the start and that no other
  fixture source changed.
- Run `git diff --check` and repository pre-commit hooks against the exact
  staged paths. No local server or external service is required; `npm run
  build` owns generated artifact creation and `dist/` is ignored.

## Risks and open questions

- 20 September is within British Summer Time, so midday is represented by
  `12:00:00+01:00` and emitted as 11:00 UTC.
- The source schema and both output paths already support this same-day timed
  range; changing shared code would be unnecessary scope.
- The user's 12 pm confirmation is authoritative and resolves the issue's
  instruction not to invent a time before confirmation.
- No follow-up issue, deployment, merge, or manual issue closure was requested.

## Issue traceability

| Issue item | Timing / owner | Disposition and evidence target | Current result |
| --- | --- | --- | --- |
| Add an offset end matching the confirmed finish | Pre-merge / Codex | Implement exact `12:00:00+01:00` source value | Pass |
| Preserve the existing 11:00 am start | Pre-merge / Codex | Validate source and UTC `DTSTART` | Pass |
| Generated VEVENT has timed start and end | Pre-merge / Codex | Parse the complete built event | Pass |
| Fixtures card shows a start–finish range | Pre-merge / Codex | Assert built HTML card text | Pass |
| Preserve fixture identity, away/opponent metadata, and date | Pre-merge / Codex | Source and generated-output assertions | Pass |
| Suggested `12:00:00+01:00` example only after confirmation | Pre-merge / Codex | User confirmation plus exact implementation | Pass |
| RFC zero-length failure described by the issue | Pre-merge / Codex | Failure-shaped baseline without `DTEND` | Pass |
| `src/lib/ics.ts` affected-path context | Pre-merge / Codex | Validate existing conditional generator without changing it | Pass |
| Issues #105, #115, and #138 precedent/context | Pre-merge / Codex | Compare existing source and completed plan patterns | Pass |
| Schema, shared rendering/generator code, other fixtures, deploy | Pre-merge / Codex | Intentionally out of scope; exact changed-file gate | Pass |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue was fetched on 2026-09-14 and remains open with no comments.
  Its context, affected paths, failure scenario, acceptance criteria, and
  references are represented above together with the user's authoritative
  12:00 pm confirmation.
- The schema already accepts an optional offset `end`; the calendar generator
  emits timed `DTEND` when it is present; and the shared page formatter renders
  a same-day start–finish range. No shared-code change is needed.
- The analogous-pattern sweep covered every timed fixture, all explicit ends,
  the Pontypool source and prior plan, the St Peters precedent, the formatter,
  and the calendar generator. Pontypool is the only timed fixture without an
  end; other time ranges use the same offset-timestamp shape.
- A fresh baseline build reproduced the issue: the complete Pontypool VEVENT
  has `DTSTART:20260920T100000Z` and no `DTEND`, while the built card shows only
  `Sun, 20 Sept 2026, 11:00 am`.
- The first baseline page assertion exited 1 because its selector required an
  exact `<li class="fixture">` tag and did not allow Astro's generated data
  attribute. This was classified as a harness/setup failure; the corrected
  bounded-card selector passed and reproduced the intended failure state.
- Validation covers the corrected feed and page paths, negative all-day
  output, exact duration, identity, ordering, and exact file scope. No
  unresolved blocker remains.

## Implementation validation

- Phase 3.5 found exactly the two planned paths: the Pontypool fixture and this
  plan. No shared code, dependency, workflow, other fixture, or deployment file
  changed.
- `npm ci` installed 261 packages and found zero vulnerabilities. It emitted
  the existing environment-level allow-scripts advisory for `esbuild` and
  `fsevents` without an install failure or tracked-file change.
- `npm run check` passed across 19 files with zero errors, warnings, or hints.
- `npm run build` passed and generated six pages plus `fixtures.ics`.
- Exact assertions passed for the source timestamps, one-hour duration,
  complete timed VEVENT, unchanged UID/summary/description, absence of
  `VALUE=DATE`, Match/Away card, `11:00 am–12:00 pm` range, and Upcoming order
  before Clwb Rygbi Caerdydd.
- `npm audit --omit=dev` and `git diff --check` passed.
- A combined `npm run build && node <generated assertions>; npm audit
  --omit=dev; git diff --check` attempt returned shell exit 0 even though the
  nested Node assertion exited 1. It was rejected as a harness/setup failure:
  the assertion incorrectly compared Upcoming and Past sections, and the shell
  lacked fail-fast handling. The corrected standalone generated assertion
  exited 0 before audit and diff checks were accepted separately.
- The first analogous sweep using `rg -L ... | while ...` returned shell exit 0
  while inner `rg` calls rejected `path:match` strings. It was rejected as a
  harness/setup failure. The explicit `rg --files-without-match` sweep exited 0
  and confirmed every timed fixture now has an explicit end.
- Every configured repository pre-commit hook passed against the exact staged
  fixture and plan paths, including Markdown lint and gitleaks, without
  modifying files.

## Branch review

**Classification:** Code-relevant fixture content because the Markdown record
changes generated site and calendar behavior; the plan is non-executable
documentation.

**Review iteration 1:** Approved with no blocking or non-blocking finding.

- The live issue was re-fetched on 2026-09-14 and remains open and unchanged,
  with no comments. Every issue item remains dispositioned in traceability.
- The repository has no `docs/pre-pr-branch-review.md`. The named
  `differential-review` and Trail of Bits specialist skills are unavailable in
  this session, so the manual fallback inspected the complete diff, source
  schema, generator conditional, time-range formatter, all timed fixture/end
  shapes, prior Pontypool work, and the St Peters precedent.
- The exact end is after the preserved start, uses the correct September BST
  offset, and generates a one-hour timed event and same-day display range.
- The final analogous-pattern sweep confirmed every timed fixture now has an
  explicit end. Other duration values and all-day entries are intentionally
  different fixture records.
- Failure, success, and negative paths pass: the baseline reproduced the
  missing end; corrected output has the exact midday finish; no date-valued
  output, identity change, related-fixture change, or Upcoming ordering
  regression remains.
- Neither changed Markdown file contains an executable Bash or shell fence, so
  complete-file executable-fence validation is not applicable.
- Phase 4.5 produced no follow-up idea; no additional issue is needed.
