---
status: Complete
issue: 190
issue_url: https://github.com/denhamparry/squirrelsteam/issues/190
branch: denhamparry.co.uk/fix/gh-issue-190
deploy: no
---

# Plan: Reject malformed noindex routes

## Problem and outcome

`NOINDEX_PATHS` is normalized before matching but is not validated. An empty
string or `//` therefore normalizes to `/` and silently removes the homepage
from search indexing and the sitemap, while an entry without a leading slash
silently matches nothing. Validate the configuration when `src/lib/seo.ts` is
loaded so malformed entries stop Astro checks and builds with an error that
names the offending value. Keep the production list empty and preserve the
valid root and trailing-slash-optional route forms introduced by issue #186.

Issue #190 and its empty discussion were fetched at
2026-09-16T18:48:03+01:00. The failure evidence comes from the owner-authored
[verification comment on PR #189](https://github.com/denhamparry/squirrelsteam/pull/189#issuecomment-5696039316),
which records probes against the real helper after #186. Nothing is currently
affected because the production list is empty.

## Implementation

1. Add a private assertion in `src/lib/seo.ts` that requires every configured
   value to be a non-empty route beginning with exactly one `/`.
2. Run the assertion once at module load for every `NOINDEX_PATHS` entry and
   include the JSON-encoded offending value in a clear error.
3. Leave `normalizePagePath`, both existing consumers, and the final empty
   production list unchanged.

## Files expected to change

- `src/lib/seo.ts`
- `docs/plan/issues/190_validate_noindex_paths.md`

No route inventory, page content, crawler policy, sitemap integration,
dependency, workflow, deployment, issue closure, or live configuration is in
scope.

## Validation

- Run `npm ci` as the only prerequisite; no local service is required.
- Before implementation, use temporary copies of the real base helper to prove
  that `""` and `"//"` match `/` while `"about"` is a silent no-op.
- After implementation, temporarily set the production constant to each of
  `""`, whitespace, `"about"`, and `"//"`; require `npm run build` to exit
  non-zero with the JSON-encoded value in the validation error. Also require a
  representative malformed entry to fail `npm run check` at module load.
- Temporarily set the constant to `/`, `/about`, and `/about/` in separate
  production builds. Require each build to succeed; root must emit
  `noindex, follow` and leave the sitemap, while both about forms must emit the
  same metadata and remove only `/about/`.
- Restore the production list to empty, then run `npm run check` and
  `npm run build`. Assert an exact six-route sitemap and no robots metadata in
  any of the six generated pages.
- Run `npm audit --omit=dev`, `git diff --check`, targeted checks, and the final
  staged `pre-commit run --all-files` workflow.

## Risks and research validation

This is a low-risk, build-time configuration assertion. It performs no
networking, authorization, runtime service, dependency, or deployment change.
The accepted syntax is intentionally narrow: `/` is valid, a non-root route
may have or omit trailing slashes because the existing normalizer owns that
behavior, and the new guard only rejects an absent, empty, or repeated leading
slash. It does not reinterpret URL encoding, query strings, hosts, or trailing
slashes.

The analogous-pattern sweep covered route lists, pathname normalization, and
`includes(...)` uses under `src/` plus `astro.config.mjs`. Only
`NOINDEX_PATHS` accepts maintainer-edited page routes and passes them through
normalization. `NON_PAGE_PATHS` is a fixed internal file endpoint, while the
header's prefix matching is unrelated navigation behavior. Both existing
noindex consumers already share this module, so module-load validation covers
the layout and sitemap without caller changes.

The repository has no test runner or SEO fixture wrapper. Temporary real-build
configuration probes and generated HTML/sitemap assertions are the narrowest
authoritative evidence. The first repository-inspection command exited 1 only
because zsh found no `.yaml` workflow match after reading the source; a safe
`rg --files` rerun inspected every actual `.yml` workflow. This was a harness
setup failure, not product evidence.

Approved after one research-review iteration. The base helper probe reproduced
all three reported failure shapes, the proposed leading-slash assertion
accepts every valid form named by the issue, and module-load placement covers
both consumers without duplicating validation. The plan keeps normalization
and the final route list unchanged and uses real Astro builds for the complete
invalid/valid matrix.

## Implementation validation

- `npm ci` installed 267 locked packages and reported zero vulnerabilities.
- Temporary copies of the unmodified base helper reproduced the issue:
  `""` and `"//"` matched `/`, while `"about"` did not match `/about/`.
- Real Astro builds with `""`, whitespace, `"about"`, and `"//"` each exited
  1 while loading the shared configuration and named the JSON-encoded value in
  `Invalid NOINDEX_PATHS entry ...`. The empty entry also made
  `npm run check` exit 1 with the same error.
- Separate successful builds proved `/` noindexed and removed only the
  homepage, while `/about` and `/about/` each noindexed and removed only the
  about page. Every other generated page remained indexable in each case.
- The list was restored to empty. `npm run check` passed 23 files with zero
  diagnostics; `npm run build` generated all six pages; the sitemap contained
  exactly the six expected absolute routes; and no generated page contained a
  robots meta tag.
- `npm audit --omit=dev` found zero vulnerabilities and `git diff --check`
  passed. All nine pre-commit hooks passed across the repository.
- One base-probe orchestration attempt failed before launching its shell
  command because nested template syntax was not escaped; the corrected
  unchanged probe passed. The first root-output assertion exited 1 because it
  expected a self-closing meta tag while Astro emitted `<meta ...>`; inspecting
  the output confirmed the correct tag, and the corrected matcher passed the
  same built artifact. Both were harness failures, not behavior failures.
- Targeted pre-commit initially rejected a wrapped line beginning with `#186`
  as malformed heading syntax. Rewording it to `issue #186` fixed the plan;
  the targeted rerun and repository-wide hook run passed.

## Branch review

**Classification:** code-relevant, low-risk build-time SEO configuration
validation.

- The planned and actual path sets match: `src/lib/seo.ts` and this plan.
- `differential-review` and specialist Trail of Bits skills are unavailable in
  this session. The manual fallback inspected the complete diff, both
  consumers, every route-list/pathname comparison, the malformed failure
  matrix, and generated HTML and sitemap behavior for every valid case.
- `normalizePagePath` and both consumers are unchanged. `NON_PAGE_PATHS` is a
  fixed internal endpoint comparison; header prefix matching is unrelated
  navigation behavior. No analogous defect remains in the repository.
- This Markdown file contains no executable shell fence. Review found no
  blocking issue and no non-blocking follow-up idea.

## Issue traceability

| Issue item | Disposition | Timing / owner / prerequisite | Evidence target | Current result |
| --- | --- | --- | --- | --- |
| Empty entry fails build and names `""` | Implement and validate | Pre-merge / Codex / installed dependencies | Non-zero production build and captured error | Passed: build and check exit 1 |
| `"about"` fails the same way | Implement and validate | Pre-merge / Codex / installed dependencies | Non-zero production build and captured error | Passed: build exits 1 |
| `"//"` fails the same way | Implement and validate | Pre-merge / Codex / installed dependencies | Non-zero production build and captured error | Passed: build exits 1 |
| Whitespace-only entry is rejected | Implement and validate | Pre-merge / Codex / installed dependencies | Non-zero production build and captured error | Passed: build exits 1 |
| `/`, `/about`, and `/about/` remain valid | Validate without changing final configuration | Pre-merge / Codex / successful builds | Generated metadata and sitemap sets | Passed in three builds |
| Preserve #186 trailing-slash behavior | Validate existing helper unchanged | Pre-merge / Codex | Equivalent `/about` and `/about/` builds | Passed |
| Shared layout and sitemap consumers fail together | Implement at module load | Pre-merge / Codex | Check/build import the shared helper | Passed |
| Empty list retains six sitemap routes and no robots metadata | Validate final restored state | Pre-merge / Codex / successful build | Exact generated-output assertions | Passed |
| Build, Astro check, and hooks pass | Validate in this PR | Pre-merge / Codex / installed dependencies | Final commands exit zero | Passed |
| Related SEO/layout/config paths | Change shared helper; validate callers | Pre-merge / Codex | Diff and generated-output review | Passed without caller changes |
| Production list remains empty | Preserve and verify | Pre-merge / Codex | Final source and build | Passed |
| Merge, deploy, issue closure, or cleanup | Intentionally out of scope | User/operator | No such operation | Not performed |
