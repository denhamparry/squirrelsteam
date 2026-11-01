---
status: Complete
issue: 273
issue_url: https://github.com/denhamparry/squirrelsteam/issues/273
branch: denhamparry.co.uk/fix/gh-issue-273
deploy: no
---

# Plan: Record the Llandaff and St Peters results

## Problem and outcome

Two played matches had no result recorded. The owner confirmed both, including
which way round each score went:

- 18 October 2026, Llandaff (away): won 47–26, recorded as
  `result: { us: 47, them: 26 }`
- 1 November 2026, St Peters (home): won 27–7, recorded as
  `result: { us: 27, them: 7 }`

No try or conversion breakdown was given, so the optional fields are left out.

## Files modified

- `src/content/fixtures/llandaff-away-2026-10-18.md`
- `src/content/fixtures/st-peters-home-2026-11-01.md`
- `docs/plan/issues/273_record_llandaff_st_peters_results.md`

## Validation

- `npm run check` and `npm run build` pass.
- The Fixtures page shows "Llandaff 26 – 47 Rhiwbina Squirrels" and "Rhiwbina
  Squirrels 27 – 7 St Peters".
