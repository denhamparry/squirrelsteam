# Plan: Build Fundraising / Sponsorship page + Donate button (#8)

- **Status:** Complete
- **Issue:** #8 (depends on #2 design system, #5 pages, #6 training, #7 about —
  all merged; relates to #3 DNS / SumUp redirect change)
- **Branch:** `denhamparry.co.uk/feat/gh-issue-008`
- **Deploy:** no

## Issue summary

Issue #8 asks for the **Fundraising / Sponsorship** page and a site-wide
**Donate** button. Because `squirrels.team` will no longer redirect to SumUp
(see #3), the SumUp fundraising page must be clearly linked from the site.
Content to surface:

- **Donate / fundraise** — a prominent button linking to the SumUp fundraising
  page, placed in the header/footer and on Home (#5).
- **Why we fundraise** — indoor training facilities, Cardiff Arms Park fixtures,
  astro matches and the tour; reduce reliance on parents and avoid asking the
  same sponsors repeatedly.
- **Fundraising activities** — player sponsorship; the annual **Race Night**
  (17 October); the **tour weekly raffle** (£5/week, 100% off your tour cost,
  weekly Cardiff Rugby home-fixture tickets); other ideas TBC (sponsored car
  washes, cycle challenge, bucket collections).
- **Sponsorship tiers** — **Platinum £1,000**, **Black £500**, **White £250**,
  each with its benefits (player sponsor, social-media advertising, SOTW headline
  sponsor, tax relief, Race Night entry, tour-kit logo, etc.).
- **Sponsorship enquiry** contact.

### Open questions — resolved from project facts (`CLAUDE.md` + `examples/`)

The issue flagged three open questions. Resolved before planning using the
authoritative project facts in `CLAUDE.md` and the source flyer
`examples/preseason2627.pdf`:

- **SumUp / Donate URL:** use **`https://shop.squirrels.team`** (SumUp). This is
  the established donate target recorded in `CLAUDE.md` and already used in
  `Header.astro`, `Footer.astro` and `index.astro`. No new URL is introduced.
- **Bank details:** **do NOT publish.** `CLAUDE.md` is explicit — the tour-flyer
  bank details are private. The page links to the SumUp shop only; no sort
  code / account number appears anywhere on the site.
- **Sponsorship enquiry contact:** use **`contact@squirrels.team`** (the
  established team contact from `about.astro` / `CLAUDE.md`), framed as the
  sponsorship enquiry address. No separate sponsorship inbox exists yet.

### Source-document caveat (stale facts in the flyer)

`examples/preseason2627.pdf` is a pre-season flyer that contains some **stale**
data (it references the *2025-26* season, a tour to *Italy*, and "2025/26 Tour
kit"). The authoritative current facts are in `CLAUDE.md` and the sibling pages:
**26/27 season**, **tour to the South of France (1–4 May 2027)**. The page will
take the *sponsorship structure and benefits* from the flyer but **generalise
season-specific wording** (e.g. "tour kit", not "2025/26 Tour kit") and keep
dates consistent with the rest of the site. Race Night is presented as
**17 October** (no stale year hard-coded).

### Acceptance criteria (from the issue)

- The SumUp fundraising page is reachable in **one click from anywhere** on the
  site.
- Sponsorship tiers and fundraising activities are **clearly presented**.

### Issue task checklist

- [ ] Build the Fundraising / Sponsorship page.
- [ ] Add the global Donate button → SumUp.
- [ ] Lay out the three sponsorship tiers.
- [ ] Add a sponsorship enquiry contact.

## Current state (what already exists)

- **`src/pages/fundraising.astro`** exists but is a **stub**: a `PageHeader`
  ("Fundraising & sponsorship"), a "Donate" `Card` with the
  `button button--donate` → `https://shop.squirrels.team`, a "Sponsorship tiers"
  `Card` listing only the three tier prices, and a muted placeholder line —
  *"Full sponsorship benefits and fundraising activities are being added —
  tracked in issue #8."*
- **The global Donate button already exists site-wide** (this satisfies the
  "one click from anywhere" criterion before this PR):
  - `Header.astro:52-54` — `button button--donate` "Donate" →
    `https://shop.squirrels.team` (in the primary nav, mobile + desktop).
  - `Footer.astro:23` — "Donate" link → same URL.
  - `index.astro:79` — Home CTA `button button--donate` "Donate / Fundraise".
- **Shared building blocks** are all present and used by sibling pages:
  `BaseLayout`, `PageHeader`, `Card`, design tokens in `global.css`, and the
  `.button` / `.button--donate` / `.button--outline` styles.
- **Established facts** reused here: donate target `https://shop.squirrels.team`;
  contact email `contact@squirrels.team` (`about.astro`); tier prices Platinum
  £1,000 / Black £500 / White £250 (`CLAUDE.md` + current stub).

### Gap

The single substantive gap is the **page content**: `fundraising.astro` is a
thin stub that lists only tier prices. It needs building out into a full
Fundraising / Sponsorship page covering *why we fundraise*, the *fundraising
activities*, the *three sponsorship tiers with their benefits*, and a
*sponsorship enquiry contact* — and the "being added — tracked in issue #8"
placeholder line removed. The global Donate button is **already done**; this PR
verifies it rather than adding it.

## Approach

Rework `src/pages/fundraising.astro` only — no new components, no data changes,
no `global.css` changes, no nav/footer changes (the Donate button is already
wired up everywhere). Reuse the existing `Card` component and design tokens, and
follow the structure/idiom already established by `training.astro`,
`about.astro` and `index.astro` (a `.section` →
`.container container-narrow flow` wrapper holding intro copy and a stack of
`Card`s, with a small page-scoped `<style>` block only where needed).

Content structure (top to bottom):

1. **Keep the `PageHeader`** — eyebrow "Support the team", title
   "Fundraising & sponsorship", lead about funding great rugby experiences.
2. **Donate** — `Card` (kept from the stub): short line + prominent
   `button button--donate` "Donate / Fundraise" →
   `https://shop.squirrels.team`. This is the page-level entry point to SumUp,
   in addition to the header/footer buttons.
3. **Why we fundraise** — intro copy: indoor training facilities (Oct–Feb),
   Cardiff Arms Park fixtures, astro matches and the tour; the aim of reducing
   reliance on parents and not asking the same sponsors repeatedly. (Plain
   paragraphs / a list, generalised — no stale 2025-26 / Italy references.)
4. **How we fundraise** — `Card` listing the activities:
   - **Player sponsorship** (see the tiers below).
   - **Annual Race Night — 17 October.**
   - **Tour weekly raffle** — £5/week, 100% comes off your tour cost; a pair of
     Cardiff Rugby home-fixture tickets raffled each week.
   - **More ideas (TBC)** — sponsored car washes, cycle challenge, bucket
     collections (mark provisional with the existing `.tbc`-style treatment or
     plain "TBC" wording, consistent with `training.astro`).
5. **Sponsorship tiers** — replace the price-only list with the three tiers and
   their benefits, clearly presented. Render as **three `Card`s** (Platinum,
   Black, White), each with its price as the heading detail and a `<ul>` of
   benefits, laid out in a responsive grid (reuse the `card-grid` pattern from
   `index.astro`, via a small page-scoped style). Benefits per the flyer
   (generalised):
   - **Platinum — £1,000:** season player sponsor (designated sponsor of your
     child + thank-you video link); advertising on our social-media channels;
     one SOTW (Star of the Week) headline sponsor for a designated game; tax
     relief for your company (sponsorship/advertising); supporting grass-roots
     community sport; **5×** free entry to the annual Race Night (with sponsored
     horses); race sponsor with a VIP table; headline/large company logo on the
     tour kit; signed & framed tour kit.
   - **Black — £500:** season player sponsor (+ video link); social-media
     advertising; one SOTW headline sponsor; tax relief; supporting grass-roots
     sport; free entry to the Race Night; race sponsor with VIP table;
     small/secondary company logo on the tour kit.
   - **White — £250:** season player sponsor (+ video link); social-media
     advertising; one SOTW headline sponsor; tax relief; supporting grass-roots
     sport; free entry to the Race Night.
6. **Sponsor the Squirrels / enquiries** — `Card`: how to enquire about
   sponsorship — email
   [`contact@squirrels.team`](mailto:contact@squirrels.team) (with a helpful
   `mailto` subject such as "Sponsorship enquiry" if convenient).

Remove the placeholder line ("Full sponsorship benefits and fundraising
activities are being added — tracked in issue #8") and keep/trim the `.muted`
scoped style only if still used (it is used elsewhere on the page as TBC/footnote
text — keep if so).

### Why no shared component

Only one page renders this content and it is static markup, so inlining in
`fundraising.astro` matches the project's current altitude (cf. `training.astro`,
`about.astro`). A tier "card" is just the existing `Card` with a price heading
and a benefits list — extracting a dedicated component for three call-sites on
one page would be premature abstraction.

### Accessibility / semantics

- Keep `Card` titles as `<h3>` (component default); use semantic `<ul>` lists
  for benefits and activities.
- The tier grid must reflow to a single column on mobile (mobile-first); reuse
  the `auto-fit, minmax(...)` grid idiom from `index.astro:148-152`.
- The donate `mailto` and SumUp links keep the established link styling; no new
  colours.

## Files Modified

- `src/pages/fundraising.astro` — build out the full page (Donate, Why we
  fundraise, How we fundraise, Sponsorship tiers ×3, Sponsorship enquiries);
  remove the placeholder line; keep using `BaseLayout` / `PageHeader` / `Card`;
  add a minimal page-scoped `<style>` for the tier grid only.
- `examples/preseason2627.pdf` — source flyer for the sponsorship content
  (added as a tracked reference asset alongside the other `examples/` files).
- `docs/plan/issues/8_fundraising_sponsorship_page.md` — this plan.

**No changes** to components, `Header.astro`, `Footer.astro`, `index.astro`,
`src/content/*`, `src/lib/*`, or `global.css` — the Donate button is already
present in the nav, footer and Home, and the shared styles already exist.

## Testing Strategy

### Build / type check

- `npm run check` — Astro type-check passes (no TS errors).
- `npm run build` — site builds to `dist/` with no errors; `/fundraising/`
  emits.

### Manual / visual verification

- `npm run dev`, then load `/fundraising/`:
  - Donate, Why we fundraise, How we fundraise, the three sponsorship tiers, and
    the enquiry contact are all present and clearly grouped.
  - The Donate button links to `https://shop.squirrels.team`.
  - The three tiers (Platinum £1,000, Black £500, White £250) each show their
    price and benefits, and the grid reflows to one column at a 375px-wide
    mobile viewport (mobile-first).
  - The sponsorship enquiry email is a working `mailto:` to
    `contact@squirrels.team`.
  - **No bank details** (sort code / account number) appear anywhere.
  - The placeholder "tracked in issue #8" line is gone.

### Integration testing (smoke)

- Donate is reachable **in one click from anywhere**: header nav "Donate" and
  footer "Donate" both resolve to `https://shop.squirrels.team` (verify on
  `/fundraising/` and at least one other page).
- `/fundraising/` link in the header nav shows `aria-current="page"`.

## Acceptance criteria mapping

| Criterion (issue #8)                                   | Where met                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------- |
| Build the Fundraising / Sponsorship page               | Reworked `fundraising.astro` (Donate + Why + How + Tiers + Enquiry) |
| Add the global Donate button → SumUp                   | Already present in `Header.astro`, `Footer.astro`, `index.astro`; page Donate card too |
| Lay out the three sponsorship tiers                    | Three `Card`s (Platinum/Black/White) with benefits in a responsive grid |
| Add a sponsorship enquiry contact                      | "Enquiries" card — `mailto:contact@squirrels.team`                   |
| SumUp reachable in one click from anywhere             | Header + footer Donate buttons (site-wide) + page Donate card        |
| Tiers & activities clearly presented                   | "How we fundraise" card + three tier cards                          |

## Review Summary

**Overall Assessment: Approved (iteration 1/3)**

Validated assumptions (re-checked against the codebase):

- **The global Donate button already exists site-wide** — confirmed in
  `Header.astro:53`, `Footer.astro:23` and `index.astro:79`, all pointing at
  `https://shop.squirrels.team`. The "one click from anywhere" acceptance
  criterion is met before this PR; the work is content build-out of
  `fundraising.astro`, not new plumbing.
- `fundraising.astro` is a stub already wired into the header nav
  (`Header.astro:11`) and footer (`Footer.astro:22`) at `/fundraising/`.
- Shared building blocks (`BaseLayout`, `PageHeader`, `Card`, design tokens,
  `.button*` styles) exist and are reused by sibling pages; no `global.css`
  change needed.
- `contact@squirrels.team` is the established contact (defined as a per-page
  const in `about.astro:6`) — reuse via a local const, matching the pattern.
- Source content (tiers + benefits) extracted from `examples/preseason2627.pdf`;
  stale season wording (2025-26 / Italy / "2025/26 Tour kit") will be
  generalised per the Source-document caveat.
- Open questions resolved from `CLAUDE.md`: donate URL `shop.squirrels.team`;
  **bank details not published** (private); sponsorship enquiries via
  `contact@squirrels.team`.

Required-during-implementation notes:

- **Astro scopes `<style>` per component.** `card-grid`, `.muted` and `.tbc`
  are page-scoped in `index.astro` / `training.astro` — they are **not** global
  utilities and cannot be referenced from `fundraising.astro`. Replicate the
  responsive-grid idiom (`auto-fit, minmax(...)`) in a small page-scoped
  `<style>` for the tier cards, and define `.muted` locally if used.
- Keep `Card` titles as `<h3>` (component default) and benefit/activity lists
  semantic (`<ul>`).
- Do not edit `Header.astro` / `Footer.astro` / `index.astro` / `global.css`.

No blocking issues; proceed to implementation.

## Out of scope / decisions

- **No bank details published** — private per `CLAUDE.md`; the site links to
  SumUp only.
- **Donate target is `https://shop.squirrels.team`** (SumUp) — the existing,
  site-wide donate URL; no new URL introduced. Final SumUp-specific URL can be
  swapped later in one place if it ever differs.
- **Generalise stale flyer wording** — the source flyer references the 2025-26
  season / Italy tour / "2025/26 Tour kit"; the page uses season-agnostic
  wording ("tour kit") and keeps dates consistent with the rest of the site
  (26/27 season, South of France tour).
- **No new components, no nav/footer/Home changes, no design-system changes** —
  content build-out of one page only.
