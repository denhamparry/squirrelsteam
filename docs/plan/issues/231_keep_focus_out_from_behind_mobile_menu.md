---
status: Complete
issue: 231
issue_url: https://github.com/denhamparry/squirrelsteam/issues/231
branch: denhamparry.co.uk/fix/gh-issue-231
deploy: no
---

# Plan: Stop keyboard focus from hiding behind the open mobile menu

## Problem and outcome

At ≤60rem, the header's primary nav is a CSS-only disclosure:

- a hidden checkbox, `#nav-toggle`, holds the state;
- `.nav-toggle:checked ~ .site-nav { display: block }` shows the nav as an
  absolutely positioned overlay under the sticky header.

Nothing closes the menu when focus leaves it. Tabbing past the last item
(Clubhouse) therefore moves focus into page content hidden under the overlay.
That fails WCAG 2.2 SC 2.4.11, Focus Not Obscured (Minimum).

**A related gap found while planning:** the checkbox is `display: none` at
every width, and its `<label>` is not focusable. A keyboard-only user
therefore can't open the mobile menu at all; the issue's reproduction opens it
by tap or click. Any fix that has the menu close on Escape and return focus to
the toggle needs a toggle that can take focus. That makes a focusable toggle
part of this issue, not a separate one.

## Implementation

All changes are in `src/components/Header.astro`, as progressive enhancement:

1. **Markup.** Keep the checkbox and `<label>` as the no-JS toggle. Add a
   native `<button type="button" class="nav-toggle-label nav-toggle-button"
   aria-controls="site-nav" aria-expanded="false" hidden>` with the same
   visually hidden text and hamburger bar. Give the `<nav>` `id="site-nav"`.
   The checkbox stays the single source of state, so the existing
   `:checked ~ .site-nav` CSS keeps working in both modes.
2. **CSS.** Add `.nav-toggle-label[hidden] { display: none; }` so the
   `hidden` attribute beats the mobile `display: inline-flex` rule.
3. **Script** (an Astro `<script>`, bundled, same style as `fixtures.astro`),
   run on load:
   - Swap toggles: hide the `<label>` and show the button.
   - `setOpen(open, focusToggle?)`: sets `checkbox.checked` and the button's
     `aria-expanded`, and optionally moves focus to the button.
   - Button `click` toggles the menu.
   - `focusout` on `.site-header`: close the menu when `relatedTarget` is a
     non-null element outside the header. Tab past Clubhouse therefore closes
     the overlay before focus lands on the content.
   - `keydown` `Escape` while the menu is open (focus in the header): close it
     and return focus to the button.

   `aria-expanded` always mirrors the checkbox. Without JS, the label and
   checkbox work exactly as they do today (acceptance criterion 3).

## Files expected to change

- `src/components/Header.astro`
- `docs/plan/issues/231_keep_focus_out_from_behind_mobile_menu.md`

## Validation

Run with Playwright + Chromium against `npm run build` output, at 390x844
unless stated.

1. **Reproduce on the unmodified build:** open the menu, Tab through all 7
   pages, and count Tab stops whose centre point `elementsFromPoint` reports
   as covered by `.site-nav` while the menu is open. The fix must bring this
   to 0.
2. **Keyboard open:** Tab reaches the toggle button, and `Enter` opens the
   menu: `aria-expanded="true"` and the nav is visible.
3. **Tab past Clubhouse:** the menu closes, `aria-expanded="false"`, and the
   next focused element isn't covered.
4. **Escape:** from a menu link, the menu closes and focus is on the toggle.
5. **Shift+Tab** from the first menu link stays in the header (toggle), and
   the menu stays open.
6. **No JS** (`java_script_enabled=False`): the label is visible, the button
   stays hidden, and clicking the label opens the menu.
7. **Desktop 1280px:** both toggles are hidden, the nav is visible, and the
   Tab order is unchanged.
8. `npm run check`, `npm run build` and pre-commit all pass.

## Risks

- **Safari on click:** Safari doesn't focus a `<button>` when it's clicked, so
  `focusout` may not fire for pointer users. That doesn't matter: a keyboard
  Tab from the document start still enters the header first, and
  `relatedTarget` checks handle every keyboard exit.
- **`relatedTarget === null`** (window blur, or a click on non-focusable
  content): the menu stays open. This avoids closing it when the user
  switches apps, and pointer users close it with the toggle as before.

## Review Summary

**Overall Assessment:** Approved (author re-verification, iteration 1/3; not
an independent review)

| Claim | Evidence | Result |
| --- | --- | --- |
| Menu is CSS-only, with nothing closing it on focus exit | `Header.astro` markup and mobile CSS; `rg '<script' src` finds no header script | Confirmed |
| Toggle not keyboard-focusable | `.nav-toggle { display: none }` applies at every width; `<label>` has no tabindex | To reproduce in Playwright before the fix |

Required change during implementation: reproduce both failures on the
unmodified build.

## Implementation validation

Run on 2026-09-18 against local `dist/` builds with Playwright 1.55.0
(Chromium Headless Shell 140). The same scenario script ran before and after
the change.

| Scenario | Unmodified build | After |
| --- | --- | --- |
| Tab stops covered by the open menu (7 pages, 390px) | 3 (`/` "Fixtures & calendar", `/` "Training info", `/about/` "Rhiwbina R.F.C.") | 0 |
| Keyboard reaches the menu toggle | No (never focusable) | Yes (`<button aria-controls="site-nav">`) |
| Enter opens the menu, `aria-expanded="true"` | n/a | Pass |
| Shift+Tab from the first menu link returns to the toggle, menu stays open | n/a | Pass |
| Escape closes the menu and focuses the toggle, `aria-expanded="false"` | n/a | Pass |
| Tab past Clubhouse closes the menu; next stop ("Fixtures & calendar") visible | n/a | Pass |
| No JS: label visible, button hidden, label click opens the menu | Pass | Pass |
| Desktop 1280px: toggles hidden, nav visible, Tab order unchanged | Pass | Pass (same 11-stop order) |

Screenshots: the closed toggle looks the same with and without JS, and the
keyboard-opened menu shows the white focus ring on the toggle.
`npm run check`: 0 errors, 0 warnings, 0 hints. `npm run build`: 7 pages.
