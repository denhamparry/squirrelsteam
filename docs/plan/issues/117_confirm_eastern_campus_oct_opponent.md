---
status: Complete
issue: 117
issue_url: https://github.com/denhamparry/squirrelsteam/issues/117
branch: denhamparry.co.uk/feat/gh-issue-117
deploy: no
---

# Plan: Confirm the opponent for the 25 October 2026 Eastern Campus home game

## Problem and outcome

The 25 October 2026 home match at Eastern Community Campus was listed with a TBC
opponent. The owner confirmed the opponent was **Bridgend**. Replace TBC in the
title and add `opponent: Bridgend`. Keep the existing timed home and location
fields.

No score has been confirmed yet, so this change records no `result`.

## Files modified

- `src/content/fixtures/eastern-campus-home-2026-10-25.md`
- `docs/plan/issues/117_confirm_eastern_campus_oct_opponent.md`

## Validation

- `npm run check` and `npm run build` pass.
- The Fixtures page and `fixtures.ics` show the Bridgend title.
