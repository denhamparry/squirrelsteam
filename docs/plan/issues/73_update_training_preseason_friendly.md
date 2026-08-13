---
status: Complete
issue: 73
issue_url: https://github.com/denhamparry/squirrelsteam/issues/73
branch: denhamparry.co.uk/fix/gh-issue-073
deploy: no
---

# Plan: Reflect the confirmed pre-season friendly on Training

## Problem

The Training page still groups both planned pre-season games under one `TBC`
label even though the 28 August 2026 St Peters away friendly is now confirmed
and available from the Fixtures page and calendar. The copy hides useful date
and opponent information and contradicts the page's explanation that confirmed
items are added to the calendar.

## Acceptance criteria

- [x] `/training/` no longer describes the 28 August 2026 St Peters away
      friendly as unscheduled.
- [x] The remaining unscheduled pre-season game is still listed with the
      existing `tbc` treatment.
- [x] `npm run check`, `npm run build`, and repository pre-commit hooks pass.

## Implementation steps

1. Replace the combined two-game TBC list item with a dated St Peters away
   friendly entry that links to `/fixtures/` and a separate one-game TBC entry.
2. Preserve the existing `tbc` span and explanatory note for provisional items.
3. Build the site and assert the generated Training page contains the dated
   linked fixture, exactly one remaining pre-season-game TBC entry, and no
   stale two-game wording.
4. Run type-check, build, diff, and exact-file pre-commit validation.

## Files expected to change

- `src/pages/training.astro`
- `docs/plan/issues/73_update_training_preseason_friendly.md`

No fixture content, schema, component, shared style, dependency, workflow, or
calendar-generation file is expected to change.

## Validation

- Failure-shaped baseline: confirm `origin/main` contains the stale
  `2× pre-season games arranged` TBC item while the fixture source already
  contains the 28 August 2026 St Peters away friendly.
- Run `npm run check`.
- Run `npm run build`.
- Inspect `dist/training/index.html` and assert it contains a `/fixtures/` link
  identifying St Peters away and 28 August 2026, retains a separate
  `1× pre-season game arranged` item with the `tbc` class, and omits the stale
  `2×` wording.
- Confirm the fixture source is byte-for-byte unchanged from `origin/main`.
- Run `git diff --check`.
- Run repository pre-commit hooks against the exact staged file set.

## Risks and open questions

- The copy must not imply that the kick-off time is confirmed; only the date,
  opponent, and away status are established.
- The explanatory note must continue to apply only to items still marked TBC.
- A direct `/fixtures/` link keeps full fixture details and calendar actions in
  their existing owner rather than duplicating them on Training.
- No deployment is requested. The workflow stops with an open PR.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Training currently describes both pre-season games as TBC | Implement in this PR | Split the combined list item in `training.astro` |
| 28 August 2026 St Peters away friendly is confirmed | Implement and validate in this PR | Dated linked Training-page entry plus existing fixture source |
| Link the confirmed friendly to `/fixtures/` | Implement the suggested fix | Generated Training HTML contains the route on the confirmed entry |
| Remaining second pre-season game is genuinely TBC | Implement in this PR | Separate `1×` item retaining `<span class="tbc">TBC</span>` |
| Existing TBC explanation remains accurate | Validate without another change | Generated copy and class placement inspection |
| Copy-only scope; no schema, component, or fixture change | Intentionally out of scope | Two-file diff and fixture-source comparison |
| `npm run check`, `npm run build`, and pre-commit hooks | Validate in this PR | Recorded command results |
| PR #72 and issue #71 provenance | Validate without a change | Existing fixture and completed #71 plan establish the source fact |
| Deployment | Intentionally out of scope | `deploy: no` and open-PR handoff |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue was fetched on 2026-08-13 and every context statement,
  affected path, recommendation, acceptance criterion, reference, and explicit
  scope boundary is represented in Issue traceability.
- The failure-shaped baseline passed: a clean `origin/main` build renders
  `2× pre-season games arranged` as TBC while the existing fixture source
  independently establishes St Peters away on 28 August 2026.
- The analogous-copy sweep searched `src/` and `docs/` for both singular and
  plural pre-season-game wording, St Peters, and the date. The only live stale
  occurrence is `training.astro`; the original wording in the completed #6
  plan is historical evidence and must not be rewritten.
- Existing Training-page patterns support the implementation without a new
  component or style: the card already owns the list, `tbc` treatment, muted
  explanation, and a `/fixtures/` route. The dated entry will state only the
  confirmed date, opponent, and away status, avoiding an invented kick-off
  time.
