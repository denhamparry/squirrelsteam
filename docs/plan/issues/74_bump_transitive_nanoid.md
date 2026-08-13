---
status: In Progress
issue: 74
issue_url: https://github.com/denhamparry/squirrelsteam/issues/74
branch: denhamparry.co.uk/fix/gh-issue-074
deploy: no
---

# Plan: Bump transitive nanoid to clear GHSA-2v37-7h3g-55p8

## Problem

The lockfile resolves PostCSS's compatible `nanoid` dependency to 3.3.16.
That release is affected by GHSA-2v37-7h3g-55p8, in which custom generators
can loop indefinitely when called with a size of zero. The site does not call
`nanoid` directly, so practical exposure is low, but the production dependency
audit reports one high-severity vulnerability.

## Acceptance criteria

- [x] `package-lock.json` resolves `nanoid` to 3.3.17 or newer.
- [x] `npm audit --omit=dev` reports no high-severity `nanoid` advisory.
- [x] `npm run check` and `npm run build` pass on the updated lockfile.

## Implementation steps

1. Use npm's targeted audit repair against the lockfile so the existing
   PostCSS semver range resolves to a non-vulnerable `nanoid` 3.x release
   without adding a direct dependency or broadening unrelated package scope.
2. Inspect the complete lockfile delta for version, registry source, integrity,
   engine, lifecycle-script, and unrelated dependency movement.
3. Install strictly from the updated lockfile and validate the resolved tree,
   production audit, type-check, and production build.
4. Run diff and exact-file repository pre-commit validation before committing.

## Files expected to change

- `docs/plan/issues/74_bump_transitive_nanoid.md`
- `package-lock.json`

`package.json` should remain unchanged because `nanoid` is owned transitively
by PostCSS and its existing range already accepts a repaired release.

## Validation

- Failure-shaped baseline: confirm the original lockfile resolves `nanoid`
  3.3.16 and `npm audit --omit=dev` reports GHSA-2v37-7h3g-55p8 as one high
  vulnerability.
- Run `npm ci` from the updated lockfile.
- Run `npm ls nanoid postcss vite astro --all` and assert `nanoid` is 3.3.17
  or newer while remaining within PostCSS's compatible 3.x range.
- Run `npm audit --omit=dev` and require zero high-severity `nanoid` findings.
- Run `npm run check`.
- Run `npm run build`.
- Run `git diff --check`.
- Run repository pre-commit hooks against the exact staged path set.

## Risks and open questions

- A broad lockfile refresh could move unrelated packages. The implementation
  must use a targeted repair and reject unrelated resolution churn.
- Adding `nanoid` as a direct dependency would misrepresent ownership and is
  unnecessary while PostCSS's declared range accepts the safe version.
- The advisory describes a direct API misuse that this project does not make;
  validation therefore uses the deterministic audit failure rather than an
  artificial runtime call to a transitive build dependency.
- No deployment is requested. The workflow stops with an open PR.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Lockfile resolves `nanoid` 3.3.16 through Astro/Vite/PostCSS | Implement in this PR | Targeted `package-lock.json` delta and resolved dependency tree |
| Custom-generator size-zero loop in GHSA-2v37-7h3g-55p8 | Validate without a runtime source change | Baseline audit failure and repaired production audit |
| Project never calls `nanoid` directly; practical exposure is low | Validate without a source change | Repository search and dependency-tree inspection |
| Resolve `nanoid` to 3.3.17 or newer | Implement in this PR | Exact lockfile assertion and `npm ls` |
| Use Dependabot or targeted npm repair | Implement the targeted npm option | Minimal lockfile-only update without waiting for another PR |
| `npm audit --omit=dev` clears the high advisory | Validate in this PR | Fresh production audit after `npm ci` |
| `npm run check` and `npm run build` remain compatible | Validate in this PR | Both repository gates pass from the updated lockfile |
| PR #72 and issue #71 provenance | Validated without a change | They identify this pre-existing finding and dedicated follow-up scope |
| Direct dependency or application-code changes | Intentionally out of scope | `package.json` and `src/` remain unchanged |
| Deployment | Intentionally out of scope | `deploy: no` and open-PR handoff |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The failure-shaped baseline reproduced the issue on 2026-08-13: the clean
  install resolves `astro` 7.1.0 to Vite 8.1.2, PostCSS 8.5.25, and `nanoid`
  3.3.16; `npm audit --omit=dev` reports only GHSA-2v37-7h3g-55p8 as one high
  vulnerability.
