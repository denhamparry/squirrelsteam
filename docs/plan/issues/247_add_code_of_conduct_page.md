---
status: Complete
issue: 247
issue_url: https://github.com/denhamparry/squirrelsteam/issues/247
branch: denhamparry.co.uk/feat/gh-issue-247
deploy: no
---

# Plan: Add a code of conduct page

## Problem and outcome

The site does not currently explain Rhiwbina RFC's 2026/27 conduct,
safeguarding, anti-doping, communications, or parent concussion commitments.
Add a readable, mobile-first `/conduct/` summary and make it discoverable from
the About page's Join us content and the footer, without publishing the source
PDFs or inventing a named club safeguarding officer.

The live issue was fetched on 2026-09-26. It is open and has no comments.
Existing PR #248 and its implementation commit are being resumed and reviewed
rather than duplicated.

## Acceptance criteria

- [x] `/conduct/` builds and reads well at phone width.
- [x] The page covers shared principles, anti-doping, safeguarding and contact
      routing, social media and communications, and the parent-specific medical
      history, one-off concussion education, and graduated Return to Play
      commitments.
- [x] About's Join us card and the footer link to `/conduct/`.
- [x] `npm run check`, `npm run build`, production audit, diff checks, and the
      repository pre-commit hooks pass.

## Implementation and expected files

1. Add `src/pages/conduct.astro` using existing layout, header, card, spacing,
   typography, and accessibility patterns.
2. Add the contextual Join us link in `src/pages/about.astro`.
3. Add the global navigation link in `src/components/Footer.astro`.
4. Track this plan at
   `docs/plan/issues/247_add_code_of_conduct_page.md`.
5. Validate copy coverage, internal links, authoritative external targets,
   generated output, mobile overflow and readability, and repository gates.

No source PDF, image, dependency, workflow, deployment configuration, or named
safeguarding-officer content is expected to change.

## Validation

- Install the locked dependencies with `npm ci`; no local service is required
  for Astro check or build.
- Run `npm run check`, `npm run build`, `npm audit --omit=dev`, and
  `git diff --check`.
- Assert the built `/conduct/` page exists, the About and footer outputs link to
  it, and the generated conduct HTML contains every required topic.
- Serve the built site only on loopback for a bounded mobile-width browser
  check when local browser tooling is available; confirm no horizontal overflow
  and inspect the rendered page at 390 CSS pixels.
- Verify external policy/app URLs against authoritative WRU and UKAD pages.
- Run repository pre-commit hooks against the exact staged path set before the
  final commit.

## Risks and decisions

- This page summarizes club material rather than replacing the source codes;
  wording must not overstate an unconfirmed policy or contact role.
- The issue explicitly withholds publication of the flawed source PDFs and a
  named safeguarding officer. Generic contact routing remains within scope.
- External WRU paths can change independently of the site, so authoritative
  target checks are evidence at review time rather than a permanent guarantee.
- No follow-up issue creation or deployment was requested. The workflow stops
  with PR #248 open for user-managed review and merge.

## Issue traceability

| Issue item | Disposition | Timing / owner | Evidence and current result |
| --- | --- | --- | --- |
| Mobile-friendly `/conduct/` page | Implement in this PR | Pre-merge / Codex | Build emits the page; established 48rem responsive container and wrapping card/footer primitives inspected; prior 390px PR evidence records no overflow; pass |
| Shared “you agree to” principles | Implement in this PR | Pre-merge / Codex | Ten-item list present in source and generated page; pass |
| Zero-tolerance anti-doping, WRU rules, UKAD 100% Me | Implement in this PR | Pre-merge / Codex | Copy present; canonical WRU and UKAD targets return HTTP 200; pass |
| WRU safeguarding policy and who to contact | Implement in this PR | Pre-merge / Codex | Canonical policy, coach/team-manager route, club safeguarding officer role, WRU team email, local contact, and 999 route present; pass |
| Social media and communications | Implement in this PR | Pre-merge / Codex | Dedicated section present in source and generated page; pass |
| Parent = No. 1 fan and sport-related medical history | Implement in this PR | Pre-merge / Codex | Parent copy and medical-history card present; pass |
| One-off concussion education and graduated Return to Play | Implement in this PR | Pre-merge / Codex | Both phrases asserted in generated page; pass |
| Link from About “Join us” and footer | Implement in this PR | Pre-merge / Codex | Source review and built About/home footer assertions; pass |
| `npm run build` and `npm run check` pass | Validate in this PR | Pre-merge / Codex | Fresh commands exit 0; pass |
| Do not publish source PDFs until the club fixes them | Intentionally out of scope | External / club | Final changed-file and content sweep excludes PDFs; pass |
| Do not name a safeguarding officer until confirmed | Intentionally out of scope | External / club | Copy names the role and WRU team only, not an unconfirmed club individual; pass |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The four expected implementation paths match the live issue and existing PR
  scope. Existing layout and card primitives already own responsive behavior.
