---
status: Complete
issues: [160, 161, 162]
issue_urls:
  - https://github.com/denhamparry/squirrelsteam/issues/160
  - https://github.com/denhamparry/squirrelsteam/issues/161
  - https://github.com/denhamparry/squirrelsteam/issues/162
branch: denhamparry.co.uk/fix/gh-issue-160
deploy: no
---

# Plan: Fix Results-tab mobile and no-JavaScript behavior

## Problem and outcome

The Results feature merged in PR #159 has three related presentation defects:
its `#results` panel scrolls and focuses underneath the sticky header, its
five-cell record leaves a dark empty mobile grid cell, and its tab controls
remain visible but inert without JavaScript. Fix all three in the shared
Fixtures page while preserving tab interactions, progressive content, desktop
layout, and the home-page deep link.

The live issues were fetched on 2026-09-14 at 13:10 UTC. All three are open,
assigned to `denhamparry`, and have no comments. PR #159 is merged in current
`main` commit `8404682`, so the grouped fix can build directly on `main` rather
than depending on an open PR.

## Acceptance criteria

- [x] At 400×800, `/fixtures/#results` selects Results and positions both the
      tablist and Results heading fully below the 68px sticky header.
- [x] Arrival does not focus or outline the whole Results panel; keyboard focus
      on the selected tab remains visible.
- [x] Click, ArrowLeft/ArrowRight, Home/End, hash changes, and the home-page
      Results link continue to select the correct tab.
- [x] Below 38rem, the final season-record cell spans both columns with no dark
      empty cell; at 38rem and above, all five cells remain one row.
- [x] Without JavaScript, no tab buttons display and both Upcoming and Results
      remain readable under their headings.
- [x] With JavaScript, the tablist is revealed, Upcoming remains the default,
      and `#results` selects Results.
- [x] Neither JavaScript mode causes horizontal scrolling at 400px.
- [x] Astro check/build, production audit, browser assertions, diff checks, and
      final staged pre-commit hooks pass.

## Implementation

1. Move the `results` fragment target from the focusable panel to the
   non-focusable tabs wrapper, rename the panel target, and add a sticky-header
   scroll margin to the wrapper.
2. Remove panel tab stops. On a Results hash, focus the selected tab with
   scrolling suppressed; keep keyboard navigation focus behavior and add an
   inset tab focus outline so clipping cannot hide it.
3. Ship the tablist with `hidden` and explicitly preserve that state in CSS;
   reveal it only after the enhancement script has found the required tabs and
   panels.
4. Make the fifth season-record cell span the two mobile columns and reset it
   to an ordinary cell in the existing five-column breakpoint.

## Files expected to change

- `src/pages/fixtures.astro`
- `docs/plan/issues/160_162_results_tab_mobile_fixes.md`

No component, fixture data, result helper, schema, home-page link, calendar,
dependency, workflow, global style, or deployment change is expected.

## Validation

- Preserve the baseline failure probe from `origin/main`: it exits 1 with all
  four expected defects (visible no-JS controls, focusable Results target,
  absent header offset, and unspanned mobile record cell).
- Build and serve the production output through Astro's preview wrapper, check
  readiness at `127.0.0.1:4321`, and stop the server after browser tests.
- Use cached Playwright Chromium revision 1234 at 400×800 with JavaScript:
  require Results selected; wrapper, tablist, and heading below the header;
  selected tab focused without page-wide panel outline; click and every
  required key working; home link resolving to the correct selected state; and
  document width bounded to the viewport.
- Repeat at 400×800 without JavaScript: require the tablist to compute to
  `display: none`, both panels to display, and no horizontal overflow.
- Inspect season-record child rectangles: the fifth cell equals the record's
  content width below 38rem; at 608px and wider five cells share one row and
  equal widths.
- Assert generated HTML keeps both panels statically unhidden, puts `hidden` on
  the tablist, uses distinct fragment and ARIA panel targets, and compiles the
  hash/click/keyboard/focus behavior.
- Run `npm run check`, `npm run build`, `npm audit --omit=dev`, normalized ICS
  hash comparison, `git diff --check`, and pre-commit on the exact staged paths.

## Risks and decisions

- The fragment target remains exactly `#results`, so existing shared links and
  the home-page URL do not change. Targeting the wrapper keeps the tablist in
  the scrolled region and avoids focusing a large panel.
- The 4.25rem header height comes from `Header.astro`; adding `var(--space-s)`
  provides a visible gap. A runtime rectangle assertion guards the relationship.
- Static panels retain headings and content. Only enhancement controls are
  hidden without JavaScript, matching issue #162's suggested progressive fix.
- The baseline Chromium observation is reproduced locally against exact commit
  `8404682`: header 0–68px, tablist −69 to −9px, Results heading 31–62px,
  focused panel outline 3px, `scroll-margin-top: 0px`, and no-JS tablist
  `display: grid`. The 368px record has five 183px cells, leaving the sixth
  dark-background position empty. This is observed evidence, not an inferred
  CSS-only model.
- No deploy, follow-up issue, PR merge, or manual issue closure is authorized.

## Issue traceability

