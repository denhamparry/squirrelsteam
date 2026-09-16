---
status: Complete
issue: 172
issue_url: https://github.com/denhamparry/squirrelsteam/issues/172
branch: denhamparry.co.uk/feat/gh-issue-172
deploy: no
---

# Plan: List sponsors on the fundraising page

## Problem and outcome

The visible fundraising page explains sponsorship but does not name the five
businesses already supporting the team. Add an equal, mobile-first sponsor-card
grid above the tier pitch, driven by the shared sponsor data introduced by
issue #169, without exposing private tier or kit-placement information.

Issue #172 and its empty discussion were fetched at 2026-09-16T09:55:23Z.
Dependencies #169, #170, and #173 are merged. Issue #171 remains open, but the
maintainer's [2026-09-16 URL comment](https://github.com/denhamparry/squirrelsteam/issues/171#issuecomment-5695534251)
confirms URLs for Cornerstone Finance Group, Imperial, and On the River. No URL
has been confirmed for D&C Plastering or Hollybush Properties Ltd, and no
one-line descriptions have been supplied. The issue explicitly requires absent
fields to render intentionally, so these gaps do not block the five-sponsor
listing and must not be filled with guessed content.

## Implementation

1. Extend the shared `Sponsor` records with an optional description field and
   add only the three maintainer-confirmed URLs. Preserve the existing
   alphabetical order, names, paired logo variants, and null values for unknown
   content.
2. Add an “Our sponsors” section above “Sponsorship tiers” on
   `/fundraising/`, with a short thank-you and one equal card per sponsor.
3. Use each dark logo variant on the light card surface with a meaningful logo
   `alt`. Render descriptions and same-tab `rel="noopener sponsored"` links
   only when their data values are present.
4. Use an explicit one-column default and two-column wider grid with zero-
   minimum tracks and shared logo/card rules. Do not add sponsor-specific size,
   order, or tier styling.

## Files expected to change

- `src/data/sponsors.ts`
- `src/pages/fundraising.astro`
- `docs/plan/issues/172_list_sponsors_fundraising.md`

No logo artwork, footer component, sponsor tier, display-name guess, unconfirmed
URL or description, navigation, sitemap, dependency, workflow, deployment, or
issue-#171 closure is in scope. Updating the shared URLs will intentionally make
the existing footer band link the same three confirmed sponsors.

## Validation

- Run `npm ci` and a baseline `npm run build`; isolate the generated `<main>`
  for `/fundraising/` and prove it contains no sponsor section before the
  change, while the existing footer still contains five logos.
- Run `npm run check` and `npm run build`; require zero exit status.
- Inspect the built fundraising `<main>`: exactly one sponsor section, five
  cards, five dark-logo images with meaningful alt text, alphabetical names,
  exactly three confirmed outbound links, and no tier or kit-placement copy.
- Inspect every built footer: the same alphabetical five sponsors, exactly the
  three confirmed links with `rel="noopener sponsored"`, and two intentionally
  unlinked images.
- Prove optional content behavior by temporarily supplying one description,
  rebuilding, and requiring exactly that description; restore the final null
  value and rebuild before review. The real three-present/two-absent URL data
  exercises both link branches without a fixture.
- Assert the CSS has one column by default, two columns at its single wider
  breakpoint, zero-minimum tracks, contained dark logos, and no sponsor-specific
  selectors. No browser is installed, so generated structure plus deterministic
  responsive CSS is the proportional mobile-layout evidence.
- Run `npm audit --omit=dev`, `git diff --check`, and the complete staged
  `pre-commit run --all-files` workflow. Only `npm ci` is required; no service
  or generated artifact must be prepared separately.

## Risks and decisions

- Shared URL changes affect both the new page cards and the existing site-wide
  footer. Validate both consumers so the #171 link contract is not only checked
  on the new page.
- All description values remain null until sponsor-confirmed copy arrives. The
  conditional template and temporary probe establish the behavior without
  publishing invented marketing claims.
- Card identity and link presence differ, but card width, logo area, typography,
  ordering, and CSS remain common. Link availability is content completeness,
  not sponsor prominence.
- The existing data order is alphabetical and therefore stable and non-ranked.
  No sort at render time is needed.

## Research validation

Approved after one review iteration. The shared data already owns the five
alphabetically ordered names and both logo polarities; the footer already
implements the required conditional same-tab link semantics; and the page's
existing `Card` and layout tokens are sufficient without a new component or
dependency. The generated baseline confirms the fundraising `<main>` contains
no sponsor listing while its footer contains all five logos.

The first composed baseline attempt exited 1 because it ran against the primary
worktree and used a brittle regular-expression extractor; this was a
harness/setup failure, not product evidence. The explicit issue-worktree rerun
completed `npm ci` and `npm run build`, then a bounded string-slice extractor
proved the intended baseline. The implementation validation will keep explicit
working directories and inspect every nested exit status.

