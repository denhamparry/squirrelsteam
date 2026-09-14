---
status: Complete
issue: 105
issue_url: https://github.com/denhamparry/squirrelsteam/issues/105
branch: denhamparry.co.uk/fix/gh-issue-105
deploy: no
---

# Plan: Time the Pontypool Utd away fixture

## Problem and outcome

The 20 September 2026 away match against Pontypool Utd is still represented as
an all-day fixture because kick-off was unknown when it was added. The user has
now confirmed an 11:00 am kick-off. The source, generated calendar event, and
Fixtures card should therefore use a timed BST start without inventing an
unknown finish time.

## Acceptance criteria

- [x] `src/content/fixtures/pontypool-utd-away-2026-09-20.md` uses
      `start: 2026-09-20T11:00:00+01:00` and no longer sets `allDay: true`.
- [x] A fresh build emits timed `DTSTART:20260920T100000Z` for the Pontypool
      VEVENT, with no date-valued `DTSTART`/`DTEND`, and the Fixtures card shows
      `11:00 am`.
- [x] The match identity, away/opponent fields, date, ordering, and absence of
      an unconfirmed venue or finish time remain unchanged.
- [x] `npm run check`, `npm run build`, `npm audit --omit=dev`, generated-output
      assertions, `git diff --check`, and repository pre-commit hooks pass.

## Implementation steps and expected files

1. Replace the date-only start with the confirmed offset timestamp and remove
   the all-day flag in the Pontypool fixture.
2. Build and inspect the complete Pontypool VEVENT and fixture card for timed
   behavior and retained fixture semantics.
3. Record completed validation and review evidence in this plan.

Expected files:

- `src/content/fixtures/pontypool-utd-away-2026-09-20.md`
- `docs/plan/issues/105_time_pontypool_kickoff.md`

No schema, formatter, calendar generator, component, dependency, workflow,
other fixture, or deployment file is expected to change.

## Validation

- Install the locked dependencies with `npm ci`; no server or external service
  is required by the repository's static check/build entry points.
- Failure-shaped baseline: build `origin/main` and confirm the Pontypool VEVENT
  uses `DTSTART;VALUE=DATE:20260920` plus exclusive date end
  `DTEND;VALUE=DATE:20260921`, while its card omits a kick-off time.
- Run `npm run check` and `npm run build` after implementation.
- Parse the complete Pontypool VEVENT and require the timed UTC start, unchanged
  UID/title/away description, and no `VALUE=DATE`, `DTEND`, or location.
- Inspect the generated Fixtures HTML and require the Pontypool card to show
  `Sun, 20 Sept 2026, 11:00 am`, retain Match/Away presentation, and precede
  Clwb Rygbi Caerdydd in Upcoming; separately require the calendar feed to
  retain Ynysowen, Pontypool, then Clwb Rygbi Caerdydd chronology.
- Confirm analogous timed fixtures and every unrelated fixture are unchanged;
  run `npm audit --omit=dev`, `git diff --check`, and repository pre-commit
  hooks on the exact staged file set.

## Risks and decisions

- 20 September is within British Summer Time, so local 11:00 am is encoded as
  `+01:00` and emitted as 10:00 UTC.
- No finish time or duration was supplied. The issue makes `end` conditional on
  that information, and the established St Peters conversion omitted `end` in
  the same situation, so this change must not invent one. A non-all-day event
  without `end` correctly has a timed `DTSTART` and no `DTEND`.
- The issue snapshot was fetched at 2026-09-14T09:50:11Z. The live issue is open
  and has no comments; the user's invocation supplies the material confirmation
  that kick-off is 11:00 am.
- No follow-up issues or deployment were requested. The workflow stops with an
  open pull request.

## Issue traceability

| Issue item | Disposition | Timing / owner / prerequisite | Evidence and current result |
| --- | --- | --- | --- |
| Convert the named Pontypool fixture after confirmation | Implement in this PR | Pre-merge / Codex / confirmed 11:00 am supplied by user | Focused source diff; pass |
| Timed offset `start` matching kick-off | Implement and validate | Pre-merge / Codex / repository content schema | Exact source and built UTC start; pass |
| Remove `allDay: true` | Implement and validate | Pre-merge / Codex / none | Source absence plus no date-valued ICS properties; pass |
| Add `end` if duration is known | Not applicable | External information not supplied / coaches | No end invented; complete VEVENT has no `DTEND`; pass |
| Generated VEVENT is timed | Implement and validate | Pre-merge / Codex / successful static build | Complete VEVENT assertion; pass |
| Fixtures page shows kick-off | Implement and validate | Pre-merge / Codex / successful static build | Built card assertion; pass |
| Preserve opponent, away status, date, identity, and unspecified venue | Validate without a change | Pre-merge / Codex / none | Source, VEVENT, and page assertions; pass |
| PR #104 and issue #103 provenance | Validate without a change | Pre-merge / Codex / repository history | Existing fixture and completed #103 plan establish the temporary all-day state; observed |
| Shared code, other fixtures, dependencies, workflows, and deploy | Intentionally out of scope | N/A | Exact changed-file and base-diff gate; pass |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The complete live issue and user clarification are represented without
  expanding scope: the only implementation change is the confirmed start-time
  conversion, while the conditional finish time remains unavailable.
