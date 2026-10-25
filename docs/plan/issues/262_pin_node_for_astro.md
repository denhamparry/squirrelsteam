---
status: In Progress
issue: 262
issue_url: https://github.com/denhamparry/squirrelsteam/issues/262
branch: denhamparry.co.uk/fix/gh-issue-262
deploy: no
---

# Plan: Pin a supported Node version for CI and Pages builds

Issue snapshot: 2026-10-25; issue #262 was open with no comments. Dependabot PR
PR #260 was open and its required check failed at `astro check`. `origin/main` uses
Node `22` in both workflows and locks Astro 7.4.0.

## Problem and approach

Astro 7.4.2 requires Node >=22.23.4, while both workflows select a cached 22.x
runtime that can be older. Put exact `22.23.4` in `.nvmrc`. Have `setup-node`
read that file in CI. The pinned `withastro/action` accepts `node-version` but
no version-file input, so the deploy job will read `.nvmrc` into a step output
and pass that output to the action. No dependency or credential change is needed.

## Files expected to change

- `.nvmrc`: the single exact Node version.
- `.github/workflows/ci.yml`: use `node-version-file` and show `node --version`.
- `.github/workflows/deploy.yml`: read `.nvmrc` for the action input and show
  the selected Node version after the action's build.
- `README.md`: direct local development to the same Node version.
- This plan.

## Issue traceability and acceptance

| Issue item | Disposition and timing | Owner, prerequisite, evidence, current result |
| --- | --- | --- |
| CI installs Node >=22.23.4, shown in setup log | Implement; pre-merge | Repository CI; PR run and setup log; pending. |
| Deploy builds with same Node as CI | Implement; post-merge | Pages workflow owner; first post-merge deploy build log; pending. |
| PR #260, rebased on fix, passes `npm run check` and `npm run build` | External validation; post-merge | Dependabot PR owner; rebase #260 after this fix merges, then its CI run; pending. |
| Version defined in one place and referenced or matched by both workflows | Implement; pre-merge | This PR; `.nvmrc` and workflow inspection; passed. |
| Exact `.nvmrc` recommendation | Implement; pre-merge | This PR; file content and setup-node input; passed. |
| Local development version guidance | Implement; pre-merge | `README.md` points to `.nvmrc`; passed. |
| Optional `package.json` engines warning | Intentionally out of scope | Not needed for runtime selection; would change package metadata and lockfile. |
| `check-latest` and wait-for-runner alternatives | Not applicable | Exact version chosen for repeatable builds. |
| No permission or credential changes | Validate without change | Workflow diff; passed. |
| Related CI, deploy, `.nvmrc`, `package.json` | Disposition above | No other Node selectors found in `.github` or package metadata. |

## Validation and boundaries

- Confirm the baseline failure shape: Node `22.23.3` is lower than `22.23.4`,
  and major-only `22` in both original workflows can select it.
- Parse the YAML, assert CI uses `.nvmrc`, and resolve the deploy step output
  from the same file. Assert the selected version satisfies Astro's floor and
  the old `22.23.3` does not. Inspect exact pinned action inputs.
- Run `npm ci`, `npm run check`, and `npm run build` under an available supported
  local Node. These test the current main dependency set, not PR #260's merge.
- Run staged pre-commit hooks. CI has no path filter, so its check should run on
  this PR; deploy runs only after merge or manual dispatch. Do not dispatch or
  modify the Pages environment to validate this branch.
- Re-fetch #260 and the issue before handoff. Its post-merge CI and the deploy
  build remain operational acceptance; use `Refs #262` unless a linked owner
  takes those rows. Review the workflow diff for command injection or unsafe
  assumptions, then independently verify issue-to-PR evidence.

Local evidence: YAML parse, version wiring assertions including the rejected
`22.23.3` case, `npm ci`, `npm run check`, `npm run build`, and `git diff --check`
passed. These used local Node 24.14.0 and current main's Astro 7.4.0. An
independent read-only workflow review found no blocking issue; its README
guidance finding was corrected before handoff. The actual hosted runtime,
Dependabot PR #260, and Pages deploy results remain pending.
