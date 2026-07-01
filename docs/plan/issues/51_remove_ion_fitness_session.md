# GitHub Issue #51: Remove ION fitness session (Sat 4 July 2026) — to be rescheduled

**Issue:** [#51](https://github.com/denhamparry/squirrelsteam/issues/51)
**Status:** Planning
**Date:** 2026-07-01

## Problem Statement

The ION fitness session scheduled for **Saturday 4 July 2026** is not going
ahead on that date. It will be run at a future date (TBC), so the dated event
must be removed from the site until a new date is confirmed.

### Current Behavior

- `src/content/fixtures/ion-fitness.md` is a fixtures content entry with
  `start: 2026-07-04`, which renders on the fixtures page and is exported to
  the subscribe-able `fixtures.ics` calendar feed.
- `src/pages/training.astro` line 36 hardcodes the event in the "What else is
  coming up" list: `ION fitness session — Sat 4 July 2026`.
- Parents subscribed to the calendar (or reading either page) see an event
  that is not happening.

### Expected Behavior

- No reference to a 4 July 2026 ION event anywhere on the built site or in
  the calendar feed.
- The ION session remains visible on the training page as a TBC entry
  (issue notes say this is acceptable), matching the existing Green Mile
  TBC pattern, so parents know it is still planned.

## Current State Analysis

### Relevant Code/Config

- `src/content/fixtures/ion-fitness.md` — content entry:

  ```yaml
  ---
  title: ION fitness session
  type: training
  start: 2026-07-04
  allDay: true
  ---
  ```

- `src/pages/training.astro:36` — hardcoded list item inside the
  "What else is coming up" card:

  ```html
  <li>ION fitness session — <strong>Sat 4 July 2026</strong></li>
  ```

- The card already contains TBC entries using the established pattern:

  ```html
  <li>Green Mile team-bonding session <span class="tbc">TBC</span></li>
  ```

- `src/pages/fixtures.ics.ts` + `src/lib/ics.ts` build the calendar feed from
  the fixtures content collection — deleting the content entry removes the
  event from both the fixtures page and the `.ics` feed with no code change.

### Related Context

- Issue #51 tasks allow either deleting the ION training-page line or
  converting it to a TBC entry; the Notes section prefers keeping it visible
  as TBC.
- The `.tbc` style is defined locally in `training.astro` and used by three
  existing entries in the same list.

## Solution Design

### Approach

1. Delete `src/content/fixtures/ion-fitness.md` so the dated event disappears
   from the fixtures page and the generated `fixtures.ics`.
2. Convert the training-page line to a TBC entry
   (`ION fitness session <span class="tbc">TBC</span>`), matching the
   adjacent Green Mile entry, so the session stays visible as planned-but-
   unscheduled.

Rationale: the content collection is the single source of truth for dated
events; removing the file is the complete fix for the fixtures page and
calendar. Keeping a TBC line on the training page preserves parent-facing
communication that the session will still happen, exactly as the issue's
Notes section suggests. The existing muted footnote on the card already
explains that TBC items get dates added to the calendar later.

Trade-off considered: fully removing the training-page line is simpler but
loses the signal that the session is still planned; the issue explicitly
sanctions the TBC approach.

### Implementation

- Delete `src/content/fixtures/ion-fitness.md`.
- Edit `src/pages/training.astro` line 36 from:

  ```html
  <li>ION fitness session — <strong>Sat 4 July 2026</strong></li>
  ```

  to:

  ```html
  <li>ION fitness session <span class="tbc">TBC</span></li>
  ```

### Benefits

- Removes the stale event from all three surfaces (fixtures page, training
  page, `.ics` feed) with a one-file deletion and a one-line edit.
- Keeps the session visible as upcoming, so no follow-up comms are needed.
- Re-adding later is trivial: restore the content file with the new date and
  swap the TBC badge back to a date.

## Implementation Plan

### Step 1: Delete the fixtures content entry

**File:** `src/content/fixtures/ion-fitness.md`

**Changes:**

- Delete the file (`git rm src/content/fixtures/ion-fitness.md`).

**Testing:**

```bash
npm run build
rg -i "ion" dist/fixtures/index.html dist/fixtures.ics
# expect: no matches
```

### Step 2: Convert the training-page line to TBC

**File:** `src/pages/training.astro`

**Changes:**

- Replace line 36:

  ```html
  <li>ION fitness session — <strong>Sat 4 July 2026</strong></li>
  ```

  with:

  ```html
  <li>ION fitness session <span class="tbc">TBC</span></li>
  ```

**Testing:**

```bash
npm run build
rg "4 July 2026" dist/ -r || echo "clean"
rg -o "ION fitness session[^<]*<span class=\"tbc\"" dist/training/index.html
```

### Step 3: Full verification

**Testing:**

```bash
npm run check
npm run build
rg -i "2026-07-04|4 July 2026" dist/ && echo "FAIL: stale date" || echo "PASS"
```

## Testing Strategy

### Unit Testing

No unit test framework in this repo; verification is via `npm run check`
(Astro type-check) and inspection of build output.

### Integration Testing

**Test Case 1: fixtures page and calendar feed**

1. Run `npm run build`.
2. Search `dist/fixtures/index.html` and `dist/fixtures.ics` for "ION" and
   "2026-07-04" / "20260704".
3. Expected: no matches in either file.

**Test Case 2: training page TBC entry**

1. Open `dist/training/index.html` (or `npm run dev` → `/training/`).
2. Expected: "ION fitness session" appears with a TBC badge and no date;
   the other list items are unchanged.

### Regression Testing

- `npm run check` passes (no type errors from the removed content entry).
- `npm run build` succeeds.
- Other fixtures (tour, Cardiff Arms Park, preseason training) still appear
  in `dist/fixtures.ics`.

## Success Criteria

- [ ] `src/content/fixtures/ion-fitness.md` deleted
- [ ] Training page shows `ION fitness session` with TBC badge, no date
- [ ] No "ION" / "2026-07-04" / "4 July 2026" match in `dist/` after build
- [ ] `npm run build` and `npm run check` pass
- [ ] Other fixtures unaffected in `fixtures.ics`

## Files Modified

1. `src/content/fixtures/ion-fitness.md` - Deleted (removes event from
   fixtures page and `.ics` feed)
2. `src/pages/training.astro` - ION line converted to TBC entry (no date)

## Related Issues and Tasks

### Depends On

- None

### Blocks

- None

### Related

- Epic #10 (site work tracking)
- Issue #6 (training & key dates page, where the ION line was added)

### Enables

- Re-adding the ION session with a confirmed date later (restore content
  file + swap TBC badge for the date)

## References

- [GitHub Issue #51](https://github.com/denhamparry/squirrelsteam/issues/51)
- `src/content.config.ts` — fixtures collection schema
- `src/pages/fixtures.ics.ts`, `src/lib/ics.ts` — calendar feed generation

## Notes

### Key Insights

- The fixtures content collection drives both the fixtures page and the
  `.ics` feed, so a single file deletion covers two of the three surfaces.
- The training page card already has a TBC pattern and an explanatory muted
  footnote — converting the ION line to TBC needs no new styling or copy.

### Alternative Approaches Considered

1. **Remove the ION line from training.astro entirely** — loses the signal
   that the session is still planned; issue notes prefer keeping it
   visible ❌
2. **Keep the content file but strip the date** — the schema requires
   `start`, and a dateless fixture entry has no meaning in the collection;
   the issue explicitly says not to keep it with a stale date ❌
3. **Delete content file + TBC entry on training page** — complete removal
   of the stale date, session stays visible, matches issue Notes ✅

### Best Practices

- When the new ION date is confirmed, re-create the fixtures content entry
  and update the training page in the same change so all surfaces stay in
  sync.
