---
status: Complete
issue: 210
issue_url: https://github.com/denhamparry/squirrelsteam/issues/210
branch: denhamparry.co.uk/fix/gh-issue-210
deploy: no
---

# Plan: Validate configured noindex routes exist

## Problem and outcome

`NOINDEX_PATHS` rejects malformed leading syntax, but a typo such as `/abuot`
or a trailing space after `/about` remains a silent no-op: the build
succeeds, no page receives `noindex`, and the intended page remains in the
sitemap. Reject surrounding whitespace when the shared SEO configuration is
loaded, then validate the configured paths against Astro's final generated
page inventory so a well-formed but nonexistent route fails the production
build with every unmatched entry named.

Issue #210 and its empty discussion were fetched at
2026-09-16T20:55:00+01:00. The documented reproduction comes from the
owner-authored [verification comment on PR #209](https://github.com/denhamparry/squirrelsteam/pull/209#issuecomment-5702198656),
which records real builds at the merged implementation SHA. The installed
Astro 7.3.2 integration type declaration documents that `astro:build:done`
receives the generated page pathnames.

## Implementation

1. Extend the existing module-load assertion to reject leading or trailing
   whitespace while retaining `/`, `/about`, and `/about/` as valid syntax.
2. Export the existing path normalizer, extend it to canonicalize Astro's
   relative generated pathnames (including `""` for `/`), and add a focused
   helper that compares configured `NOINDEX_PATHS` entries with an iterable of
   generated page pathnames using that same normalization rule.
3. Add a small Astro integration whose `astro:build:done` hook calls the helper
   and throws one clear error naming all unmatched configured entries.
4. Preserve the final production configuration as an empty list and retain the
   existing layout and sitemap consumers.

## Files expected to change

- `src/lib/seo.ts`
- `astro.config.mjs`
- `docs/plan/issues/210_validate_noindex_routes.md`

Page content, route inventory, crawler policy, dependencies, workflows,
deployment, issue closure, and worktree cleanup are intentionally out of scope.

## Validation

- Use `npm ci` as the only prerequisite; no server or external service is
  required.
- Before implementation, run a real build with `/abuot` to reproduce exit 0,
  a six-route sitemap, and no robots metadata. Observe the real
  `astro:build:done` pathnames with a temporary local hook. Restore both files.
- Run focused helper checks proving matching is normalization-aware, reports
  multiple unmatched entries in configuration order, and does not mutate its
  inputs.
- Run real negative builds for `/abuot` and `/about` followed by a trailing
  space; require non-zero exit status and an error containing the JSON-encoded
  offending entry.
- Run real builds for `/`, `/about`, and `/about/`; require exactly the selected
  page to emit `noindex, follow` and only that page to leave the sitemap.
- Restore the empty list, run `npm run check` and `npm run build`, and require
  exactly six sitemap routes with no robots metadata in generated HTML.
- Run `npm audit --omit=dev`, `git diff --check`, and the final staged
  `pre-commit run --all-files` workflow.

## Risks and research review

This is a build-time validator over Astro's generated static-page inventory.
The risk is a false rejection caused by trailing-slash differences or by
comparing against source routes rather than generated pages. A shared
normalizer, real hook observation, valid-route build matrix, and empty-list
control cover those boundaries. The validator does not run in development or
alter emitted pages; rollback is the two code-file diff. Because the workflow
classifies validator changes as high-risk, focused evidence receives root
self-review and one independent read-only reviewer before the aggregate suite.

The real pre-change probe built `/abuot` with exit 0, all six sitemap routes,
and no robots metadata. The same build observed Astro's hook pathnames as
`["about/", "fixtures/", "fundraising/", "rules/", "training/", ""]`, so the
normalizer must add the absent leading slash as well as normalize trailing
slashes. This directly distinguishes the chosen implementation from one that
would incorrectly reject every valid configured route. The plan was approved
after this first research-review iteration.

The analogous-pattern sweep covers all route-list, pathname, generated-route,
and sitemap comparisons under `src/` and `astro.config.mjs`. `NOINDEX_PATHS` is
the only maintainer-edited page route list. `NON_PAGE_PATHS` is a fixed internal
endpoint exclusion, and header active-state prefix matching is intentionally a
navigation concern, so neither needs generated-page existence validation.

## Implementation validation

- `npm ci` installed 267 locked packages and reported zero vulnerabilities.
- The base `/abuot` probe reproduced exit 0, six sitemap routes, and no robots
  metadata. The temporary hook observed the six final pathnames documented
  above before both source files were restored.
- Focused helper checks covered root, relative, absolute, and repeated-trailing-
  slash normalization. With `/about`, `/abuot`, and `/missing/` configured, the
  helper returned the latter two in order and did not mutate the page input.
- A real build with `/abuot` and `/missing/` exited 1 and named both unmatched
  values. A real build with `/about` plus a trailing space exited 1 during
  module loading and named the JSON-encoded value.
- Separate builds for `/`, `/about`, and `/about/` succeeded. Each emitted
  `noindex, follow` on exactly the selected page, removed only that page from
  the sitemap, and retained five sitemap routes.
- After restoring the empty list, `npm run check` passed 23 files with zero
  diagnostics; `npm run build` generated six pages; the sitemap exactly matched
  the six expected routes; and no generated HTML contained robots metadata.
- `npm audit --omit=dev`, targeted Markdown lint, and `git diff --check` passed.
- One negative-build harness attempt used zsh's read-only `status` variable and
  stopped after the build but before assertions; the corrected rerun exited 1
  for the expected product error and passed its assertions. A later read-only
  issue-digest helper used CommonJS `require` in ESM mode and failed after the
  live issue fetch and all review output had completed. Neither harness error
  changed product files or served as behavior evidence.

## Branch review

**Classification:** code-relevant, build-time validator change.

- Planned and actual paths match: `src/lib/seo.ts`, `astro.config.mjs`, and this
  plan.
- `differential-review` and specialist Trail of Bits skills are unavailable in
  this session. The manual fallback inspected the complete diff, Astro's hook
  type and implementation, both existing consumers, every analogous route and
  pathname comparison, and the focused failure/success matrix.
- The mandatory independent read-only reviewer separately confirmed final-page
  hook timing, sequential integration ordering, relative/root pathname
  normalization, complete unmatched-entry diagnostics, existing-consumer
  compatibility, and scoped file ownership. It reported no blocking or
  non-blocking findings and made no changes.
- This Markdown file contains no executable shell fence. Review found no
  follow-up idea.

## Issue traceability

| Issue item | Disposition | Timing / owner / prerequisite | Evidence target | Current result |
| --- | --- | --- | --- | --- |
| `/abuot` fails build and is named | Implement and validate | Pre-merge / Codex / installed dependencies | Non-zero real build with named entry | Passed |
| `/about` plus trailing space fails check or build and is named | Implement and validate at module load | Pre-merge / Codex / installed dependencies | Non-zero real build with named entry | Passed |
| `/`, `/about`, and `/about/` retain noindex/sitemap behavior | Validate existing consumers with new validator | Pre-merge / Codex / successful builds | Three generated HTML/sitemap probes | Passed |
| Empty list retains exactly six sitemap routes and no robots metadata | Validate unchanged production state | Pre-merge / Codex / successful final build | Exact generated-output assertions | Passed |
| Check, build, and hooks pass | Validate in this PR | Pre-merge / Codex / installed dependencies | Aggregate commands exit zero | Passed |
| Validate only after routes are known | Implement in Astro build hook | Pre-merge / Codex | Installed integration contract and real hook probe | Passed: final generated pathnames observed |
| Share normalization across layout, sitemap, and existence check | Implement in shared helper | Pre-merge / Codex | Source review and route-form build matrix | Passed |
| Name every unmatched entry | Implement in one build error | Pre-merge / Codex | Focused multi-entry helper check | Passed with two unmatched values |
| Affected SEO, config, and layout paths | Change shared helper/config; validate layout unchanged | Pre-merge / Codex | Diff and generated-output review | Passed |
| Production `NOINDEX_PATHS` remains empty | Preserve and verify | Pre-merge / Codex | Final source and build | Passed |
| Merge, deploy, issue closure, or cleanup | Intentionally out of scope | User/operator | No such operation | Not performed |
