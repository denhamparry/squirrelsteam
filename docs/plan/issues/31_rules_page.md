# Plan: Build Rules page (U12 15-a-side rules + U11→U12 changes) (#31)

- **Status:** Reviewed (Approved)
- **Issue:** #31 (part of epic #10; depends on #2 design system, #5 base pages —
  all merged)
- **Branch:** `denhamparry.co.uk/feat/gh-issue-031`
- **Deploy:** no

## Issue summary

Issue #31 asks for a new **Rules** page (`src/pages/rules.astro`) documenting the
**Under 12s (15-a-side) contact rugby rules** the Squirrels play under, with a
section at the bottom highlighting the **key changes from U11 to U12**.

The team plays U12, so the page **focuses on U12 rules**. The U11 ruleset is used
only as the basis for the "what changed" comparison — it is not reproduced in
full as a second ruleset.

Source content: WRU age-grade rugby rules (U11 contact, pages 20–21; U12
15-a-side contact, pages 22+) provided in the issue body.

### Acceptance criteria (from the issue)

- [ ] New page at `src/pages/rules.astro`, mobile-first, matching the site's
      black & white branding and existing page layout/components.
- [ ] Page focuses on **U12 (15-a-side) contact rugby** rules.
- [ ] "Key changes from U11 to U12" section at the bottom of the page.
- [ ] Linked from site navigation where appropriate.
- [ ] `npm run build` and `npm run check` pass.

## Current state (what already exists)

- No `src/pages/rules.astro` yet.
- Reusable building blocks already exist and are used by every content page:
  - `src/layouts/BaseLayout.astro` — page shell (`title`, `description` props).
  - `src/components/PageHeader.astro` — black hero with `eyebrow` / `title` /
    `lead`.
  - `src/components/Card.astro` — white card with optional `title`.
- Primary nav lives in `src/components/Header.astro` (`navItems` array).
- Footer nav lives in `src/components/Footer.astro` (a `<nav>` list of links).
- Design tokens (`--space-*`, `--step-*`, `--color-*`, `.flow`, `.container`,
  `.container-narrow`, `.section`) come from `src/styles/global.css`.
- Existing pages avoid raw `<table>` elements; they use `<ul>` and definition
  lists (`<dl>`) in CSS grids that collapse to a single column on narrow
  screens (see `training.astro` `.focus`). This page should follow the same
  pattern for mobile-friendliness.

## Approach

Build `rules.astro` from the existing `BaseLayout` + `PageHeader` + `Card`
components, mirroring `training.astro` so the page is visually consistent and
mobile-first by construction. Content is grouped into clearly-titled cards:

1. **PageHeader** — eyebrow "Under 12s · 15-a-side contact", title "Rules", lead
   explaining this is the U12 game the Squirrels now play.
2. **Card: "At a glance"** — the U12 format facts as a definition list
   (`<dl class="facts">`): age, team size, periods of play, playing area, ball
   size, coach qualification, referee qualification.
3. **Card: "How the game is played"** — intro line "IRB Under 19 Laws apply,
   apart from:" then a `<dl>`/`<ul>` of the U12 variations grouped by area:
   - **General** — 8 forwards, 7 backs, rolling replacements; enter/leave at the
     halfway touchline; full IRB laws on the contact area.
   - **Scrums** — crouch/touch/pause/engage; eight-man **contested** scrum, 0.5m
     max push, no wheeling; both hookers may strike; 3-4-1 formation; the no. 8
     may pick up from the base.
   - **Scrum half** — offside line is the mid line of the scrum.
   - **Lineout** — full lineout, uncontested, no catch and drive.
   - **Kicking** — non-scoring team restarts with a drop kick; kicking allowed
     anywhere on the field.
   - **Penalties** — ball propelled from the hands; penalty kick at goal only for
     offences in the 22; quick free kick/penalty = place ball, tap forward with
     foot (correct technique).
4. **Card: "What's new at U12 (changes from U11)"** — the comparison, rendered as
   a definition list where each `<dt>` is the area and each `<dd>` shows the
   before → after (e.g. "U11: up to 12 (max 5 forwards) → U12: 15 (max 8
   forwards)"). Areas: team size, periods of play, playing area, ball size,
   scrums, lineout, kicking, hand-off/fend-off, breakdown, penalties, and what
   the level introduces (contest for possession → the full game + set piece).
   Rendering as a stacked `<dl>` (not a 3-column `<table>`) keeps it readable on
   phones — most visitors are parents on mobile.

5. **Navigation** — add a "Rules" entry to the primary nav (`Header.astro`
   `navItems`, placed after "Training") and to the footer nav (`Footer.astro`,
   after "Training"). The active-state and mobile-menu behaviour are already
   handled generically by `Header.astro`, so only the array/link entry is needed.

### Styling

- Reuse the `.facts`/`.focus`-style `<dl>` grid pattern from `training.astro`
  (two-column on desktop, single column under 30rem) for the "At a glance" and
  "changes" lists. Scope any new CSS to the page via the component `<style>`
  block; prefer existing tokens over new values.
- No new global tokens or components required.

## Files to modify

- `src/pages/rules.astro` — **new** page (the bulk of the work).
- `src/components/Header.astro` — add `{ href: "/rules/", label: "Rules" }` to
  `navItems`.
- `src/components/Footer.astro` — add `<a href="/rules/">Rules</a>` to the footer
  nav.
- `docs/plan/issues/31_rules_page.md` — this plan (status updates).

## Testing strategy

- `npm run check` — Astro type-check passes (no TS/template errors).
- `npm run build` — site builds; `/rules/` is emitted to `dist/`.
- Manual: dev server, verify the page renders, nav shows "Rules" with active
  state on `/rules/`, mobile menu includes it, and the changes section is legible
  at a narrow (≤30rem) viewport.

## Out of scope

- Reproducing the full U11 ruleset as a standalone reference (the issue scopes
  the page to U12; U11 appears only in the comparison).
- Any change to the fixtures/calendar data.
- Sourcing or publishing the official WRU PDF.
