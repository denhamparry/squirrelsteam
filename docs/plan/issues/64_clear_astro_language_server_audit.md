---
status: Complete
issue: 64
issue_url: https://github.com/denhamparry/squirrelsteam/issues/64
branch: denhamparry.co.uk/fix/gh-issue-064
---

# Plan: Clear Astro language-server audit findings

## Problem

The lockfile resolves `@astrojs/check` 0.9.9 to
`@astrojs/language-server` 2.16.10. That language-server release pins
`volar-service-yaml` 0.0.70 and `yaml-language-server` 1.20.0, which leave
`yaml` 2.7.1 and `fast-uri` 3.1.4 in advisory ranges. A full `npm audit`
therefore reports five development-only findings (four moderate and one high),
making the audit noisy even though `npm audit --omit=dev` is clean.

## Acceptance criteria

- [x] `npm audit` reports zero vulnerabilities, or any remaining unfixable
      advisory is documented.
- [x] `npm run check` passes after the dependency update.
- [x] `npm run build` passes after the dependency update.

## Implementation steps

1. Raise the direct `@astrojs/check` development dependency to the current
   compatible 0.9.10 release so a clean install is required to resolve the
   repaired language-server chain.
2. Regenerate `package-lock.json` from the updated manifest, without forcing a
   major Astro or TypeScript upgrade.
3. Confirm the resolved chain contains `@astrojs/language-server` 2.16.11 or
   newer, `volar-service-yaml` 0.0.71 or newer, `yaml` 2.8.3 or newer, and
   `fast-uri` 3.1.5 or newer.
4. Install strictly from the resulting lockfile and run the audit, type-check,
   build, diff, and repository hook validation.

## Files expected to change

- `docs/plan/issues/64_clear_astro_language_server_audit.md`
- `package.json`
- `package-lock.json`

## Validation

- Record the failure-shaped baseline from the original lockfile: `npm audit`
  reports five vulnerabilities (four moderate, one high), while
  `npm audit --omit=dev` reports zero production vulnerabilities.
- Run `npm ci` to verify the committed lockfile reproduces a clean install.
- Run `npm audit` and require zero vulnerabilities.
- Run `npm audit --omit=dev` and require zero production vulnerabilities.
- Run `npm ls astro @astrojs/check @astrojs/language-server volar-service-yaml yaml yaml-language-server fast-uri --all` and inspect the resolved versions.
- Run `npm run check`.
- Run `npm run build`.
- Run `git diff --check`.
- Run the repository pre-commit hooks against the exact staged path set before
  committing.

## Risks and open questions

- Dependency resolution may update additional transitive packages within
  existing semver ranges. Review every lockfile delta for registry provenance,
  integrity metadata, lifecycle scripts, and unrelated major-version movement.
- `@astrojs/check` 0.9.10 accepts the repository's TypeScript 5 dependency and
  keeps the same CLI surface, so no source change is expected.
- The vulnerable packages are development-only. Production behavior should be
  unchanged, but type-check and build validation remain required.
- No deploy is requested. The workflow stops with an open PR.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Five findings rooted in the Astro language-server chain | Implement in this PR | Updated manifest/lockfile and clean full audit |
| `fast-uri` host-confusion advisory | Implement in this PR | Resolved `fast-uri` is outside 3.0.0–3.1.4 |
| `yaml` deeply nested collection advisory | Implement in this PR | Language-server-local `yaml` is 2.8.3 or newer |
| `yaml-language-server`, `volar-service-yaml`, and `@astrojs/language-server` transitive findings | Implement in this PR | Repaired resolved dependency chain and clean audit |
| Production dependencies already audit clean | Validate without a source change | `npm audit --omit=dev` remains at zero |
| Suggested Astro/check update or clean `npm audit fix` | Implement the smallest compatible option | Direct `@astrojs/check` bump makes the safe language-server resolution reproducible |
| `npm run check` and `npm run build` | Validate in this PR | Both commands pass from a clean install |
| PR #61 and issue #60 provenance | Validated without a change | They identify this as a pre-existing, non-blocking follow-up |
| Deployment | Intentionally out of scope | No deploy flag or plan metadata |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The failure-shaped baseline reproduced the issue exactly on 2026-08-05:
  five development-only audit findings (four moderate, one high) and zero
  production findings.
- The vulnerable chain occurs only in `package-lock.json` beneath the direct
  `@astrojs/check` development dependency. The analogous-pattern sweep used
  `rg -n 'fast-uri|yaml-language-server|volar-service-yaml|@astrojs/language-server|@astrojs/check' package-lock.json package.json` and found no second manifest or independently managed copy requiring a separate fix.
- Registry metadata confirms `@astrojs/check` 0.9.10 supports TypeScript 5 and
  resolves `@astrojs/language-server` from `^2.16.7`. Language server 2.16.11
  moves the Volar services to 0.0.71; that service moves
  `yaml-language-server` to the repaired 1.23.x line with `yaml` 2.8.3.
