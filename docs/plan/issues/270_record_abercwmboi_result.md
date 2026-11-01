---
status: Complete
issue: 270
issue_url: https://github.com/denhamparry/squirrelsteam/issues/270
branch: denhamparry.co.uk/fix/gh-issue-270
deploy: no
---

# Plan: Record the Abercwmboi cup result

## Problem and outcome

The 11 October 2026 away cup game at Abercwmboi (U12s Cup / Plate Pool 3, Round
2) had no result. The owner confirmed the score as Abercwmboi 28–7 Rhiwbina.
Record it as `result: { us: 7, them: 28 }` so the Results tab and the fixture
card show it.

The owner gave no try or conversion breakdown, so the optional `tries` and
`conversions` fields are left out.

## Files modified

- `src/content/fixtures/abercwmboi-away-cup-2026-10-11.md`
- `docs/plan/issues/270_record_abercwmboi_result.md`

## Validation

- `npm run check` and `npm run build` pass.
- The built Fixtures page shows the 7–28 result for Abercwmboi.
