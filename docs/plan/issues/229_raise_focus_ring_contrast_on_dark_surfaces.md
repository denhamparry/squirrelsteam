---
status: Complete
issue: 229
issue_url: https://github.com/denhamparry/squirrelsteam/issues/229
branch: denhamparry.co.uk/fix/gh-issue-229
deploy: no
---

# Plan: Raise focus-ring contrast on dark surfaces

## Problem and outcome

`src/styles/global.css` draws every keyboard focus ring as
`outline: 3px solid var(--color-accent)` (`#c8102e`). On the site's
`#1a1a1a` surfaces that is about 2.96:1, below the 3:1 non-text contrast
threshold (WCAG 2.2 SC 1.4.11). Issue #229 reports this for the header. The
same ring also sits on black in these places:

| Surface | Focusable content | Where the ring lands |
| --- | --- | --- |
| `.site-header` (`Header.astro`) | Brand, nav links, Clubhouse button, mobile menu | Black header and dropdown |
| `.site-footer` (`Footer.astro`) | Footer nav, R.F.C. link, sponsor-band links | Black footer (the sponsor band is transparent) |
| `.hero` (`index.astro`) | Hero buttons | Black hero |
| `.skip-link` (`global.css`) | The skip link | Black header behind it |
| Selected `.fixture-tabs__tab` (`fixtures.astro`) | The tab | Inside the black tab (`outline-offset: -4px`) |

Outcome: rings on dark surfaces are white (about 17.4:1). Rings on light
surfaces stay red, which passes 3:1 there.

## Implementation

1. `src/styles/global.css`:
   - Add a `--focus-ring: var(--color-accent)` token to `:root`.
   - Change `:focus-visible` to `outline: 3px solid var(--focus-ring)`.
   - Set `--focus-ring: var(--color-white)` on `.skip-link`.
   - Add a short comment explaining the 3:1 reason.
2. Set `--focus-ring: var(--color-white)` on each dark surface, in its own
   scoped style. The property inherits to every focusable descendant.
   - `src/components/Header.astro`: `.site-header`
   - `src/components/Footer.astro`: `.site-footer`
   - `src/pages/index.astro`: `.hero`
   - `src/components/PageHeader.astro`: `.page-header`. It has no focusable
     content today, but this keeps every dark surface consistent.
   - `src/pages/fixtures.astro`: `.fixture-tabs__tab[aria-selected="true"]`

A token is used, not a header-only `outline-color` override, so the light
default and each dark surface are declared once and future dark sections only
need to set the token.

## Files expected to change

- `src/styles/global.css`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/components/PageHeader.astro`
- `src/pages/index.astro`
- `src/pages/fixtures.astro`
- `docs/plan/issues/229_raise_focus_ring_contrast_on_dark_surfaces.md`

## Validation

- **Automated audit (Playwright + Chromium):** on all 7 built pages, at 1280px
  and at 390px with the mobile menu open, press Tab through every focusable
  element. For each one, record:
  - the computed `outline-color`;
  - the background the ring is drawn on: the element's own background when
    `outline-offset` is negative, otherwise the nearest ancestor with an
    opaque background.

  Compute the WCAG contrast ratio and require ≥ 3:1 for every element. Run the
  audit on the unmodified build first, so the failures are reproduced before
  the fix.
- `npm run check` and `npm run build` pass. Pre-commit passes.

## Risks and research validation

- **Contrast values (computed with the WCAG relative-luminance formula during
  implementation):** `#c8102e` against `#1a1a1a`, `#ffffff` and `#f7f7f5`, and
  `#ffffff` against `#1a1a1a`.
- **White elements inside dark surfaces** (the Clubhouse pill): the ring is
  offset 2px outside the element, onto the black header, so white passes. The
  audit measures this case.

## Review Summary

**Overall Assessment:** Approved (author re-verification, iteration 1/3; not
an independent review)

| Claim | Evidence | Result |
| --- | --- | --- |
| Contrast values | WCAG relative-luminance calculation: `#c8102e`/`#1a1a1a` 2.96, `/#ffffff` 5.88, `/#f7f7f5` 5.48; `#ffffff`/`#1a1a1a` 17.4 | Confirms the failure and the fix |
| Dark surfaces with focusable content | `rg` for `--color-black` backgrounds, then each component read | Five surfaces listed |
| Sponsor band background | `SponsorBand.astro` sets no background (transparent on the black footer) | White ring is correct there |

Required change during implementation: reproduce the failure with the
automated audit before the fix.

## Implementation validation

Run on 2026-09-18 against local `dist/` builds with Playwright 1.55.0
(Chromium Headless Shell 140).

The audit presses Tab through every page and settles 300ms after each press,
so the skip link's `top` transition finishes. It then measures the colour
actually painted in the ring zone: `elementsFromPoint` just outside the
element, or the element's own background for an inset ring. There are three
runs:

- 1280px;
- 390px with the menu closed;
- 390px with the menu open, auditing header elements only. The open menu
  overlays page content, so content under it is not meaningful to measure.

| Criterion | Evidence | Result |
| --- | --- | --- |
| Failure reproduced | Unmodified build: 335 of 397 rings below 3:1, all `#c8102e` on `#1a1a1a`: header, footer, sponsor links, hero buttons, skip link, selected fixtures tab | Reproduced |
| Fix | Same audit after the change: 397 rings, 0 below 3:1 | Pass |
| Light surfaces keep red | `/fixtures/` probe: 10 light-surface rings `rgb(200,16,46)` (5.48–5.88:1), 48 dark-surface rings `rgb(255,255,255)` (17.4:1) | Pass |
| Visual | Screenshots: white ring around the focused header "Fixtures" link; white inset ring inside the selected "Upcoming" tab | Pass |
| `npm run check` / `npm run build` | 0 errors, 0 warnings, 0 hints; 7 pages built | Pass |
