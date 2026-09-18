---
status: Complete
issue: 225
issue_url: https://github.com/denhamparry/squirrelsteam/issues/225
branch: denhamparry.co.uk/feat/gh-issue-225
deploy: no
---

# Plan: Replace the header Donate button with a white Clubhouse button

## Problem and outcome

The site header ends its primary nav with a red **Donate** button linking to
`https://shop.squirrels.team`. Replace it with a white **Clubhouse** button
(black text) linking to `https://player.squirrels.team`. Keep its top-right
desktop placement and its full-width slot in the mobile menu.

Issue #225 was fetched on 2026-09-18 with no comments. These stay unchanged:

- the Donate buttons on the home and Fundraising pages;
- the footer's Donate link;
- `.button--donate`;
- the "Fundraising" nav link.

## Implementation

All changes are in `src/components/Header.astro`:

1. Rename `donateUrl` to `clubhouseUrl` = `"https://player.squirrels.team"`.
   Change the list item's class to `site-nav__clubhouse`, and the link to
   `<a class="button" href={clubhouseUrl}>Clubhouse</a>`.
2. Replace the scoped `.site-nav__donate a` rules with `.site-nav__clubhouse a`
   rules, placed **after** the `.site-nav a` / `:hover` rules:
   - Default state: `background: var(--color-white)`,
     `color: var(--color-black)`, and `border: 2px solid var(--color-white)`.
   - `:hover` and `:focus-visible`: `background: transparent`,
     `color: var(--color-white)`, and the border stays white. That is an
     outlined white pill on the black header.
3. Rename the mobile `.site-nav__donate` rules to `.site-nav__clubhouse`,
   keeping the full-width, centred layout.

**Why the styles are header-scoped, not a global `.button--light`:** Astro adds
a scope attribute to component styles. That makes the header's
`.site-nav a { color: var(--color-white); border-bottom: 2px solid transparent; }`
more specific than any single global class. A global variant would render white
text on a white button and drop its bottom border. Header-scoped rules later in
the same block win at equal specificity. The existing `.site-nav__donate a`
already relies on this.

**Border change:** The old rule set `border-bottom: none`. That was invisible on
the solid red button, but it would clip the outlined hover state, so the new
rule sets all four borders.

**Focus ring:** The global `:focus-visible` outline (red) is site-wide keyboard
focus styling, not button colour. It stays, and the button also inverts on
focus.

## Files expected to change

- `src/components/Header.astro`
- `docs/plan/issues/225_replace_header_donate_with_clubhouse.md`

## Validation

- `npm run check` and `npm run build` pass.
- In the built HTML (`dist/**/*.html`), every page's header has exactly one
  `href="https://player.squirrels.team"` link with the text `Clubhouse`. No
  header contains `shop.squirrels.team`. The home page, the Fundraising page
  and the footer still link to `shop.squirrels.team`.
- Serve `dist/` and use headless Chromium (Playwright) to check:
  - on desktop (1280px) and in the mobile menu (390px), the button's computed
    background is white, its text colour is `#1a1a1a`, and all four borders
    are 2px;
  - on hover and on keyboard focus, the background is transparent and the text
    is white;
  - screenshots for visual inspection.
- Contrast: `#1a1a1a` on `#ffffff`, and `#ffffff` on the `#1a1a1a` header,
  are both about 17.4:1, well above WCAG AA (4.5:1).
- Pre-commit passes.

## Risks and research validation

- **Target URL:** `curl -L https://player.squirrels.team` returned HTTP 200 on
  2026-09-18.
- **Specificity:** `Header.astro` lines 118–134 show the `.site-nav a` rules and
  the existing `.site-nav__donate a` override. The browser check confirms that
  the computed colours actually apply.
- **Other Donate uses:** found with
  `rg 'site-nav__donate|button--donate'`. Header lines 57–58, 132 and 192–195
  change. `index.astro:98` and `fundraising.astro:77` keep `.button--donate`.
  The footer's plain Donate link is unaffected.

## Review Summary

**Overall Assessment:** Approved (author re-verification, iteration 1/3; not
an independent review)

| Claim | Evidence | Result |
| --- | --- | --- |
| Target URL live | `curl -L` → 200 | Confirmed |
| Change scope | `rg` of donate classes and URLs | Header only |
| Scoped rules outrank a global variant | Check the compiled `dist/_astro/*.css` selectors during implementation | Required check |

Required change during implementation: record the compiled selector evidence.

## Implementation validation

Run on 2026-09-18 against a local `dist/` build, using Playwright 1.55.0 with
Chromium Headless Shell 140.

| Criterion | Evidence | Result |
| --- | --- | --- |
| `npm run check` / `npm run build` | 0 errors, 0 warnings, 0 hints; 7 pages built | Pass |
| Compiled specificity | `.site-nav__clubhouse[data-astro-cid-…] a[data-astro-cid-…]` equals `.site-nav[…] a[…]`, and the Clubhouse rules come later | Pass |
| Header link on every page | All 7 built pages: 1 `player.squirrels.team` "Clubhouse" link and 0 `shop`/"Donate" in `<header>` | Pass |
| Donate kept elsewhere | `shop.squirrels.team` still outside the header: footer on all 7 pages, plus the Donate buttons on `/` and `/fundraising/` | Pass |
| Rest state (1280px and 390px) | Computed background `rgb(255,255,255)`, text `rgb(26,26,26)`, all borders 2px white | Pass |
| Hover and keyboard focus | Transparent background, white text, 2px white border; `:focus-visible` matched after Tab | Pass |
| Placement | Desktop box 144x41 at x=1056 (right edge 1200); mobile 358px wide (full width inside a 16px gutter) | Pass |
| Contrast | `#1a1a1a` / `#ffffff` in both states ≈ 17.4:1 | AA pass |

Found during validation: in the mobile menu, the label sat flush left. The
mobile `.site-nav a { display: block }` rule overrides `.button`'s
`inline-flex`, so `justify-content: center` had no effect. The Donate button
had the same problem before this change. The mobile Clubhouse rule now sets
`display: flex`, and screenshots confirm the label is centred.
