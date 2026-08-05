---
status: In Progress
issue: 65
issue_url: https://github.com/denhamparry/squirrelsteam/issues/65
branch: denhamparry.co.uk/fix/gh-issue-065
---

# Plan: Fix literal entities in card titles

## Problem

Three `Card` title props pass `&amp;` as part of an Astro component prop.
Component props are JavaScript string values, so `Card.astro` escapes the
literal ampersand when it renders `{title}` and the generated page contains
`&amp;amp;`. Plain HTML text does not have this problem because Astro decodes the
entity while parsing the template.

## Acceptance criteria

- [x] The Home, Training, and About card titles render an ampersand rather than
      the visible text `&amp;`.
- [x] No component prop in `src/` contains an HTML entity that will render
      literally.
- [x] Astro type-checking and the production build pass.

## Implementation steps

1. Replace `&amp;` with a literal `&` in the affected `Card` title props on the
   Home, Training, and About pages.
2. Leave entities in plain HTML text unchanged because those are decoded
   correctly by the Astro template parser.
3. Build the site and inspect both source and generated HTML for the corrected
   behavior and absence of double-escaped card-title entities.

## Files expected to change

- `docs/plan/issues/65_fix_card_title_ampersands.md`
- `src/pages/index.astro`
- `src/pages/training.astro`
- `src/pages/about.astro`

## Validation

- Reproduce the original failure from the unmodified build by confirming the
  three generated card headings contain `&amp;amp;`.
- Run `npm run check`.
- Run `npm run build`.
- Confirm generated Home, Training, and About card headings contain `&amp;` and
  not `&amp;amp;`.
- Search component props throughout `src/` for named or numeric HTML entities
  and require no matches.
- Confirm the known plain-HTML entities remain unchanged and generate the
  expected single-escaped HTML.
- Run `git diff --check` and the repository pre-commit hooks against the exact
  staged file set.

## Risks and open questions

- A broad replacement would incorrectly churn valid entities in plain HTML
  text, so the edit is restricted to component props.
- A literal ampersand in an Astro component attribute must remain accepted by
  the parser; `npm run check` and `npm run build` cover that syntax and render
  path.
- No deploy is requested. The workflow stops with an open PR.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Home card title renders `&amp;amp;` visibly | Implement in this PR | Literal `&` prop and generated Home heading |
| Training card title has the same bug | Implement in this PR | Literal `&` prop and generated Training heading |
| About card title has the same bug | Implement in this PR | Literal `&` prop and generated About heading |
| No component props contain literal-rendering HTML entities | Implement and validate in this PR | Complete `src/` component-prop sweep has no matches |
| Entities in plain HTML text render correctly | Validated without a change | Known `<a>`, `<li>`, and `<dt>` entities remain and generated text is correct |
| Proposed literal-ampersand fix | Implement in this PR | Three scoped source substitutions |
| Deployment | Intentionally out of scope | No deploy flag or plan metadata |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The failure-shaped baseline reproduced all three reported defects on
  2026-08-05: generated Home, Training, and About card headings contain
  `&amp;amp;`, while `npm run check` and `npm run build` otherwise pass.
- The analogous-pattern sweep searched every Astro, JSX, TSX, Vue, and Svelte
  source file for named and numeric HTML entities. A multiline component-prop
  query found exactly the three `Card` titles named by the issue; the broader
  search found only four additional plain-HTML text entities, all intentionally
  different and correctly decoded by Astro.
- `Card.astro` renders its `title` prop through `{title}`, confirming the shared
  failure mechanism without requiring a component-level change. Changing the
  component to interpret arbitrary HTML would broaden behavior and introduce
  unnecessary injection risk.
- The smallest safe fix is therefore the three literal-ampersand substitutions.
  Validation covers the original failure, corrected generated output, the
  unchanged plain-HTML control path, component-prop source coverage, type
  checking, and the production build.

## Branch review

**Classification:** Code-relevant Astro template changes.

**Review iteration 1:** Approved with no blocking or non-blocking findings.

- The live issue was re-fetched on 2026-08-05 and its complete problem,
  affected-location list, proposed fix, unchanged plain-HTML cases, and both
  acceptance criteria remain represented in Issue traceability.
- Phase 3.5 found exactly the four expected paths: the three affected pages and
  this plan. No unrelated path changed.
- `differential-review` is not available in this Codex session, and no listed
  specialist review matches a three-line static template-string correction.
  The manual fallback inspected the complete diff, `Card.astro`'s prop render
  path, all affected callers, generated HTML, Astro parser/type-check behavior,
  and the repository-wide entity search.
- The fix retains Astro's normal escaping in `Card.astro`; it does not interpret
  arbitrary prop content as HTML or broaden the component's trust boundary.
- The final analogous-pattern sweep repeated the multiline component-prop
  query across Astro, JSX, TSX, Vue, and Svelte sources and found no remaining
  HTML entity in a component prop. The five source entities left by the broader
  sweep are plain HTML text and intentionally different.
- Failure, corrected-success, and unchanged-control evidence are all present.
  The changed Markdown plan contains no executable shell fence.
- Direct in-app browser verification was attempted but no browser backend was
  available. This is non-blocking because the production HTML assertions cover
  the exact escaped text nodes responsible for the reported rendering defect.

## Validation results

- Baseline `npm run check`: passed with 19 files and zero diagnostics.
- Baseline `npm run build`: passed and reproduced `&amp;amp;` in all three
  reported generated card headings.
- Updated `npm run check`: passed with 19 files and zero diagnostics.
- Updated `npm run build`: passed and generated all six pages.
- Generated-heading assertions: passed; Home, Training, and About headings each
  contain `&amp;`, with no `&amp;amp;` in those pages.
- Component-prop entity sweep: passed with no matches.
- Plain-HTML control checks: passed for `Fixtures &amp; calendar`, the fixture
  arrow, both Training list items, and `Penalties &amp; free kicks`.
- `git diff --check`: passed.
- Repository pre-commit hooks: passed against the exact four-file staged set.

## Post-PR verification

Pending.
