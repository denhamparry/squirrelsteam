---
status: Complete
issue: 186
issue_url: https://github.com/denhamparry/squirrelsteam/issues/186
branch: denhamparry.co.uk/fix/gh-issue-186
deploy: no
---

# Plan: Normalize noindex route matching

## Problem and outcome

`NOINDEX_PATHS` currently uses exact string equality. Astro supplies directory
routes with a trailing slash, so a natural entry such as `/about` silently does
nothing while `/about/` works. Canonicalize both configured entries and
incoming pathnames so the two forms behave identically, including the root
route, without changing the final empty production list.

Issue #186 and its empty discussion were fetched at
2026-09-16T10:19:18Z. The failure evidence originated in the independent review
of #175, recorded in
[PR #185's verification comment](https://github.com/denhamparry/squirrelsteam/pull/185#issuecomment-5695460622).

## Implementation

1. Add a private pathname canonicalizer in `src/lib/seo.ts` that preserves `/`
   and gives non-root paths exactly one trailing slash.
2. Compare the canonical incoming pathname with canonical `NOINDEX_PATHS`
   entries inside `isNoindexPath`; retain the existing shared layout and
   sitemap consumers.
3. Keep the final production exclusion list empty.

## Files expected to change

- `src/lib/seo.ts`
- `docs/plan/issues/186_normalize_noindex_paths.md`

No page content, route inventory, sitemap integration, crawler policy,
dependency, workflow, deployment, or issue closure is in scope.

## Validation

- Run `npm ci` as the only prerequisite; no local service is required.
- Before implementation, temporarily set `NOINDEX_PATHS` to `["/about"]`, run
  `npm run build`, and confirm the original failure: `/about/` remains in the
  sitemap and its HTML has no `robots` meta tag. Restore the source afterward.
- After implementation, use production-build probes to prove `/about` and
  `/about/` each emit `noindex, follow` and each exclude only `/about/` from the
  sitemap. Probe `/` separately and prove it is excluded while the other five
  routes remain indexable. Restore the empty list after every probe.
- Run `npm run check` and a final `npm run build`. Assert that the sitemap has
  exactly the six expected absolute routes and all six HTML pages omit robots
  metadata.
- Run `npm audit --omit=dev`, `git diff --check`, and the complete staged
  `pre-commit run --all-files` workflow.

## Risks and research validation

This is a low-risk, local SEO predicate change with no runtime service,
authorization, networking, dependency, or deployment effect. Canonicalization
is limited to trailing slashes; it does not reinterpret leading slashes, URL
encoding, query strings, or hosts. `isNoindexPath` receives pathnames from both
callers, and `shouldIncludeInSitemap` already extracts a pathname from the full
URL before calling it.

The analogous-pattern sweep covered all `pathname`, route-list, and
`includes(...)` uses under `src/` plus `astro.config.mjs`. Only
`NOINDEX_PATHS.includes(pathname)` has this failure shape. `NON_PAGE_PATHS`
matches the fixed endpoint `/fixtures.ics`, and header prefix matching is
intentionally different navigation behavior.

Approved after one research-review iteration. The plan covers every issue item,
uses the existing shared predicate rather than changing callers, and tests the
original failure plus both corrected spellings and the root edge case through
real production builds. No repository test runner exists; generated HTML and
sitemap assertions are the narrowest authoritative regression evidence.

## Implementation validation

- `npm ci` installed 267 locked packages and reported zero vulnerabilities.
- The pre-change `/about` build probe reproduced the silent failure: the page
  emitted no robots metadata and remained in the sitemap.
- After the fix, independent production builds for `/about` and `/about/` each
  emitted `noindex, follow`, excluded `/about/`, and retained five sitemap
  routes. The `/` probe emitted the same metadata on the homepage, excluded
  only the root URL, and retained the other five routes.
- The production list was restored to empty. `npm run check` passed 23 files
  with zero diagnostics; the final `npm run build` generated six pages and the
  sitemap. Exact-set assertions found all six expected sitemap URLs and no
  robots meta tag in any generated page.
- `npm audit --omit=dev` and `git diff --check` passed.

## Branch review

**Classification:** Code-relevant, low-risk local SEO pathname matching.

- The planned and actual path sets match exactly: `src/lib/seo.ts` and this
  plan.
- `differential-review` is unavailable in this session. The manual fallback
  inspected the complete diff, both production consumers, generated HTML and
  sitemap behavior, root handling, repeated trailing-slash behavior, and every
  analogous pathname/list comparison in `src/` and `astro.config.mjs`.
- `NON_PAGE_PATHS` is a fixed endpoint comparison and Header matching is
  intentionally prefix-based navigation behavior; neither shares the defect.
- This Markdown file contains no executable shell fences. Review found no
  blocking issue and no non-blocking follow-up idea.

## Issue traceability

| Issue item | Disposition | Timing / owner / prerequisite | Evidence | Result |
| --- | --- | --- | --- | --- |
| `/about` and `/about/` behave identically | Implement and validate | Pre-merge / Codex / successful builds | Both probes add metadata and remove only `/about/` from the sitemap | Pass |
| Root `/` behaves correctly when listed | Implement and validate | Pre-merge / Codex / successful build | Root metadata present, root sitemap URL absent, five other routes retained | Pass |
| Prefer normalization over documentation-only fix | Implement in this PR | Pre-merge / Codex / source review | Shared canonical comparison in `isNoindexPath` | Pass |
| Preserve shared layout/sitemap invariant from #175 | Validate without caller changes | Pre-merge / Codex / generated outputs | Each exclusion changes generated HTML and sitemap together | Pass |
| Build, Astro check, and hooks pass | Validate in this PR | Pre-merge / Codex / installed dependencies | Commands exit zero on final staged content | Pass |
| Empty list retains six indexable routes and no robots metadata | Validate final restored state | Pre-merge / Codex / final build | Exact six-route sitemap set and all generated HTML inspected | Pass |
| Related `src/lib/seo.ts` and `BaseLayout.astro` paths | Implement shared helper; validate existing caller | Pre-merge / Codex / diff review | Diff plus consumer and generated-output review | Pass |
| Merge, deploy, issue closure, or worktree cleanup | Intentionally out of scope | User/operator | No such operation performed | Not performed |
