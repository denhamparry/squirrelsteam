# Plan: Update training page — single pre-season focus section (issue #47)

**Issue:** #47 - Update training page: new start date and combine pre-season
focus
**Status:** Reviewed (Approved)

## Problem

Issue #47 asked for two changes to the training page
(`src/pages/training.astro`):

1. Change the pre-season start date to **Tuesday 4 August 2026**.
2. Combine the "Pre-season focus" card into a **single section with no month
   sub-headings**.

After pulling latest `main` (origin/main `8d1293c`), change **1 is already
done** — the page reads "Pre-season starts **Tuesday 4 August 2026**", and the
recurring training calendar fixture
(`src/content/fixtures/preseason-training.md`) already starts
`2026-08-04T19:00:00+01:00`. No further work is needed for the date or the
`.ics` feed.

The remaining work is change **2**. The "Pre-season focus" card still renders a
month-keyed definition list:

```html
<dl class="focus">
  <div>
    <dt>August</dt>
    <dd>Strength &amp; conditioning, skills &amp; structure, understanding the new rules</dd>
  </div>
  <div>
    <dt>September</dt>
    <dd>Season starts</dd>
  </div>
</dl>
```

The "September → Season starts" milestone is already covered by the separate
"Key dates: season & tour" card (`26/27 season starts — Sunday 6 September
2026`), so it is redundant here.

## Acceptance Criteria

- [ ] "Pre-season focus" card is a single section with **no month
      sub-headings**.
- [ ] The focus areas are retained: strength & conditioning, skills &
      structure, understanding the new rules.
- [ ] Redundant "September → Season starts" milestone is dropped from the focus
      card (still present in the "Key dates" card).
- [ ] Pre-season start date remains "Tuesday 4 August 2026" (already correct —
      do not regress).
- [ ] Dead `.focus` CSS (and its mobile media query) is removed since the
      definition list is gone.
- [ ] `npm run check` and `npm run build` pass.

## Implementation Steps

1. In `src/pages/training.astro`, replace the `<dl class="focus">…</dl>` inside
   the "Pre-season focus" card with a single, monthless list of the focus
   areas:

   ```html
   <Card title="Pre-season focus">
     <ul>
       <li>Strength &amp; conditioning</li>
       <li>Skills &amp; structure</li>
       <li>Understanding the new rules</li>
     </ul>
   </Card>
   ```

2. Remove the now-unused `.focus`, `.focus div`, `.focus dt`, `.focus dd` style
   rules and the `@media (max-width: 30rem)` block that only targets
   `.focus div`.

3. Leave the "Training" card (start date) and "Key dates" card unchanged.

## Files Expected To Change

- `docs/plan/issues/47_update_training_page_focus.md`
- `src/pages/training.astro`

## Validation

- `npm run check` - passes with 0 errors.
- `npm run build` - passes.
- `rg "Tuesday 4 August 2026" dist/training/index.html` - match (date retained).
- Built `/training/` page shows the focus areas with no "August"/"September"
  headings.

## Risks And Open Questions

- Dropping "Season starts" from the focus card is intentional — it duplicates
  the "Key dates" card. Confirmed acceptable per issue intent ("combine into a
  single section, no months").
- "Rugby Sevens" from the original issue text was already removed on `main`
  before this change; not reintroducing it.
