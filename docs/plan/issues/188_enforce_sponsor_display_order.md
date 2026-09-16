---
status: Complete
issue: 188
issue_url: https://github.com/denhamparry/squirrelsteam/issues/188
branch: denhamparry.co.uk/fix/gh-issue-188
deploy: no
---

# Plan: Enforce sponsor display order

## Problem and outcome

The shared sponsor list happens to be alphabetical only because its objects were
entered that way. Both the fundraising cards and every footer render array
order directly, so appending a sponsor silently breaks the documented stable,
equal, non-ranking presentation. Make alphabetical order an explicit property
of the exported shared data while retaining the current five-sponsor output.

Issue #188 and its empty discussion were fetched at
2026-09-16T10:33:30Z. The failure was identified in
[PR #187's verification comment](https://github.com/denhamparry/squirrelsteam/pull/187#issuecomment-5695811273),
which links the stable-order requirement from #172.

## Implementation

1. State beside the sponsor data that display names are sorted alphabetically
   so placement cannot imply rank.
2. Sort the exported array with `name.localeCompare(..., "en-GB")`, leaving
   both consumers unchanged and synchronized.
3. Keep the existing data values and source order unchanged.

## Files expected to change

- `src/data/sponsors.ts`
- `docs/plan/issues/188_enforce_sponsor_display_order.md`

No sponsor names, logos, descriptions, URLs, tier information, page layout,
dependencies, deployment, issue closure, or consumer-specific ordering is in
scope.

## Validation

- Run `npm ci` as the only prerequisite; no local service is required.
- Before implementation, temporarily append an `Aardvark Ltd` fixture using an
  existing logo asset, build, and prove it renders last rather than first on the
  fundraising page and in all six footer bands. Restore the source afterward.
- After implementation, repeat the appended fixture build and require
  Aardvark first followed by the current five alphabetical names in both
  consumers. Restore the five-sponsor production list.
- Run `npm run check` and a final `npm run build`. Assert the fundraising page
  and all six footers retain the current five names in their existing order.
- Run `npm audit --omit=dev`, `git diff --check`, and the complete staged
  `pre-commit run --all-files` workflow.

## Risks and research validation

This is a low-risk build-time content-data change. `localeCompare` with an
explicit `en-GB` locale produces the current order for all five display names
on the repository's Node runtime. Sorting the exported list centralizes the
rule and means future consumers inherit it automatically; sorting separately
in either Astro component would preserve the drift risk.

The analogous-pattern sweep covered sponsor imports, `sponsors.map(...)`, and
sorting under `src/`. Both sponsor consumers require the same fix through the
shared data. Fixture sorting in `src/lib/fixtures.ts` is an unrelated,
already-explicit chronological rule.

Approved after one research-review iteration. The plan centralizes the stated
ordering policy without touching consumers, preserves all sponsor content, and
uses a real generated-output regression probe that fails under the current
append-only behavior before proving the corrected behavior.

## Implementation validation

- `npm ci` installed 267 locked packages and reported zero vulnerabilities.
- The pre-change build with an appended Aardvark fixture reproduced the issue:
  it rendered last on the fundraising page and in all six footer bands.
- The same fixture after the shared sort rendered first, followed by the five
  existing names alphabetically, on the fundraising page and in every footer.
- The fixture was removed. `npm run check` passed 23 files with zero
  diagnostics; the final `npm run build` retained exactly five sponsors in the
  original order on both consumers across all six generated pages.
- `npm audit --omit=dev` and `git diff --check` passed.

## Branch review

**Classification:** Code-relevant, low-risk shared content-data ordering.

- The planned and actual path sets match exactly: `src/data/sponsors.ts` and
  this plan.
- `differential-review` is unavailable in this session. The manual fallback
  inspected the complete diff, both consumer maps, generated output for all
  routes, `en-GB` collation, current content preservation, and every analogous
  sort/import under `src/`.
- Fixture sorting is an independent chronological rule; no other shared
  sponsor consumer or competing order mechanism exists.
- This Markdown file contains no executable shell fences. Review found no
  blocking issue and no non-blocking follow-up idea.

## Issue traceability

| Issue item | Disposition | Timing / owner / prerequisite | Evidence | Current result |
| --- | --- | --- | --- | --- |
| Appended sponsor follows documented order in both consumers | Implement and validate | Pre-merge / Codex / fixture build | Aardvark renders first on fundraising and in all footers | Pass |
| Ordering rule stated beside shared data | Implement in this PR | Pre-merge / Codex / source review | Comment explains alphabetical, non-ranking order | Pass |
| Current five retain today's order | Validate final production state | Pre-merge / Codex / final build | Exact five-name sequence in both consumers | Pass |
| Use shared data rather than consumer-specific sorting | Implement in this PR | Pre-merge / Codex / diff review | Only data module changes; both maps remain unchanged | Pass |
| Build, Astro check, and hooks pass | Validate in this PR | Pre-merge / Codex / installed dependencies | Commands exit zero on final staged content | Pass |
| Related fundraising and footer consumers | Validate without change | Pre-merge / Codex / generated pages | Both inherit the exported order | Pass |
| Sponsor content, tiers, layout, dependencies, deploy, merge, or closure | Intentionally out of scope | User/operator | No such changes or operations | Not performed |
