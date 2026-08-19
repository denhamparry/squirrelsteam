---
status: In Progress
issue: 110
issue_url: https://github.com/denhamparry/squirrelsteam/issues/110
branch: denhamparry.co.uk/docs/gh-issue-110
deploy: no
---

# Plan: Fix contributor navigation references

## Problem

Contributor-facing navigation describes resources that this repository does not
provide. `CONTRIBUTING.md` links to a missing `CODE_OF_CONDUCT.md` and sends
questions to disabled GitHub Discussions, while the issue-template configuration
contains a literal `[OWNER]/[REPO]` Discussions URL. New contributors therefore
encounter a missing file, a disabled feature, or an unresolved template URL.

## Acceptance criteria

- [x] `CONTRIBUTING.md` contains no link to a file that does not exist in the
      repository.
- [x] No live repository instruction outside `docs/plan/` points contributors
      to GitHub Discussions while Discussions are disabled.
- [x] `.github/ISSUE_TEMPLATE/config.yml` contains no `[OWNER]/[REPO]`
      placeholder.
- [x] Pre-commit hooks pass on the exact changed-file set.

## Implementation steps

1. Remove the unsupported Code of Conduct section from `CONTRIBUTING.md`
   instead of claiming a policy document that does not exist.
2. Replace the disabled Discussions guidance with the repository's existing
   GitHub-issue and `contact@squirrels.team` channels.
3. Remove the unusable Discussions contact link from the issue-template
   configuration while keeping blank issues enabled.
4. Validate contributor links, the stale-navigation search invariant, YAML,
   Markdown, the repository build, and the exact staged path set.
5. After the PR exists, independently map the live issue to the fetched PR diff
   and fresh validation evidence.

## Files expected to change

- `CONTRIBUTING.md`
- `.github/ISSUE_TEMPLATE/config.yml`
- `docs/plan/issues/110_fix_contributor_navigation.md`

No Code of Conduct is added, GitHub Discussions remains disabled, and source,
dependencies, workflows, deployment configuration, and other contributor
templates are expected to remain unchanged.

## Validation

- Failure-shaped baseline: confirm `CODE_OF_CONDUCT.md` does not exist, the
  repository reports `hasDiscussionsEnabled: false`, and a hidden-inclusive
  search outside `docs/plan/` finds the three stale contributor-navigation
  references named by the issue.
- Re-run the hidden-inclusive search for Code of Conduct, Discussions URLs or
  guidance, and `[OWNER]/[REPO]`; require no live instruction match outside
  historical plans.
- Extract every Markdown link target from `CONTRIBUTING.md`; require every
  repository-relative target to exist and every external target to be a valid
  absolute URL.
- Parse `.github/ISSUE_TEMPLATE/config.yml` through the repository's YAML hook
  and confirm blank issues remain enabled without a contact link.
- Inspect every Bash or shell fence in `CONTRIBUTING.md` and validate the
  complete fence contents with `bash -n` and ShellCheck when available.
- Run `npm ci`, `npm run check`, `npm run build`, `npm audit --omit=dev`, and
  `git diff --check`.
- Run repository pre-commit hooks against the exact staged path set.

## Risks and open questions

- Adding a policy document or enabling Discussions would introduce governance
  and repository-setting choices beyond the requested navigation repair. The
  issue explicitly permits removing and repointing the stale references, so
  the narrow documentation-only direction is preferred.
- GitHub issues are already the documented path for bugs and enhancements, and
  `contact@squirrels.team` is the repository's established contact address.
- Removing the sole `contact_links` entry leaves blank issues enabled and avoids
  replacing one misleading destination with an invented support page.
- No follow-up issues, deploy, merge, or manual issue closure were requested.
  The workflow stops with one open PR closing issue #110.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Missing `CODE_OF_CONDUCT.md` linked from `CONTRIBUTING.md:7` | Implement in this PR | Remove the unsupported section and validate all remaining relative links |
| Questions guidance points to disabled Discussions | Implement in this PR | Replace it with existing issues and contact email guidance |
| Issue-template contact link retains `[OWNER]/[REPO]` | Implement in this PR | Remove the unusable contact link and validate YAML |
| No contributor instruction outside historical plans points to disabled Discussions | Validate in this PR | Hidden-inclusive full-repository negative search |
| Pre-commit hooks pass on changed files | Validate in this PR | Exact staged-set hook run |
| Add a Contributor Covenant Code of Conduct | Intentionally out of scope | Avoid inventing governance policy as part of a navigation fix |
| Enable GitHub Discussions and use the real repository URL | Intentionally out of scope | Preserve live repository settings; use existing communication channels |
| Rewrite questions to GitHub issues or `contact@squirrels.team` | Implement in this PR | Updated `Questions?` section |
| Drop or repoint the Discussions contact link | Implement the drop variant | Configuration retains only `blank_issues_enabled: true` |
| PR #109 and issue #99 provenance | Validate without a change | Live records confirm the follow-up source and merged predecessor |
| Issues #82 and #91 establish the earlier drift class | Validate without a change | Both referenced issues are closed; no change belongs in this PR |
| Generic "community discussions" checklist in `docs/setup.md` | Not applicable | It names no GitHub Discussions feature or destination and is not contributor navigation to the disabled feature |
| Source, dependencies, CI, deployment, and other templates | Intentionally out of scope | Exact changed-file gate excludes these paths |

