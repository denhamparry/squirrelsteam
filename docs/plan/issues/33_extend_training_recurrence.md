# Plan: Extend Tuesday training recurrence to season start (issue #33)

**Status:** Reviewed (Approved)
**Issue:** #33 — Extend Tuesday training recurrence to season start (6 Sep 2026)
**Type:** content (fix)
**Branch:** denhamparry.co.uk/fix/gh-issue-033

## Background (verified during research)

`src/content/fixtures/preseason-training.md` defines the weekly Tuesday
pre-season training event:

```yaml
start: 2026-06-02T19:00:00+01:00
end: 2026-06-02T20:00:00+01:00
location: Caedelyn Park, CF14 6EJ
rrule: FREQ=WEEKLY;BYDAY=TU;UNTIL=20260825T180000Z
```

The recurrence currently ends **Tuesday 25 August 2026** (`UNTIL=20260825T...`),
so Tuesday sessions stop ~2 weeks before the 26/27 season starts.

**Date verification (via `date -d`):**

| Date        | Weekday | Role                                           |
| ----------- | ------- | ---------------------------------------------- |
| 2026-08-25  | Tuesday | Current last occurrence                        |
| 2026-09-01  | Tuesday | Final pre-season session — must be included    |
| 2026-09-06  | Sunday  | Season start (new `UNTIL` value)               |
| 2026-09-08  | Tuesday | Next session — must be excluded                |

`UNTIL` is inclusive (RFC 5545). Setting `UNTIL=20260906T180000Z` (Sunday 6 Sep,
18:00Z) captures the 1 Sep Tuesday and, because there is no Tuesday between 1 Sep
and 6 Sep, adds no stray occurrences. The next Tuesday (8 Sep) falls after the
`UNTIL` bound and is correctly dropped.

The `18:00Z` time component is unchanged and matches the event start
(19:00:00+01:00 BST = 18:00 UTC), consistent with RFC 5545's requirement that
`UNTIL` be expressed in UTC.

Season start date (Sunday 6 September 2026) corroborated by `CLAUDE.md` key facts
and epic #10.

## Fix

1. **`src/content/fixtures/preseason-training.md`** — bump only the `UNTIL` date
   in the `rrule`:

   ```diff
   - rrule: FREQ=WEEKLY;BYDAY=TU;UNTIL=20260825T180000Z
   + rrule: FREQ=WEEKLY;BYDAY=TU;UNTIL=20260906T180000Z
   ```

   No other field changes. Time (7–8pm) and location (Caedelyn Park, CF14 6EJ)
   are untouched.

## Files Modified

- `src/content/fixtures/preseason-training.md`
- `docs/plan/issues/33_extend_training_recurrence.md` (this plan)

## Testing Strategy

- `npm run build` succeeds — the fixtures collection is built into
  `dist/fixtures.ics`.
- Inspect `dist/fixtures.ics`: the training `VEVENT` carries the updated
  `RRULE:...UNTIL=20260906T180000Z`. Confirm no Tuesday occurrence after
  1 Sep 2026 and that 8 Sep is absent.
- `npm run check` (Astro type-check) passes.

## Acceptance Criteria

- [ ] Tuesday training recurs weekly through Tuesday 1 September 2026
- [ ] Time (7–8pm) and location (Caedelyn Park, CF14 6EJ) unchanged
- [ ] `npm run build` succeeds and `/fixtures.ics` validates
- [ ] No duplicate or stray occurrences after 1 Sep 2026

## Risks / Notes

- Single-character-class change (date digits only). Lowest possible risk.
- No tests exist in the repo (static Astro site); build + ICS inspection are the
  gates.

## Review Summary

**Overall Assessment:** Approved.

- The `UNTIL` bump is the exact change the issue specifies, and the inclusivity
  reasoning is verified against actual weekday calculations (1 Sep = Tuesday is
  the last included session; 8 Sep = Tuesday is correctly excluded).
- Time and location fields are left untouched, satisfying the "unchanged"
  criterion.
- No required changes. Ready for implementation.