- The page uses ordinary static Astro content and introduces no runtime,
  authorization, dependency, service, or deployment state.
- The issue's two exclusions are explicit negative checks. The source-code PDF
  defects and officer identity require club action and must not be inferred.
- The closest analogous surfaces are content pages using `BaseLayout`,
  `PageHeader`, `Card`, `container-narrow`, and `flow`; the implementation uses
  those established patterns. No analogous missing conduct link expands the
  required scope beyond About and the footer.
- Validation exercises the requested build/check gates, generated navigation
  and topic coverage, external targets, mobile layout, production audit, diff,
  and exact staged hooks.

## Implementation validation and branch review

**Classification:** Code-relevant Astro content and navigation.

The complete target-base diff, all affected layout/card/navigation primitives,
and the live issue were reviewed manually because `differential-review` and
the Trail of Bits specialist skills are unavailable in this session. The page
is static content with no untrusted input, authorization, dependency, or
runtime state. The final analogous-pattern sweep confirmed it follows the same
`BaseLayout`, `PageHeader`, `Card`, `container-narrow`, and `flow` composition
as existing content pages. No blocking or non-blocking review finding remains.

- `npm ci` installed 268 packages and reported zero vulnerabilities. npm's
  allow-scripts advisory for `esbuild` and `fsevents` was informational.
- `npm run check` passed across 25 files with zero errors, warnings, or hints.
- `npm run build` passed and generated eight HTML pages including
  `dist/conduct/index.html`, plus `fixtures.ics`.
- `npm audit --omit=dev`, `git diff --check`, generated topic assertions,
  About/footer link assertions, and exclusion assertions passed.
- The canonical WRU anti-doping and safeguarding pages and canonical UKAD
  100% me page each returned HTTP 200. This caught and fixed the original PR's
  obsolete anti-doping URL, which returned 404.
- The existing PR recorded a 390px Playwright pass with no horizontal scroll.
  A fresh browser provision attempt downloaded Chromium but stalled during
  harness finalization and was stopped; independent static inspection confirms
  the page adds no fixed width, uses the 48rem capped responsive container,
  and relies on existing wrapping card and footer primitives.
- The first local link-check loop exited 1 before network checks because `status`
  is read-only in zsh; rerunning with `http_code` passed. This was a harness
  failure, not a behavior assertion failure.
- All nine repository pre-commit hooks passed against the exact two-path staged
  correction and plan set without modifying files.

## PR feedback correction

PR #248 review at 2026-09-26T07:50:23Z identified that the safeguarding
mailbox used in the first handoff came from an older WRU announcement rather
than the current March 2026 safeguarding policy. The current primary policy
lists `safeguarding@wru.wales`; the implementation now uses that address and
retains the club contact and emergency route. Focused validation confirms the
old `wrusafeguarding` address is absent from `src` and the generated conduct
page uses `mailto:safeguarding@wru.wales`. Fresh Astro check/build, production
audit, and diff checks pass. All nine repository pre-commit hooks also pass
against the exact two-path feedback correction set without modifying files.