- The fixture schema already accepts offset timestamps, `formatWhen` renders
  them in `Europe/London`, and the ICS generator converts them to UTC. No
  shared-code change is needed.
- The analogous-pattern sweep covered all `start`, `end`, and `allDay` fields
  under `src/content/fixtures`, plus `src/lib/fixtures.ts`, `src/lib/ics.ts`, the
  completed #75 St Peters conversion, and the original #103 Pontypool plan.
  St Peters is the directly analogous timed conversion; other all-day matches
  remain intentionally different because their kick-offs are unconfirmed.
- Validation reproduces the original date-valued event, checks the corrected
  timed success path, rejects residual `VALUE=DATE`/`DTEND`/location output,
  and protects ordering and unrelated content. The static build needs only
  locked local dependencies and no server, generated prerequisite, or external
  service. No unresolved blocker remains.

## Implementation validation

- `npm ci` installed 261 packages from the lockfile and reported zero
  vulnerabilities. It emitted the existing environment-level allow-scripts
  advisory for `esbuild` and `fsevents`, with no install failure or tracked
  dependency change.
- The failure-shaped baseline build passed and reproduced
  `DTSTART;VALUE=DATE:20260920`, exclusive `DTEND;VALUE=DATE:20260921`, and a
  fixture card without `11:00 am`.
- The first baseline assertion command exited 1 because its harness expected a
  `.md` suffix in Astro's normalized content UID. After inspecting the built
  feed, the corrected exact-UID assertion passed. This was a harness/setup
  failure, not a behavior assertion failure.
- `npm run check` passed across 19 files with zero errors, warnings, or hints;
  `npm run build` passed and generated six pages plus `fixtures.ics`.
- A first combined output assertion exited 1 because it compared a past card
  and upcoming cards by raw HTML order. After separating feed chronology from
  the page's Upcoming order, the corrected assertion passed. This was a
  harness/setup failure, not a product failure.
- Fresh source and generated-output assertions confirm the exact offset start,
  UTC `DTSTART:20260920T100000Z`, unchanged UID/summary/away description,
  Match/Away chips, and `Sun, 20 Sept 2026, 11:00 am`. They reject `allDay`,
  `end`, location, `VALUE=DATE`, and `DTEND` for this fixture.
- Calendar chronology remains Ynysowen, Pontypool, then Clwb Rygbi Caerdydd;
  Upcoming shows Pontypool before Clwb Rygbi Caerdydd.
- `npm audit --omit=dev` and `git diff --check` passed. The base diff plus
  worktree status contains exactly the two planned paths, so Phase 3.5 passes
  with no unrelated source or dependency change.
- Repository pre-commit hooks passed on the selectively staged two-file set;
  the final staged snapshot is rechecked after this completion update.

## Branch review

**Classification:** Code-relevant fixture content because the Markdown record
changes generated site and calendar behavior; the plan is non-executable
documentation.

**Review iteration 1:** Approved with no blocking or non-blocking finding.

- The live issue was re-fetched on 2026-09-14 and remains open with no comments
  or specification changes. Its body and the user's confirmed 11:00 am input
  remain fully represented in traceability.
- The repository has no `docs/pre-pr-branch-review.md`. The named
  `differential-review` and Trail of Bits specialist skills are unavailable in
  this session, so the manual fallback inspected the complete diff, source
  schema, timezone conversion, page formatter, calendar generator, normalized
  content UID, the historical St Peters conversion, and every timed/all-day
  fixture shape.
- The original failure and corrected success are both demonstrated. Negative
  checks protect against residual all-day fields, a fabricated end/location,
  lost match identity, and changed ordering. The exact date parses to
  `2026-09-20T10:00:00.000Z` as intended.
- The changed plan contains no Bash or shell fence, so executable-fence
  validation is not applicable. No follow-up idea was identified.
