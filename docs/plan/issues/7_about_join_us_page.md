# Plan: Build About / Join us page (#7)

- **Status:** Complete
- **Issue:** #7 (depends on #2 design system, #5 pages, #6 training page — all
  merged; relates to #11 mailbox setup)
- **Branch:** `denhamparry.co.uk/feat/gh-issue-007`
- **Deploy:** no

## Issue summary

Issue #7 asks for the **About / Join us** page: introduce the team, welcome new
players and parents, and make it easy to get in touch. Content to surface:

- **Who we are** — Rhiwbina Squirrels, the Under 12s (#1415) age group of
  Rhiwbina R.F.C.
- **Friendly intro** to the squad and coaching setup; grass-roots, community
  rugby ethos.
- **Join us** — new players welcome; what to expect; come along to training at
  Caedelyn Park (link to Training page, #6).
- **Contact** — how to reach the coaches / team manager.
- **Links** — parent club (Rhiwbina R.F.C.) and the team's social media.

### Open questions — resolved with the maintainer

The issue flagged three open questions. Answered before planning:

- **Contact method:** publish **email `contact@squirrels.team`** only (mailbox
  delivery tracked in #11). No phone/WhatsApp for now.
- **Social media:** link **Instagram** —
  `https://www.instagram.com/rhiwbinarfc1415/`. No other socials yet.
- **Coach/manager names:** **not yet** — describe the coaching setup generically
  ("our volunteer coaching team"); named coaches can be added later.

### Acceptance criteria (from the issue)

- A new family understands who the team is and exactly how to join / get in
  touch.

### Issue task checklist

- [ ] Build the About / Join us page.
- [ ] Add contact details (email `contact@squirrels.team`).
- [ ] Link parent club + socials (Rhiwbina R.F.C. + Instagram).

## Current state (what already exists)

- **`src/pages/about.astro`** exists but is a **stub**: a `PageHeader`
  ("About & join us"), an intro paragraph linking Rhiwbina R.F.C., a
  "New players welcome" `Card` linking `/training/`, a "Get in touch" `Card`
  with the contact email, and a muted placeholder line — _"Coaching team,
  socials and more are being added — tracked in issue #7 (mailbox setup in
  #11)."_ The page is already wired into the nav (`Header.astro` → `/about/`)
  and the footer.
- **Shared building blocks** are all present and used by sibling pages:
  `BaseLayout`, `PageHeader`, `Card`, design tokens in `global.css`, and the
  `.button` / `.button--outline` styles.
- **Established facts** reused here: contact email `contact@squirrels.team`;
  parent club link `https://www.rhiwbinarfc.co.uk/` (already used in
  `about.astro` and `Footer.astro`); training venue Caedelyn Park (CF14 6EJ),
  Tuesdays 7–8pm (on `/training/`).

### Gap

The single gap is the **page content**: `about.astro` is a thin stub. It needs
building out into a full About / Join us page covering who we are, the ethos,
what to expect when joining, the contact email, and the parent-club +
Instagram links — and the "being added — tracked in issue #7" placeholder line
removed.

## Approach

Rework `src/pages/about.astro` only — no new components, no data changes, no
`global.css` changes. Reuse the existing `Card` component and design tokens, and
follow the structure/idiom already established by `training.astro`,
`fundraising.astro`, and `index.astro` (a `.section` →
`.container container-narrow flow` wrapper holding intro copy and a stack of
`Card`s, with a small page-scoped `<style>` block only if needed).

Content structure (top to bottom):

1. **Keep the `PageHeader`** — eyebrow "Rhiwbina R.F.C. · #1415", title
   "About & join us", lead about grass-roots community rugby for under 12s.
2. **Who we are** — intro paragraph(s): the Squirrels are the Under 12s (#1415)
   age group of Rhiwbina R.F.C. (link the club); fun, friendship and great
   rugby; grass-roots, community ethos. Mention the **volunteer coaching team**
   generically (no names yet).
3. **Join us — new players welcome** — `Card`: what to expect (friendly,
   inclusive, all abilities), and a clear call to come along to training at
   **Caedelyn Park** with a link to `/training/` for times. Reinforce that new
   players are always welcome.
4. **Get in touch** — `Card`: email
   [`contact@squirrels.team`](mailto:contact@squirrels.team) as the way to reach
   the coaches / team manager.
5. **Follow & find us** — `Card`: link to the parent club
   [Rhiwbina R.F.C.](https://www.rhiwbinarfc.co.uk/) and the team
   [Instagram](https://www.instagram.com/rhiwbinarfc1415/). External links open
   in a new tab with `rel="noopener noreferrer"` and an accessible label
   indicating they open externally where helpful.

Remove the placeholder line ("Coaching team, socials and more are being added —
tracked in issue #7") and, with it, the now-unneeded `.muted` scoped style
unless still used.

### Why no shared component

Only one page renders this content and it is static markup, so inlining in
`about.astro` matches the project's current altitude (cf. `training.astro`,
`fundraising.astro`). Extracting a component would be premature abstraction.

### Accessibility / external links

- Instagram and parent-club links are external: use
  `target="_blank" rel="noopener noreferrer"`. Where the link text alone
  wouldn't make the destination obvious, add a `visually-hidden` "(opens in a
  new tab)" or descriptive `aria-label`.
- Keep contrast and semantics consistent with sibling pages (headings, lists,
  `Card` titles as `<h3>`).

## Files Modified

- `src/pages/about.astro` — build out the full page (Who we are, Join us, Get in
  touch, Follow & find us); remove the placeholder line; keep using
  `BaseLayout` / `PageHeader` / `Card`; minimal scoped `<style>` only if needed.
- `docs/plan/issues/7_about_join_us_page.md` — this plan.

**No changes** to components, `src/content/*`, `src/lib/*`, `Header.astro`,
`Footer.astro`, or `global.css` — the nav/footer already link `/about/` and the
shared styles already exist.

## Testing Strategy

### Build / type check

- `npm run check` — Astro type-check passes (no TS errors).
- `npm run build` — site builds to `dist/` with no errors; `/about/` emits.

### Manual / visual verification

- `npm run dev`, then load `/about/`:
  - Who we are, Join us, Get in touch, and Follow & find us are present and
    clearly grouped.
  - The contact email is a working `mailto:` link to `contact@squirrels.team`.
  - The Rhiwbina R.F.C. link points to `https://www.rhiwbinarfc.co.uk/` and the
    Instagram link to `https://www.instagram.com/rhiwbinarfc1415/`; both open in
    a new tab.
  - The "training" link resolves to `/training/`.
  - The placeholder "tracked in issue #7" line is gone.
  - Renders correctly at a 375px-wide mobile viewport (mobile-first).

### Integration testing (smoke)

- `/about/` link in the header nav resolves and shows `aria-current="page"`.
- Footer "About" link resolves to the page.

## Acceptance criteria mapping

| Criterion (issue #7)                                  | Where met                                         |
| ----------------------------------------------------- | ------------------------------------------------- |
| Build the About / Join us page                        | Reworked `about.astro` (intro + 3 grouped Cards)  |
| Add contact details                                   | "Get in touch" card — `mailto:contact@squirrels.team` |
| Link parent club + socials                            | "Follow & find us" card — Rhiwbina R.F.C. + Instagram |
| A new family understands who we are and how to join   | "Who we are" intro + "Join us" card → `/training/` |

## Review Summary

**Overall Assessment: Approved (iteration 1/3)**

Validated assumptions:

- `about.astro` is a stub already wired into the header nav and footer — the
  work is content build-out, not new plumbing or routing. Confirmed by reading
  `Header.astro` (nav item `/about/`) and `Footer.astro`.
- All shared building blocks (`BaseLayout`, `PageHeader`, `Card`, design tokens,
  `.button` styles) exist and are reused by sibling pages; no `global.css`
  change needed.
- Open content questions resolved with the maintainer (email-only contact,
  Instagram `rhiwbinarfc1415`, generic coaching). No other socials, no named
  coaches.
- Established facts reused are present in-repo: `contact@squirrels.team`, parent
  club `https://www.rhiwbinarfc.co.uk/` (used in `Footer.astro` + current
  `about.astro`), `/training/` route.
- `.visually-hidden` utility exists in `global.css:154` for an accessible
  "(opens in a new tab)" label.

Required-during-implementation notes:

- **Match the repo's external-link idiom.** `SubscribeButtons.astro` uses
  `target="_blank" rel="noopener"` — use the same for the Instagram and
  parent-club links in the "Follow & find us" card (not `noopener noreferrer`).
- Keep `Card` titles as `<h3>` (component default) and lists semantic.
- Keep any scoped `<style>` minimal and token-based; do not edit `global.css`.

No blocking issues; proceed to implementation.

## Out of scope / decisions

- **No named coaches/managers** — generic "volunteer coaching team" wording per
  maintainer; names can be added in a future change.
- **Email only for contact** — no phone/WhatsApp; mailbox deliverability is
  tracked separately in #11. Publishing the address here does not depend on #11
  being complete.
- **Instagram only** — no Facebook/X linked; other socials can be added later.
- No changes to the design system (#2), nav/footer, or fixtures data.
