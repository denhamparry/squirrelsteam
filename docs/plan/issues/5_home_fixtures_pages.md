# Plan: Build Home + Fixtures/Calendar pages (#5)

- **Status:** Reviewed (Approved)
- **Issue:** #5 (depends on #2 design system, #4 calendar feed — both merged)
- **Branch:** `denhamparry.co.uk/feat/gh-issue-005`
- **Deploy:** no

## Issue summary

Issue #5 asks for the two pages parents and players visit most — the **Home**
page and the **Fixtures / Calendar** page. It depends on the design system (#2)
and the calendar feed (#4), both of which are already merged.

## Current state (what already exists)

A survey of the worktree shows most of this issue is already delivered by the
design-system and calendar-feed work:

- **Design system** (`src/styles/global.css`, `BaseLayout`, `Header`, `Footer`,
  `Card`, `PageHeader`) — tokens, buttons, mobile nav, fonts. ✅
- **Fixtures page** (`src/pages/fixtures.astro`) already provides:
  - Upcoming list with type, home/away, opponent, when (date + kickoff),
    venue, recurrence summary and notes. ✅
  - Collapsible **Past events** section. ✅
  - `SubscribeButtons` — Apple, Google, Outlook and copy-`.ics`-URL. ✅
  - "How do I subscribe on my phone?" instructions for non-technical parents. ✅
- **Fixtures data + library** (`src/content/fixtures/*.md`, `src/lib/fixtures.ts`)
  — `getUpcomingFixtures`, `getPastFixtures`, `formatWhen`, `typeLabel`,
  `recurrenceText`. ✅

The **Fixtures / Calendar page therefore needs no functional change.** The
optional embedded month view is explicitly optional and out of scope (no Google
Calendar mirror exists yet).

### Gaps (all on the Home page)

`src/pages/index.astro` currently has a hero, four quick-link cards and a donate
CTA. It is **missing** three of its acceptance-criteria items:

1. **"Next up"** — the next 1–3 fixtures pulled from the fixtures collection.
2. **Prominent "Subscribe to fixtures"** call-to-action.
3. **Squirrel logo** in the hero (brand mark — the header uses a 🐿️ mark; the
   hero has none).

## Approach

Focus the work on the Home page, and extract the upcoming-fixture markup into a
small shared component so Home and Fixtures render fixtures identically (DRY).

### 1. New component: `src/components/FixtureItem.astro`

Render a single fixture `<li>` — the markup currently inlined in
`fixtures.astro`. Props:

- `fixture: Fixture` — the entry.
- `showNotes?: boolean` (default `true`) — render the markdown body (notes).
  Home's "Next up" passes `false` to stay compact; the Fixtures upcoming list
  passes the default; the Past list passes `false`.

The component owns the `.fixture*` and `.chip*` styles (moved out of
`fixtures.astro`). It does its own `await render(fixture)` for notes and derives
home/away + recurrence text internally. This removes the duplicated rendering
logic and guarantees the two pages stay visually consistent.

### 2. Rework `src/pages/index.astro`

- **Hero:** add a squirrel brand mark (consistent with the header's 🐿️
  treatment) so the hero carries team identity. No new binary asset required.
- **"Next up" section:** call `getUpcomingFixtures()` in the frontmatter, take
  the first three, and render them with `<FixtureItem showNotes={false} />`.
  Show an empty-state line when there are none, and a "See all fixtures →" link.
- **Subscribe CTA:** embed `<SubscribeButtons />` within the "Next up" block
  under a clear "Subscribe to fixtures" heading so parents can subscribe
  straight from the landing page (the prominent CTA the issue asks for).
- Keep the existing quick-link cards (Training · About · Fundraising) and the
  donate CTA. Drop the now-redundant "Fixtures & calendar" card since the
  section above it is the fixtures feature, replacing it with the "See all
  fixtures" link.

### 3. Update `src/pages/fixtures.astro`

- Replace the inline upcoming/past `<li>` markup with `<FixtureItem />`.
- Upcoming: `<FixtureItem fixture={f} />` (notes shown).
- Past: `<FixtureItem fixture={f} showNotes={false} />`.
- Remove the `.fixture*` / `.chip*` styles now owned by the component, and the
  now-unneeded `upcomingItems`/`render`/`homeAway` frontmatter plumbing.

## Files Modified

- `src/components/FixtureItem.astro` — **new** shared single-fixture component.
- `src/pages/index.astro` — add "Next up" + Subscribe CTA + hero mark.
- `src/pages/fixtures.astro` — consume `FixtureItem`; drop duplicated markup/styles.
- `docs/plan/issues/5_home_fixtures_pages.md` — this plan.

## Testing Strategy

### Build / type check

- `npm run check` — Astro type-check passes (no TS errors in the new component
  or the reworked pages).
- `npm run build` — site builds to `dist/` with no errors; `/`, `/fixtures/`
  and `/fixtures.ics` all emit.

### Manual / visual verification

- `npm run dev`, then:
  - Home `/` shows the genuine next 1–3 fixtures from the data files (currently
    Pre-season training, ION fitness, 26/27 season start) with correct dates.
  - Home shows working Apple/Google/Outlook/copy subscribe controls.
  - Fixtures `/fixtures/` is unchanged in appearance (upcoming list with notes;
    past collapsible) after the component swap.
  - Both pages render correctly at a 375px-wide mobile viewport.

### Integration testing (smoke)

- Confirm the `.ics` feed still builds and the subscribe URLs resolve to
  `https://squirrels.team/fixtures.ics` (unchanged from #4).

## Acceptance criteria mapping

| Criterion (issue #5)                                          | Where met                          |
| ------------------------------------------------------------- | ---------------------------------- |
| Home shows genuine next fixture(s) automatically              | Home "Next up" via `getUpcoming…`  |
| Fixtures page lists all upcoming events + working subscribe   | Existing `fixtures.astro` (#4)     |
| Both pages look right on mobile                               | Manual mobile-viewport check       |
| Hero: squirrel logo + title + intro                           | Home hero mark + existing copy     |
| Prominent Subscribe-to-fixtures CTA                           | `SubscribeButtons` on Home         |
| Quick links (Training · About · Fundraising)                  | Existing Home cards                |
| Donate / Fundraise button                                     | Existing Home CTA                  |

## Review Summary

**Overall Assessment: Approved (iteration 1/3)**

Validated technical assumptions:

- `await render(fixture)` works inside a child Astro component's frontmatter
  (component scripts are async; `fixtures.astro` already renders these entries).
- Component-scoped styles travel with the markup moved into `FixtureItem.astro`.
- `SubscribeButtons`' inline copy script is page-scoped, so reusing it on Home
  and Fixtures (separate documents) introduces no listener conflict.
- Build-time `getUpcomingFixtures()` yields genuine data for "Next up".

Required-during-implementation note: keep the `<ul class="fixtures">` grid rule
in each page's style block (the component renders the `<li>`, not the list), to
avoid touching `global.css`.

No blocking issues; proceed to implementation.

## Out of scope

- Optional embedded month view (no Google Calendar mirror exists; #5 marks it
  optional).
- Donate/SumUp wiring beyond the existing button (tracked in #8).
- Any change to the fixtures data model or `.ics` generation (owned by #4).