- The analogous-pattern sweep used
  `find . -name package.json -o -name package-lock.json`, a repository search
  for `nanoid` calls and imports, and lockfile dependency inspection. It found
  one root manifest/lockfile, one transitive resolution, and no application
  call site. No adjacent occurrence requires a current fix or follow-up.
- PostCSS 8.5.25 declares `nanoid: ^3.3.16`, which accepts both repaired 3.3.17
  and 3.3.18 releases. Registry metadata shows those releases retain the
  current Node engine range, use the npm registry with integrity metadata, and
  declare no lifecycle script. A direct dependency is unnecessary.
- A targeted npm lockfile repair is the smallest reproducible change. The
  implementation must reject manifest edits, a major `nanoid` change, or
  unrelated lockfile churn.
- Validation covers the original audit failure, the corrected audit success,
  exact dependency-tree ownership and version, a clean lockfile install, and
  both repository build gates. Direct size-zero reproduction is intentionally
  omitted because the project does not invoke this transitive API.

## Implementation validation

- The targeted `npm audit fix --package-lock-only` changed only the `nanoid`
  lockfile entry: 3.3.16 moved to 3.3.18 with the matching npm registry URL and
  integrity hash. The PostCSS declaration remains `^3.3.16`; no manifest,
  application source, dependency count, engine, license, or lifecycle-script
  field changed.
- `npm ci` passed with 269 installed packages and a clean audit.
- `npm audit --omit=dev` and the full `npm audit` both passed with zero
  vulnerabilities.
- `npm audit signatures` verified registry signatures for all 269 installed
  packages and attestations for 77 packages.
- `npm ls nanoid postcss vite astro --all` confirmed the single chain is Astro
  7.1.0 → Vite 8.1.2 → PostCSS 8.5.25 → `nanoid` 3.3.18.
- Exact lockfile assertions confirmed the repaired version, PostCSS range,
  registry source, integrity metadata, and absence of `nanoid` lifecycle
  scripts.
- `npm run check` passed with 19 files and zero diagnostics.
- `npm run build` passed and generated all six static pages plus the calendar
  feed.
- `git diff --check` passed.
- Repository pre-commit hooks passed against the exact two-file staged set,
  including Markdown lint and gitleaks.

## Branch review

**Classification:** Code-relevant dependency lockfile change because the
resolved package is part of the production Astro/Vite/PostCSS build chain.

**Review iteration 1:** Approved with no blocking or non-blocking finding.

- The live issue was re-fetched on 2026-08-13 and remains open and unchanged.
  Every context statement, affected path, failure detail, recommendation,
  acceptance criterion, reference, and explicit scope boundary remains covered
  by Issue traceability.
- Phase 3.5 found exactly the two expected paths: this plan and
  `package-lock.json`. `package.json`, `src/`, workflows, and all other
  dependency resolutions are unchanged.
- `differential-review` and `supply-chain-risk-auditor` are unavailable in this
  Codex session. The manual fallback inspected the complete repository diff,
  the PostCSS owner range, the installed dependency tree, both package
  versions' registry metadata, the upstream package diff, registry signatures,
  integrity hashes, engine and license compatibility, lifecycle scripts, audit
  output, and repository check/build entry points.
- The lockfile delta is limited to `nanoid` version, tarball URL, and integrity
  hash. Both releases are MIT-licensed, retain the same Node engine range, and
  declare no lifecycle scripts. The new artifact comes from
  `registry.npmjs.org`, has the registry-published integrity hash, and its
  installed registry signature verifies.
- The upstream 3.3.16-to-3.3.18 package diff adds an immediate empty result for
  non-positive generator sizes across the CommonJS, ESM, browser, native, and
  asynchronous entry points. This directly repairs the advisory shape without
  unrelated package metadata or runtime-contract movement.
- The final analogous-pattern sweep again found one root package manifest and
  lockfile, one transitive `nanoid` copy, and no application import or call.
  No adjacent occurrence belongs in this fix or a follow-up.
- Failure, success, and negative/control evidence all pass: the baseline audit
  detected 3.3.16; the updated production and full audits are clean; the
  dependency remains transitive under PostCSS; no direct dependency, install
  script, source change, or build regression was introduced.
- The changed plan contains no Bash or shell fence, so executable-fence
  validation is not applicable.
