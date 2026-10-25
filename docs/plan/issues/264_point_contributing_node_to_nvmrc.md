---
status: In Progress
issue: 264
issue_url: https://github.com/denhamparry/squirrelsteam/issues/264
branch: denhamparry.co.uk/docs/gh-issue-264
deploy: no
---

# Plan: Align contributor Node prerequisite with .nvmrc

Issue snapshot: 2026-10-25; issue #264 is open with no comments. The stale
prerequisite is in `CONTRIBUTING.md:56`; `README.md` and both workflows already
use `.nvmrc` (22.23.4).

## Change

Replace the contributor prerequisite with a relative link to `.nvmrc` and keep
the npm requirement. No command or application behavior changes.

Expected files: `CONTRIBUTING.md` and this plan.

## Issue traceability and acceptance

| Item | Disposition and timing | Evidence and result |
| --- | --- | --- |
| No `Node.js 22 or newer` in CONTRIBUTING or README | Implement in CONTRIBUTING; pre-merge | Focused `rg` found the old line before edit and no matches after; passed. |
| CONTRIBUTING prerequisite links to `.nvmrc` | Implement; pre-merge | Relative link resolves to the tracked file; passed. |
| `pre-commit run --all-files` passes | Validate; pre-merge | All hooks passed with both intended files staged. |
| Match README wording and retain npm note | Implement; pre-merge | Both docs point to `.nvmrc`; CONTRIBUTING retains npm; passed. |
| Optional `nvm use` or `fnm use` guidance | Intentionally out of scope | One source pointer suffices; manager-specific commands are unnecessary. |
| `docs/setup.md` generic Node installation checklist | Validated without change | It names no incorrect Node version. |
| Prior PR #263 and issue #262 context | Validated without change | `.nvmrc` is already on `main`; no new runtime change. |

## Validation and risk

- Capture the stale-string match as the failure-shaped baseline, then assert it
  disappears and the `.nvmrc` link resolves.
- Parse and syntax-check every Bash fence in the changed `CONTRIBUTING.md`; no
  fence command needs to run for this wording edit.
- Run `npm ci`, `npm run check`, `npm run build`, and the repository-required
  `pre-commit run --all-files`. These need Node and npm; no server or service is
  required. `pre-commit` may initialize local hook environments.
- Review the complete diff and analogous version guidance. The only risk is a
  broken relative link or another stale version instruction.

Local evidence: all three Bash fences passed `bash -n`; `npm ci`, `npm run
check`, `npm run build`, `npm audit --omit=dev`, `pre-commit run --all-files`,
and `git diff --check` passed. The manual branch review found no blocking
issue. GitHub CI on the eventual PR remains to be observed.
