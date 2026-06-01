# Plan: Build Training & Key Dates page (#6)

- **Status:** Complete
- **Issue:** #6 (depends on #2 design system, #4 calendar feed, #5 pages — all merged)
- **Branch:** `denhamparry.co.uk/feat/gh-issue-006`
- **Deploy:** no

## Issue summary

Issue #6 asks for the **Training & Key Dates** page: where/when training happens
and the important dates for the 26/27 season, drawn from the pre-season 26/27
document (`examples/preseason2627.pdf`). Content to surface:

- **Training** — Caedelyn Park (CF14 6EJ); pre-season starts **Tue 2 June 2026,
  7–8pm**.
- **Pre-season focus** — June: strength & conditioning, Rugby Sevens;
  July/August: skills & structure, the new rules; September: season starts.
- **Extras** — ION fitness session (Sat 4 July 2026); Green Mile team-bonding
  (TBC); surprise guest coaches (TBC); 2× pre-season games arranged (TBC); new
  kit presentation; VEO analysis session.
- **Season & tour** — 26/27 season starts Sun 6 Sept 2026; Tour: South of
  France, Sat 1–4 May 2027.

### Acceptance criteria (from the issue)

- A parent can see at a glance where/when training is and the key season dates.
- Provisional (TBC) items are clearly flagged.

### Issue task checklist