## Research validation

**Overall assessment:** Approved after one review iteration.

- Issue #110 was freshly fetched on 2026-08-19 and remains open. Its context,
  three affected references, two suggested solution directions, acceptance
  criteria, and references are all represented in Issue traceability.
- The original failure is deterministic and non-mutating:
  `CODE_OF_CONDUCT.md` is absent, GitHub reports Discussions disabled, and the
  hidden-inclusive repository search finds the missing-file claim plus the two
  Discussions destinations named by the issue.
- The narrow remove-and-repoint direction is supported by current repository
  behavior: issues already accept questions through blank issues, while
  `contact@squirrels.team` is established in `CLAUDE.md`, `README.md`, and the
  site documentation. Adding governance policy or changing a live GitHub
  setting is unnecessary for the acceptance criteria.
- The analogous stale-navigation sweep covered all hidden and visible files
  outside historical plans. The exact Code of Conduct, GitHub Discussions, URL,
  and placeholder patterns occur only in the two issue-named files. A generic
  `docs/setup.md` checklist item says "community discussions" but names no
  GitHub feature or destination, so it does not point contributors to disabled
  GitHub Discussions.
- PR #109 is merged, issue #99 auto-closed, and the referenced earlier drift
  issues #82 and #91 are closed. They establish provenance but require no
  additional implementation.
- The expected three-file documentation/configuration scope is sufficient.
  Validation covers the original broken state, every remaining contributor
  link, the corrected negative search, executable Markdown fences, YAML syntax,
  project checks, and exact-file hooks.

## Implementation validation

Phase 3.5 found exactly the three planned paths. Source, dependencies,
workflows, deployment configuration, and other contributor templates remain
unchanged.

- The deterministic baseline was confirmed before implementation:
  `CODE_OF_CONDUCT.md` did not exist, GitHub reported Discussions disabled, and
  the hidden-inclusive search returned the three stale navigation references
  named by the issue.
- After implementation, the same hidden-inclusive search for the missing
  policy claim, GitHub Discussions guidance or URL, and `[OWNER]/[REPO]`
  returned no live match outside `docs/plan/`.
- Complete-file link validation found one remaining Markdown link in
  `CONTRIBUTING.md`, `https://pre-commit.com/`, and validated it as an absolute
  HTTPS destination. There is no remaining repository-relative link that can
  point to a missing file.
- `CONTRIBUTING.md` now routes questions to GitHub issues and the established
  `contact@squirrels.team` address. The issue-template configuration retains
  `blank_issues_enabled: true` and removes the unusable external contact link.
  This matches the documented GitHub template-chooser behavior:
  <https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository>.
- All three complete Bash fences in `CONTRIBUTING.md` passed `bash -n` and
  ShellCheck without placeholder normalization. The other changed Markdown
  file contains no executable shell fence.
- `npm ci` installed 267 packages and reported zero vulnerabilities. It emitted
  the existing environment-level allow-scripts advisory for `esbuild` and
  `fsevents` but no install failure or tracked-file change.
- `npm run check` passed across 19 files with zero errors, warnings, or hints.
- `npm run build` passed and generated six pages plus `fixtures.ics`.
- `npm audit --omit=dev`, `git diff --check`, YAML syntax validation, and every
  repository pre-commit hook passed against the exact three-path staged set.

## Branch review

**Classification:** Code-relevant behavior-changing contributor instructions
and issue-template configuration.

**Review iteration 1:** Approved with no blocking or non-blocking finding.

- The live issue was re-fetched on 2026-08-19 and remains open and unchanged.
  Its full context, affected paths, solution alternatives, criteria, and
  references remain represented in Issue traceability.
- `differential-review` and matching Trail of Bits review skills are unavailable
  in this Codex session. The concrete manual fallback inspected the complete
  diff and files, all contributor link targets, GitHub template-chooser
  semantics, communication-channel consistency, executable fences, YAML
  validity, repository settings, and negative file scope.
- GitHub still reports Discussions disabled. The revised instructions use only
  already-supported issue and email channels, and the configuration preserves
  blank issue creation without inventing a replacement external destination.
- The final analogous stale-navigation sweep covered all hidden and visible
  repository files outside historical plans. No missing Code of Conduct claim,
  GitHub Discussions destination, Discussions URL, or `[OWNER]/[REPO]`
  placeholder remains. The generic `docs/setup.md` community checklist item is
  intentionally different because it names no GitHub feature or destination.
- Failure, success, and negative-scope evidence pass: the original three broken
  references were reproduced; corrected searches, links, YAML, project checks,
  and hooks pass; and no source, package, workflow, deploy, or repository-setting
  change was introduced.
- Phase 4.5 produced no follow-up idea, so no additional issue or PR-body item
  is needed.

## Post-PR verification

Pending PR creation.
