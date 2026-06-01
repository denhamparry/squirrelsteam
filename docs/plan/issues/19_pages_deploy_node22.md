# Plan: Fix Pages deploy — withastro/action Node version (issue #19)

**Status:** Complete
**Issue:** #19 — fix: Pages deploy fails — withastro/action uses Node 20, Astro 6 needs Node ≥22.12
**Type:** bug (fix)
**Branch:** denhamparry.co.uk/fix/gh-issue-019

## Problem

The **Deploy to GitHub Pages** workflow (`.github/workflows/deploy.yml`, added
in PR #18) fails on the `build` job. `withastro/action@v3` defaults to Node 20,
but Astro 6.1.10 requires Node `>=22.12.0`, so `astro build` aborts with:

```text
Node.js v20.20.2 is not supported by Astro!
Please upgrade Node.js to a supported version: ">=22.12.0"
```

## Root cause

`withastro/action` pins its own Node version (20 by default) instead of reading
`engines` from the project. The build passes locally only because the dev
machine runs newer Node.

## Fix

1. **`.github/workflows/deploy.yml`** — add the `node-version: 22` input to the
   `withastro/action@v3` step so the runner uses a Node version Astro 6
   supports.

   ```yaml
   - name: Build Astro site
     uses: withastro/action@v3
     with:
       node-version: 22
   ```

2. **`README.md`** — bump the local-dev prerequisite from **Node.js 20+** to
   **Node.js 22+** (line 18) to match Astro 6's requirement.

## Files Modified

- `.github/workflows/deploy.yml`
- `README.md`
- `docs/plan/issues/19_pages_deploy_node22.md` (this plan)

## Testing Strategy

- `npm run build` locally still succeeds (no behavioural change to the site).
- Acceptance: after merge, the **Deploy to GitHub Pages** workflow succeeds on
  push to `main` (the runner builds on Node 22).

## Acceptance Criteria

- [ ] `.github/workflows/deploy.yml` sets `node-version: 22` on `withastro/action`
- [ ] **Deploy to GitHub Pages** workflow succeeds on push to `main`
- [ ] `README.md` local-dev prerequisite updated to Node.js 22+

## Risks / Notes

- `withastro/action@v3` exposes a `node-version` input (default `20`); setting
  it to `22` is the documented mechanism. No other workflow steps depend on the
  Node version.
- `ci.yml` is a separate workflow — verified during research to be an
  all-commented placeholder (single `echo` step, no Node setup, no `astro
  build`). Out of scope; no change needed.