- [ ] Build the Training page with the above, grouped clearly.
- [ ] Mark TBC items so they're obviously provisional.
- [ ] Cross-link "add these to your calendar" → Fixtures subscribe (#4).
- [ ] Make sure these dates are also seeded into the fixtures data so they
      appear in the feed.

## Current state (what already exists)

- **`src/pages/training.astro`** exists but is a **stub**: a `PageHeader`
  ("Training & key dates"), a "Training" `Card` (venue + "Tuesdays, 7–8pm"), a
  "Key dates" `Card` (season start + tour), and a muted placeholder line — _"Full
  pre-season schedule, focus areas and extras are being added — tracked in issue
  #6."_ The page is already wired into the nav (`Header.astro` → `/training/`).
- **Fixtures data** (`src/content/fixtures/*.md`) already seeds every **dated**
  item the issue references:
  - `preseason-training.md` — Tuesdays 7–8pm at Caedelyn Park, weekly until 25
    Aug 2026 (`start: 2026-06-02T19:00:00+01:00`, i.e. Tue 2 June 2026). ✅
  - `ion-fitness.md` — Sat 4 July 2026 (all-day). ✅
  - `season-2627-start.md` — Sun 6 Sept 2026 (all-day). ✅
  - `tour-south-of-france.md` — 1–4 May 2027 (all-day). ✅
- **Shared building blocks** are all present and used by the existing pages:
  `BaseLayout`, `PageHeader`, `Card`, design tokens in `global.css`, the
  `.button`/`.button--outline` styles, and the `/fixtures/` subscribe page.

So the **fixtures-data seeding task is already satisfied for all dated items**.
The TBC extras (Green Mile, the two pre-season games, guest coaches) have **no
confirmed dates**, and the fixtures schema requires a `start` date
(`start: z.coerce.date()`). They therefore cannot enter the `.ics` feed yet and
will live on the page only, flagged TBC, until dates are confirmed. New kit
presentation and the VEO analysis session are activities woven into training
rather than standalone dated events, so they also stay page-only. This is a
deliberate decision recorded under **Out of scope / decisions**.

### Gap

The single gap is the **page content**: `training.astro` is a placeholder. It
needs to be built out into the full, clearly-grouped Training & Key Dates page
with TBC flagging and a calendar cross-link.

## Approach

Rework `src/pages/training.astro` only — no new components, no data changes, no
`global.css` changes. Reuse the existing `Card` component and design tokens, and
follow the structure/idiom already established by `fixtures.astro` and
`index.astro` (a `.section` → `.container container-narrow flow` wrapper holding
a stack of `Card`s, with a small page-scoped `<style>` block).

Content structure (top to bottom), each block a `Card`:

1. **Training** — venue (Caedelyn Park, CF14 6EJ) and when (Tuesdays 7–8pm).
   State explicitly that **pre-season starts Tuesday 2 June 2026** so the start
   date is unambiguous (the stub only says "Tuesdays").
2. **Pre-season focus** — June / July–August / September grouped as a short
   description list (or labelled list items) so the monthly focus reads at a
   glance.
3. **What else is coming up (extras)** — ION fitness (Sat 4 July 2026, dated);
   Green Mile team-bonding (TBC); surprise guest coaches (TBC); 2× pre-season
   games (TBC); new kit presentation; VEO analysis session. Each provisional
   item carries a visible **TBC badge** (see below).
4. **Key dates: season & tour** — 26/27 season starts Sun 6 Sept 2026; Tour —
   South of France, 1–4 May 2027 🇫🇷. Followed by the **calendar cross-link**:
   an "Add these to your calendar" call-to-action linking to `/fixtures/` (the
   subscribe page from #4), using the existing `.button`/`.button--outline`
   style.

Remove the "being added — tracked in issue #6" placeholder line.

### TBC flagging

Add a small, accessible inline badge for provisional items: a `<span
class="tbc">` rendering the text "TBC" (an explicit, screen-reader-friendly
label — not a colour-only cue), styled with the existing tokens (e.g.
`--color-accent` border/text or a muted pill) in the page's scoped `<style>`.
Applying a real text label plus distinct styling satisfies the "obviously
provisional" criterion without relying on colour alone (WCAG 1.4.1).

### Why no shared component

Only one page renders this content and it is static markup, so inlining in
`training.astro` matches the project's current altitude (cf. `about.astro`,
`fundraising.astro`). Extracting a component would be premature abstraction.

## Files Modified

- `src/pages/training.astro` — build out the full page (Training, Pre-season
  focus, Extras with TBC badges, Key dates, calendar cross-link); remove the
  placeholder line; add the scoped `.tbc` style.
- `docs/plan/issues/6_training_key_dates_page.md` — this plan.

**No changes** to `src/content/fixtures/*`, `content.config.ts`, `lib/`, or
`global.css` — the dated events are already seeded and shared styles already
exist. (If review finds a dated event missing from the feed, that file would be
added — but the survey above shows all four dated items are present.)

## Testing Strategy

### Build / type check

- `npm run check` — Astro type-check passes (no TS errors).
- `npm run build` — site builds to `dist/` with no errors; `/training/` emits,
  and `/fixtures/` + `/fixtures.ics` continue to emit unchanged.

### Manual / visual verification

- `npm run dev`, then load `/training/`:
  - Training, Pre-season focus, Extras, and Key dates are present and clearly
    grouped.
  - TBC items (Green Mile, pre-season games, guest coaches) show a visible "TBC"
    badge; dated items (ION fitness Sat 4 July, season start, tour) show their
    dates.
  - The "Add these to your calendar" button links to `/fixtures/`.
  - The placeholder "tracked in issue #6" line is gone.
  - Renders correctly at a 375px-wide mobile viewport (mobile-first).
- Confirm the dates shown on the page match the seeded fixtures data (Tue 2 June
  2026 7–8pm; Sat 4 July 2026; Sun 6 Sept 2026; 1–4 May 2027).

### Integration testing (smoke)

- `/training/` link in the header nav resolves and shows `aria-current="page"`.
- The calendar cross-link resolves to the working `/fixtures/` subscribe page.

## Acceptance criteria mapping

| Criterion (issue #6)                                       | Where met                                        |
| ---------------------------------------------------------- | ------------------------------------------------ |
| Build the Training page with all content, grouped clearly  | Reworked `training.astro` (4 grouped Cards)      |
| Mark TBC items so they're obviously provisional            | `.tbc` text badge on each provisional item       |
| Cross-link "add these to your calendar" → Fixtures (#4)    | "Add these to your calendar" button → `/fixtures/` |
| Dates seeded into fixtures data so they appear in the feed | Already present in `src/content/fixtures/*` ✅   |
| Parent sees at a glance where/when training + key dates    | Training + Key dates cards near the top          |
| Provisional (TBC) items clearly flagged                    | `.tbc` badge (text + styling, not colour-only)   |

## Review Summary

**Overall Assessment: Approved (iteration 1/3)**

Validated assumptions:

- `training.astro` is a stub and is already wired into the header nav — the work
  is genuinely content build-out, not new plumbing or routing.
- All four **dated** items the issue references are already seeded in
  `src/content/fixtures/*.md`, so the "appear in the feed" task is satisfied
  without data changes. Confirmed by reading each file.
- Content dates are internally consistent and correct: 2 June 2026 = Tuesday,
  4 July 2026 = Saturday, 6 Sept 2026 = Sunday, 1 May 2027 = Saturday (verified).
  These match the issue copy and the seeded fixtures `start` values.
- The fixtures schema requires `start: z.coerce.date()`, so undated TBC extras
  genuinely cannot enter the `.ics` feed — the page-only decision is correct, not
  a shortcut.
- `Card`, `PageHeader`, `BaseLayout`, and the `.button`/`.button--outline` styles
  already exist and are reused by sibling pages; no `global.css` change needed.

Required-during-implementation notes:

- Use a real text label ("TBC"), not colour alone, for provisional flags
  (WCAG 1.4.1).
- Keep the scoped `<style>` block minimal and token-based (match
  `fixtures.astro` / `index.astro` idiom); do not edit `global.css`.

No blocking issues; proceed to implementation.

## Out of scope / decisions

- **TBC extras stay page-only.** Green Mile, the two pre-season games, surprise
  guest coaches have no confirmed dates; the fixtures schema requires a `start`
  date, so they cannot enter the `.ics` feed yet. They appear on the page flagged
  TBC and can be added to the data once dates are confirmed (a future change).
- **New kit presentation / VEO analysis** are training activities, not
  standalone dated calendar events — page-only by design.
- No changes to the fixtures data model, `.ics` generation (#4), or the design
  system (#2).
- The `examples/preseason2627.pdf` source is the content origin; its facts are
  transcribed into the issue and reflected here. No PDF parsing at build time.