- Validation covers the original stale state, corrected dated/link behavior,
  the remaining TBC/no-op path, removal of the plural stale wording, unchanged
  fixture content, type-check, build, and exact-file hooks.

## Implementation validation

- Phase 3.5 found exactly the two planned paths: this plan and
  `src/pages/training.astro`. No unrelated committed or working-tree path is
  present.
- `npm run check` passed with 19 files and zero errors, warnings, or hints.
- `npm run build` passed and generated all six pages plus `fixtures.ics`.
- Generated Training-page assertions found the St Peters away item, its Friday
  28 August 2026 date, and its `/fixtures/` details-and-calendar link.
- The same assertions found a separate `1× pre-season game arranged` item with
  the scoped `tbc` class and confirmed the stale `2×` wording is absent.
- The existing St Peters fixture source is byte-for-byte unchanged from
  `origin/main`.
- `git diff --check` passed.
- Repository pre-commit hooks passed against the exact two-file staged set,
  including Markdown lint and gitleaks.

## Branch review

**Classification:** Code-relevant Astro page source because the copy change
alters generated site behavior; the plan is non-executable documentation.

**Review iteration 1:** Approved with no blocking or non-blocking finding.

- The live issue was re-fetched on 2026-08-13 and remains open and unchanged.
  Its complete context, affected path, reproduction, recommendation,
  acceptance criteria, references, and copy-only boundary remain covered by
  Issue traceability.
- Phase 3.5 found exactly the two planned paths. Fixture content, schemas,
  components, styles, dependencies, workflows, and calendar generation are
  unchanged.
- `differential-review` and relevant Trail of Bits specialist skills are
  unavailable in this Codex session. The concrete manual fallback inspected
  the complete diff, full Training page, generated Training HTML, existing
  fixture source, route-link patterns, TBC markup and explanation, and all
  repository occurrences of the affected pre-season wording.
- The confirmed entry states only established facts: St Peters, away,
  pre-season friendly, and Friday 28 August 2026. It does not invent a kick-off
  time, and the descriptive same-site link keeps details and calendar actions
  on their existing `/fixtures/` owner.
- The final analogous-copy sweep confirms the stale plural wording is absent
  from live site source. The only historical occurrence is the completed #6
  plan and is intentionally different; no adjacent live copy needs a current
  fix or follow-up.
- Failure, success, and no-op evidence pass: the baseline build contained the
  stale combined TBC item; the corrected build separates the dated linked
  fixture from the remaining styled TBC item; fixture data remains unchanged.
- The changed Markdown plan contains no Bash or shell fence, so executable
  fence validation is not applicable.

## Post-PR verification

**Implementation head reviewed:**
`be89060abc98506237d620e0930ecc0322873af4`

**Outcome:** Passed independently with no new blocking or non-blocking finding.

The local commit, fetched remote branch, and GitHub PR head matched before the
review. The plan-only evidence commit created after this review is inspected
separately, and the final reviewed PR SHA is stored in the mutable PR body to
avoid a tracked-file SHA loop.

| Criterion or issue statement | Independent evidence | Result |
| --- | --- | --- |
| Training no longer presents the confirmed friendly as unscheduled | Fresh rendered-item extraction found exactly one St Peters entry with the confirmed date and no `tbc` class | Pass |
| Confirmed details are accurate and useful | The rendered entry states St Peters away, pre-season friendly, and Friday 28 August 2026 without inventing a kick-off time | Pass |
| Confirmed entry links to fixture details and calendar actions | Fresh HTML assertion found the descriptive `/fixtures/` link, and the linked built page contains the same fixture and date | Pass |
| The second pre-season game remains unscheduled | Fresh rendered-item extraction found exactly one `1× pre-season game arranged` entry | Pass |
| Existing TBC treatment remains on the unscheduled game | The remaining entry retains a scoped class containing `tbc` and visible `TBC` text | Pass |
| Stale combined wording is removed | Neither the built Training page nor live site source contains `2× pre-season games arranged` | Pass |
| Copy-only ownership is preserved | GitHub PR diff contains only this plan and `training.astro`; fixture content, components, styles, schemas, dependencies, workflows, and calendar code are unchanged | Pass |
| Type-check, build, and repository hooks pass | Fresh `npm ci`, check, build, diff checks, rendered assertions, and exact-range pre-commit hooks passed | Pass |
| Required GitHub checks pass | `Assign PR to denhamparry` and `CI Placeholder` both completed successfully | Pass |
| Closing linkage is configured | GitHub resolves `Closes #73` from the stored PR body to issue #73 | Pass |
| Deployment remains out of scope | Plan has `deploy: no`; PR changes no deployment file | Pass |