| Source item | Timing / prerequisite | Disposition and evidence | Result |
| --- | --- | --- | --- |
| #160: tabs and heading visible below header at 400px | Pre-merge / Chromium | Header bottom 68px; tabs 115px; heading 215px | Passed |
| #160: no whole-panel outline; visible tab focus | Pre-merge / Chromium | Panel outline none; selected tab has 3px outline | Passed |
| #160: click, keys, and home link remain correct | Pre-merge / Chromium | Every interaction and navigation path exercised | Passed |
| #160: check/build/hooks | Pre-merge / dependencies | Check/build and staged hooks | Passed |
| #161: no dark/empty mobile cell | Pre-merge / Chromium | Fifth cell spans 366px versus 183px columns | Passed |
| #161: unchanged five-column desktop record | Pre-merge / Chromium | At 608px all five 114px cells share one row | Passed |
| #161: no 400px overflow | Pre-merge / Chromium | No overflow in either JavaScript mode | Passed |
| #161: check/build/hooks | Pre-merge / dependencies | Check/build and staged hooks | Passed |
| #162: no-JS controls hidden and panels readable | Pre-merge / Chromium without JS | Tablist none; both panels block with headings | Passed |
| #162: enhanced default/hash/click/key/focus behavior | Pre-merge / Chromium | Full interaction assertions | Passed |
| #162: no 400px overflow | Pre-merge / Chromium, both modes | No overflow observed | Passed |
| #162: check/build/hooks | Pre-merge / dependencies | Check/build and staged hooks | Passed |
| Suggested wrapper target and scroll margin | Pre-merge / source and runtime | `#results` wrapper with computed 84px margin | Passed |
| Suggested static `hidden` tablist | Pre-merge / generated HTML | Static hidden; CSS enforced; script revealed | Passed |
| Referenced PR #159 and issue #155 behavior | Pre-merge / target-base diff | Results content and home deep link preserved | Passed |
| #160's separately tracked #162 scope | Pre-merge / user grouping | Included in this explicitly combined PR | Passed |
| Named affected paths | Pre-merge / scope check | Fixtures page changed; Header/global CSS read only | Passed |
| Dependencies, data, schema, ICS, workflows | Pre-merge / diff and hash | No changes; normalized ICS hash preserved | Passed |
| Deploy, merge, and manual issue closure | N/A / authorization | Intentionally out of scope | Not applicable |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The three live issue bodies have compatible requirements, the same merged
  origin, and one implementation owner. A combined PR is smaller and easier to
  validate than three conflicting edits to `fixtures.astro`.
- The failure was reproduced in cached headless Chromium against the exact
  target-base commit, including geometry, active focus, computed outline,
  no-JavaScript display state, and record-cell rectangles.
- Moving only the Results panel ID would break `#results`; retaining that ID on
  the wrapper and changing `aria-controls` to the renamed panel preserves both
  fragment navigation and the tab relationship.
- Author CSS could otherwise override the HTML `hidden` state, so an explicit
  `[hidden]` rule is required. Revealing controls only after all tab primitives
  are found avoids exposing inert controls on partial initialization.
- The existing global focus rule remains authoritative. An inset offset on tab
  buttons prevents the tablist's clipped border radius from hiding the ring.
- Runtime checks cover the original failures, corrected success paths,
  click/keyboard/hash regressions, both JavaScript states, the 38rem boundary,
  and mobile overflow. No unresolved prerequisite or scope gap remains.

## Implementation evidence

- Baseline structural probe: exited 1 as the intended behavior assertion,
  reporting all four defects against `origin/main`.
- The first corrected 400×800 Chromium deep-link suite exited 1 on a behavior
  assertion: native fragment handling superseded the initial selected-tab
  focus. Focus was moved to the load boundary and the rerun passed.
- Two subsequent suite attempts exited 1 because the harness expected an exact
  computed shorthand for `outline: none` and summed rounded half-cell widths.
  These were harness/setup failures; assertions were corrected to test outline
  style and a tolerant full-width relationship, then passed without product
  changes.
- The final aggregate browser command initially exited 1 before product
  assertions because an unused diagnostic constructed the invalid selector
  `#`. Removing that diagnostic fixed the harness; the complete rerun passed.
- Final Chromium suites passed the deep link, click, ArrowLeft/ArrowRight,
  Home/End, same-page hash, home-page link, no-JavaScript, mobile record,
  exact 38rem desktop breakpoint, visible focus, and overflow checks.
- `npm run check` and `npm run build` passed with zero diagnostics and all
  routes generated. `npm audit --omit=dev` reported zero vulnerabilities.
- `pre-commit run` passed every applicable hook against the exact two staged
  paths.
- The normalized `fixtures.ics` SHA-256 remained
  `41b9ba7d74a7bb6ad0a62d04527bf216a84ec753ffdbdfa7649fe703194c60e0`.

## Branch review

- Classification: code-relevant, low-risk browser presentation and interaction
  fix. No dependency, build, workflow, authorization, parser, or deploy surface
  changed.
- The named differential and Trail of Bits review skills were unavailable. The
  manual fallback inspected the complete target-base diff, static and compiled
  output, browser focus/geometry/accessibility state, JavaScript-disabled
  rendering, all interaction branches, the breakpoint boundary, and existing
  Results content.
- The analogous-pattern sweep found only this tab system and this dark-gap
  record grid. The header height and global focus rule are shared primitives
  but remain correct and unchanged; the separate skip link is intentionally
  unrelated.
- Planned and actual paths match: only `src/pages/fixtures.astro` plus this
  combined plan. No missing or unjustified file was found.
- Review result: no blocking findings and no non-blocking follow-up ideas.