## Implementation validation

- `npm run check` passed 23 files with zero errors, warnings, or hints, and the
  restored final `npm run build` generated six HTML pages, `fixtures.ics`, and
  the sitemap outputs while optimizing all five light and five dark logos.
- The fundraising `<main>` contains one sponsor section before the tier pitch,
  five cards and five dark-logo images in the shared alphabetical order, five
  meaningful sponsor-name logo alternatives, exactly three confirmed links, and
  no sponsor description, tier, or kit-placement claim.
- All six generated footer bands contain the same five sponsors and exactly the
  three documented same-tab links with `rel="noopener sponsored"`; D&C and
  Hollybush remain intentional plain images.
- A temporary Cornerstone description built and rendered exactly once. The
  temporary value was restored to null, and the final build contains no
  unconfirmed description.
- Source assertions confirm one zero-minimum column by default, two equal zero-
  minimum columns from 40rem, a common 7rem contained-logo area, and no
  sponsor-specific selector or tier field. The merged #170 light-background
  contact-sheet evidence covers the exact dark assets consumed here.
- The existing fundraising route remains in the sitemap and its generated HTML
  remains free of `noindex`. `npm audit --omit=dev` reports zero vulnerabilities
  and `git diff --check` passes.

## Branch review

**Classification:** Code-relevant, low-risk Astro page and shared content-data
change. No dependency, workflow, authorization, runtime service, or deploy
behavior changes.

- The planned and actual path sets are identical, and the live #172/#171
  snapshots remain unchanged from the plan's captured contract.
- `differential-review` is unavailable in this session. The manual fallback
  inspected the complete diff, both sponsor-data consumers, all six generated
  footer instances, the fundraising `<main>`, link provenance, conditional
  branches, accessible names, logo polarity, responsive CSS, indexability, and
  private-content boundaries.
- The page and footer use the same ordered array and the same link contract.
  No duplicated sponsor inventory, guessed URL, description, tier field,
  kit-placement detail, sponsor-specific scale, or new-tab behavior is present.
- The changed Markdown file contains no executable shell fences. Review found
  no blocking issue and no new non-blocking follow-up idea; incomplete sponsor
  content remains explicitly owned by existing issue #171.
- The first complete staged `pre-commit run --all-files` exited 1 because
  Markdownlint rejected one wrapped issue reference as a heading and two angle-
  bracket placeholders as inline HTML. This documentation assertion failure
  was corrected; all nine hooks passed on the complete staged rerun.

## Issue traceability

| Issue item | Disposition | Timing / owner / prerequisite | Evidence target |
| --- | --- | --- | --- |
| List all five sponsors equally without tier labels or grouping | Implement in this PR | Pre-merge / Codex / shared data | Five cards, shared classes, no tier fields or sponsor selectors |
| Stable defensible ordering | Validate existing alphabetical order | Pre-merge / Codex | Data and generated card names match the exact alphabetical sequence |
| Logo and name always render | Implement in this PR | Pre-merge / Codex / merged dark variants | Five names and five dark-logo outputs |
| Description and link render only when present | Implement and exercise | Pre-merge / Codex / confirmed content only | Temporary description probe; real 3-linked/2-unlinked split |
| Sponsor with neither optional field looks intentional | Implement in common card layout | Pre-merge / Codex | D&C and Hollybush cards retain name, logo, and equal styling without empty placeholders |
| Logos legible on the light background with meaningful alt | Implement using `logoDark` | Pre-merge / Codex / #170 assets | Generated dark asset URLs and sponsor-name logo alt values |
| Mobile-first clean reflow | Implement and validate deterministically | Pre-merge / Codex / source CSS | One-column default, two-column wider grid, zero-minimum tracks |
| Thank sponsors before pitching tiers | Implement in requested placement | Pre-merge / Codex | Sponsor section precedes the sponsorship-tier heading |
| Reuse `src/data/sponsors.ts` | Implement in this PR | Pre-merge / Codex / #169 data | Both footer and fundraising page import the same array |
| Confirmed #171 URLs | Implement only documented values | Pre-merge / maintainer comment | Exact three HTTPS destinations; two null URLs remain |
| Unconfirmed URLs, display-name changes, descriptions, and social handles | Intentionally deferred | Issue #171 / maintainer and sponsors | No guessed value committed; #171 remains open |
| Visible and indexable fundraising page | Validated without change | Pre-merge / merged #173 and #175 | Existing navigation, metadata, and sitemap output remain intact |
| Build, check, and hooks pass | Validate in this PR | Pre-merge / Codex / `npm ci` | Commands exit zero on final staged content |
| Merge, deploy, issue closure, or worktree cleanup | Intentionally out of scope | User/operator | No such operation performed |
