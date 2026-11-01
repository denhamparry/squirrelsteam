---
status: Complete
issue: 279
issue_url: https://github.com/denhamparry/squirrelsteam/issues/279
branch: denhamparry.co.uk/fix/gh-issue-279
deploy: no
---

# Plan: Remove unused training helpers and styles

Issue snapshot: 2026-11-01, after #276 and #269 merged. The owner's [comment](https://github.com/denhamparry/squirrelsteam/issues/279#issuecomment-6561082518) adds the unused Training page `.tbc` rule to scope.

## Approach

Remove `getTrainingFixtures()` and `getPreSeasonFixtures()` from the fixture library. Both pages now filter `getUpcomingFixtures()` directly, so keep their current behavior. Remove the Training page's unused scoped style block; its `.muted` rule also has no matching element. Preserve the separately scoped Fundraising `.tbc` rule.

Expected files: `src/lib/fixtures.ts`, `src/pages/training.astro`, and this plan.

## Issue traceability and acceptance

| Item | Disposition and timing | Evidence and result |
| --- | --- | --- |
| Remove both unused exported helpers after #269 | Implement; pre-merge | #269 merged; repository-wide caller search found none; passed. |
| Alternative upcoming-training helper shared by both pages | Not applicable | Removal is the smaller proposed option; existing page filtering is retained. |
| Remove scoped Training `.tbc` rule | Implement; pre-merge | `rg -n "tbc" src/pages/training.astro` has no matches; passed. |
| Keep Fundraising `.tbc` | Validate without change; pre-merge | Scoped rule and two usages remain; passed. |
| `npm run check` and `npm run build` pass | Validate; pre-merge | Both passed locally after `npm ci`; no server or external service needed. |
| #276 before #269 and weekly training time | Validate without change; pre-merge | Both PRs merged in order; no ICS edit. |
| #269 was non-blocking | Intentionally out of scope | Already merged; no action required. |

## Validation

- Search the whole repository for callers before and after removing the helpers; the original definitions were the only remaining matches.
- Confirm no `tbc` matches in Training, and Fundraising keeps its scoped usages.
- Run `npm ci` if dependencies are absent, then `npm run check`, `npm run build`, and `git diff --check`.
- Inspect the complete diff and affected pages, then run staged pre-commit hooks. No local server or generated prerequisite is needed; build writes ignored `dist/`.

Validation result: `npm ci`, `npm run check`, `npm run build`, and `git diff --check` passed. The search for removed helpers and Training `tbc` returned no matches (expected exit 1); Fundraising kept its scoped rule and usages. Manual branch review found no behavior change or blocking issue.