- Raising the direct check-tool minimum is more reproducible than relying on a
  one-off transitive lockfile edit and avoids an unnecessary Astro major
  upgrade.
- Validation covers the original failure, the corrected full-audit success,
  the already-clean production-only negative/control path, and both repository
  build gates.

## Branch review

**Classification:** Code-relevant dependency manifest and lockfile changes.

**Review iteration 1:** Approved with no blocking findings.

- The live issue was re-fetched on 2026-08-05 and every context, advisory,
  proposed-solution, validation, and scope statement remains represented in
  Issue traceability.
- Phase 3.5 found exactly the three expected paths: the manifest, lockfile, and
  this plan. No unrelated path changed.
- `differential-review` and `supply-chain-risk-auditor` are not available in
  this Codex session. The manual fallback inspected the complete manifest and
  lockfile diff, direct and transitive version movement, resolved sources,
  integrity metadata, registry signatures, lifecycle-script declarations,
  Node engine compatibility, clean-install behavior, audit output, and the
  check/build entry points.
- The package count drops from 370 to 365 through updated CLI dependency
  deduplication. All resolved artifacts use `registry.npmjs.org`, all resolved
  packages have integrity hashes, and all 269 installed packages have verified
  registry signatures. The only install-script declarations remain the same
  pre-existing `esbuild` and optional `fsevents` entries.
- Production dependencies are unchanged. The broader `yargs` 18 CLI movement
  is development-only, originates in `@astrojs/check` 0.9.10, and requires
  Node `^20.19.0 || ^22.12.0 || >=23`, compatible with Astro's existing
  `>=22.12.0` requirement. Check and build both pass under Node 22.23.2.
- The repaired chain resolves `@astrojs/language-server` 2.16.13,
  `volar-service-yaml` 0.0.71, `yaml-language-server` 1.23.0, `yaml` 2.8.3,
  and `fast-uri` 3.1.5. Full and production-only audits both report zero.
- The final analogous-pattern sweep repeated the research query and found no
  second manifest or independent vulnerable chain. No adjacent occurrence
  needs a current fix or follow-up.
- The changed Markdown plan contains no Bash or shell fences, so executable
  fence validation is not applicable.
- Two optional Node 22 commands first used obsolete guessed Astro CLI paths
  (`node_modules/astro/astro.js` and `astro.js.mjs`) and failed before loading
  project code. The corrected `node_modules/astro/bin/astro.mjs` commands pass
  both check and build; the path errors do not indicate a product failure.

## Validation results

- Baseline `npm audit`: failed as expected with five development-only findings
  (four moderate, one high).
- Baseline `npm audit --omit=dev`: passed with zero vulnerabilities.
- `npm ci`: passed from the updated lockfile.
- `npm audit`: passed with zero vulnerabilities.
- `npm audit --omit=dev`: passed with zero vulnerabilities.
- `npm audit signatures`: passed for all 269 installed packages; 77 also have
  verified attestations.
- Resolved dependency-tree inspection: passed with every named package outside
  the issue's vulnerable ranges.
- `npm run check`: passed with 19 files and zero diagnostics.
- `npm run build`: passed with six static pages.
- Node 22.23.2 direct Astro CLI check and build: passed.
- `git diff --check`: passed.

## Post-PR verification

**Implementation head reviewed:**
`d48a6defca98e402837374fead72af55a26bd9bf`

**Outcome:** Passed independently with no blocking or non-blocking finding.

The local commit, fetched remote branch, and GitHub PR head matched before the
review. The plan-only evidence commit created after this review is inspected
separately, and the final reviewed PR SHA is stored in the mutable PR body to
avoid a tracked-file/SHA loop.

| Criterion or issue statement | Independent evidence | Result |
| --- | --- | --- |
| Full audit reports no advisory | Fresh `npm ci` followed by `npm audit` reported zero vulnerabilities | Pass |
| Production audit stays clean | Fresh `npm audit --omit=dev` reported zero vulnerabilities | Pass |
| High `fast-uri` finding is removed | Exact lock assertion and `npm ls` resolved `fast-uri` 3.1.5 | Pass |
| Moderate YAML-chain findings are removed | Exact lock assertions resolved language server 2.16.13, Volar YAML 0.0.71, YAML server 1.23.0, and YAML 2.8.3 | Pass |
| No analogous vulnerable copy remains | Complete lockfile traversal found none of the issue's vulnerable package/version combinations | Pass |
| Type-check remains compatible | Fresh `npm run check` inspected 19 files with zero errors, warnings, or hints | Pass |
| Production build remains compatible | Fresh `npm run build` produced all six static pages | Pass |
| Dependency artifacts are attributable | `npm audit signatures` verified all 269 installed package signatures and 77 attestations | Pass |
| PR contains only the intended scope | GitHub PR diff lists only the plan, `package.json`, and `package-lock.json` | Pass |
| Required repository checks pass | `Assign PR to denhamparry` and `CI Placeholder` both completed successfully | Pass |
| Deployment remains out of scope | PR contains no deploy or runtime source change | Pass |
