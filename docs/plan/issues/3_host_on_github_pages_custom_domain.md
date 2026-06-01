# GitHub Issue #3: Host on GitHub Pages with squirrels.team custom domain

**Issue:** [#3](https://github.com/denhamparry/squirrelsteam/issues/3)
**Status:** Planning
**Date:** 2026-06-01
**Branch:** `denhamparry.co.uk/fix/gh-issue-003`
**Merge style:** `gh pr merge --rebase` (repo only allows rebase merges)

## Problem Statement

The Rhiwbina Squirrels site is built with Astro but has no deploy pipeline and
no custom-domain configuration. The apex domain **squirrels.team** currently
redirects to a SumUp fundraising page rather than serving the site.

### Current Behavior

- `https://squirrels.team` redirects to a SumUp fundraising page.
- There is no GitHub Actions workflow that builds and publishes the site
  (`.github/workflows/ci.yml` is an unmodified template placeholder that runs
  `echo`).
- GitHub Pages is not enabled on the repo (`gh api .../pages` returns 404).
- There is no `public/CNAME`, so even if Pages were enabled the custom domain
  would not be claimed.

### Expected Behavior

- `https://squirrels.team` serves the built Astro site over HTTPS.
- Every push to `main` rebuilds and redeploys automatically.
- SumUp fundraising remains reachable through an on-site Donate button
  (tracked separately in #8) rather than an apex-domain redirect.

## Current State Analysis

### Relevant Code/Config

- `astro.config.mjs` — already sets `site: "https://squirrels.team"`. No `base`
  is required because the site is served from the apex (root) of a custom
  domain, not a `user.github.io/repo` sub-path. **No change needed here.**
- `.github/workflows/ci.yml` — placeholder template with a single `echo` job.
  It does not build or deploy anything.
- `public/` — contains only `favicon.svg`. No `CNAME` file.
- `package.json` — `npm run build` runs `astro build`, output goes to `dist/`.
- Repo: `denhamparry/squirrelsteam`, default branch `main`. GitHub user page is
  `denhamparry.github.io`.

### Related Context

- `CLAUDE.md` records that DNS is **moving Namecheap → Cloudflare** for this
  issue. The maintainer's open question ("where is DNS managed?") is therefore
  answered: records will be set in **Cloudflare**.
- Issue #8 covers the on-site Donate button that replaces the SumUp redirect.
- Astro's official GitHub Pages guide recommends the `withastro/action`
  (build + artifact upload) feeding `actions/deploy-pages` (publish).

## Solution Design

### Approach

1. Add a dedicated **deploy workflow** (`.github/workflows/deploy.yml`) that
   builds the Astro site and publishes it to GitHub Pages on every push to
   `main`, using the official `withastro/action` + `actions/deploy-pages`
   pattern with the required `pages: write` / `id-token: write` permissions and
   a `pages` concurrency group.
2. Add **`public/CNAME`** containing `squirrels.team` so the built artifact
   claims the custom domain on every deploy (prevents Pages from dropping the
   domain on redeploy).
3. Leave `astro.config.mjs` unchanged — `site` is already correct and no `base`
   is needed for an apex custom domain.
4. **Document** the manual, out-of-repo steps that cannot be expressed in code
   (enable Pages, add DNS records in Cloudflare, remove the SumUp redirect,
   enforce HTTPS, verify) in a new `docs/hosting.md`, and link it from the
   README.

### Rationale and Trade-offs

- **Dedicated `deploy.yml` over editing `ci.yml`:** the placeholder `ci.yml` is
  template boilerplate. A separate, single-purpose deploy workflow is clearer
  than overloading the placeholder, and keeps the deploy concern isolated.
  Replacing/removing the placeholder `ci.yml` is out of scope (noted as a
  follow-up).
- **`public/CNAME` over the repo Pages "custom domain" field alone:** GitHub
  Actions-based Pages deploys publish a fresh artifact each time. Committing the
  `CNAME` file guarantees the domain survives every redeploy; relying solely on
  the settings field can be dropped by artifact-based deploys.
- **A records (+ AAAA) at the apex via Cloudflare DNS-only:** GitHub Pages'
  documented apex configuration. Cloudflare's orange-cloud proxy must be **off**
  (DNS only / grey cloud) so GitHub can issue and serve the Let's Encrypt
  certificate and so "Enforce HTTPS" works.

## Implementation Plan

### Step 1: Add the GitHub Pages deploy workflow

**File:** `.github/workflows/deploy.yml` (new)

**Changes:** Build the Astro site and deploy to Pages on push to `main`
(plus manual `workflow_dispatch`). Two jobs: `build` (checkout → install →
`astro build` → upload artifact via `withastro/action`) and `deploy`
(`actions/deploy-pages`).

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

# Allow one concurrent deployment; don't cancel an in-progress production run.
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Build Astro site
        uses: withastro/action@v3
        # withastro/action installs deps, runs `astro build`, and uploads
        # the dist/ artifact ready for actions/deploy-pages.

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Testing:**

```bash
# Validate workflow YAML locally before pushing
npm run build            # confirm the site builds clean (astro build → dist/)
python3 -c 'import yaml,sys; yaml.safe_load(open(".github/workflows/deploy.yml"))'
```

### Step 2: Add the CNAME file for the custom domain

**File:** `public/CNAME` (new)

**Changes:** Single line, apex domain only (no scheme, no trailing slash). Astro
copies `public/` verbatim into `dist/`, so `dist/CNAME` ships with every deploy.

```text
squirrels.team
```

**Testing:**

```bash
npm run build
test -f dist/CNAME && cat dist/CNAME   # must print exactly: squirrels.team
```

### Step 3: Document hosting, DNS, and manual steps

**File:** `docs/hosting.md` (new)

**Changes:** Document the deploy pipeline and the manual steps that live outside
the repo. Include the exact DNS records to add in Cloudflare.

Content to cover:

- **Enable Pages:** repo **Settings → Pages → Build and deployment → Source:
  GitHub Actions**. (Optionally set the custom domain field to
  `squirrels.team`; the committed `public/CNAME` is the source of truth.)
- **DNS records (Cloudflare, DNS-only / grey cloud):**

  | Type  | Name              | Value                   |
  | ----- | ----------------- | ----------------------- |
  | A     | `squirrels.team`  | `185.199.108.153`       |
  | A     | `squirrels.team`  | `185.199.109.153`       |
  | A     | `squirrels.team`  | `185.199.110.153`       |
  | A     | `squirrels.team`  | `185.199.111.153`       |
  | AAAA  | `squirrels.team`  | `2606:50c0:8000::153`   |
  | AAAA  | `squirrels.team`  | `2606:50c0:8001::153`   |
  | AAAA  | `squirrels.team`  | `2606:50c0:8002::153`   |
  | AAAA  | `squirrels.team`  | `2606:50c0:8003::153`   |
  | CNAME | `www`             | `denhamparry.github.io` |

- **Remove the SumUp redirect:** deleting/replacing the apex A/AAAA (or URL
  redirect) records above removes the old SumUp redirect. ⚠️ Confirm with the
  maintainer before switching — this is the breaking cutover called out in the
  issue. Fundraising stays reachable via the on-site Donate button (#8).
- **Enforce HTTPS:** after the apex records resolve and GitHub issues the
  certificate, tick **Settings → Pages → Enforce HTTPS**.
- **Verification checklist** (see Testing Strategy below).

**File:** `README.md`

**Changes:** Add a short "Hosting & deployment" pointer linking to
`docs/hosting.md` so contributors can find the deploy/DNS runbook.

**Testing:**

```bash
pre-commit run markdownlint-cli2 --files docs/hosting.md README.md
```

## Testing Strategy

### Build Verification

- `npm run build` succeeds and produces `dist/`.
- `dist/CNAME` exists and contains exactly `squirrels.team`.
- `deploy.yml` parses as valid YAML and uses the `pages`/`id-token` permissions
  required by `actions/deploy-pages`.

### Deploy Integration

**Test Case 1: Auto-deploy on push to main**

1. Merge this PR to `main`.
2. Confirm the **Deploy to GitHub Pages** workflow runs and both `build` and
   `deploy` jobs succeed.
3. Confirm the run's `deploy` job reports a `page_url`.

**Test Case 2: Custom domain + HTTPS resolve**

1. After DNS records are added in Cloudflare and propagate, browse to
   `https://squirrels.team`.
2. Confirm the site loads over HTTPS with a valid certificate (no warning).
3. Confirm `https://www.squirrels.team` reaches the site (redirects to apex).
4. Confirm **Enforce HTTPS** is enabled in repo settings.

```bash
# Post-deploy smoke checks (run once DNS has propagated)
dig +short squirrels.team A
dig +short www.squirrels.team CNAME
curl -sSI https://squirrels.team | head -n 1   # expect HTTP/2 200
```

### Regression Considerations

- SumUp fundraising remains reachable via the on-site Donate button (#8) once
  the apex redirect is removed.
- Existing site pages and the `fixtures.ics` feed (#4/#15) continue to build and
  serve from the custom domain (absolute URLs already use the configured
  `site`).

## Success Criteria

- [ ] `.github/workflows/deploy.yml` added (build + deploy-pages, push to main).
- [ ] `public/CNAME` added containing `squirrels.team`.
- [ ] `docs/hosting.md` documents Pages enablement, Cloudflare DNS records,
      SumUp redirect removal, and Enforce HTTPS.
- [ ] README links to the hosting doc.
- [ ] `npm run build` produces `dist/CNAME` with `squirrels.team`.
- [ ] Pre-commit hooks pass.
- [ ] (Post-merge, manual) Pages enabled, DNS cut over, HTTPS enforced, and
      `https://squirrels.team` verified to serve the site.

## Files Modified

1. `.github/workflows/deploy.yml` - new GitHub Pages build + deploy workflow.
2. `public/CNAME` - new file containing `squirrels.team`.
3. `docs/hosting.md` - new hosting/DNS/HTTPS runbook with exact records.
4. `README.md` - add a "Hosting & deployment" pointer to `docs/hosting.md`.

## Related Issues and Tasks

### Depends On

- Repo admin access to enable Pages and set DNS (maintainer action, post-merge).

### Blocks

- Public launch of the site on the custom domain.

### Related

- #8 - On-site Donate button that replaces the SumUp apex redirect.
- #4 / #15 - Fixtures calendar feed served from the same domain.

### Enables

- Auto-deploy of all future content changes on push to `main`.

## References

- [GitHub Issue #3](https://github.com/denhamparry/squirrelsteam/issues/3)
- Astro docs: "Deploy your Astro Site to GitHub Pages"
- GitHub docs: "Managing a custom domain for your GitHub Pages site"
  (apex A/AAAA records, `www` CNAME, Enforce HTTPS)

## Notes

### Key Insights

- `astro.config.mjs` `site` is already correct; the gap is purely the deploy
  pipeline, the `CNAME`, and the out-of-repo DNS/Pages steps.
- The committed `public/CNAME` is the durable source of truth for the custom
  domain under artifact-based (Actions) Pages deploys.
- Cloudflare proxy must be **off** (DNS only) on the Pages records so GitHub can
  provision and serve the certificate.

### Alternative Approaches Considered

1. **Edit the placeholder `ci.yml` to add deploy steps** ❌ — overloads a
   template placeholder; a dedicated `deploy.yml` is clearer and isolates the
   deploy concern.
2. **Use a third-party Pages action (e.g. `peaceiris/actions-gh-pages`)** ❌ —
   the official `withastro/action` + `actions/deploy-pages` is first-party,
   artifact-based, and matches Astro's documented path.
3. **Set the custom domain only in repo settings (no committed CNAME)** ❌ —
   artifact-based deploys can drop the domain on redeploy; committing `CNAME`
   makes it durable. ✅ Chosen.

### Best Practices

- Keep the apex Cloudflare records DNS-only (grey cloud) so HTTPS works.
- Verify the first production deploy and the certificate before enabling
  Enforce HTTPS.

### Follow-up Ideas (out of scope)

- Remove or repurpose the placeholder `.github/workflows/ci.yml`.
- Add a build-only check on pull requests to catch build breakage before merge.
- Pin GitHub Action versions to commit SHAs for supply-chain hardening.
