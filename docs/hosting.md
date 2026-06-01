# Hosting & deployment

The Rhiwbina Squirrels site is built with Astro and published to **GitHub
Pages** at the custom domain **squirrels.team**. Every push to `main` rebuilds
and redeploys the site automatically.

## Deploy pipeline

- Workflow: [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)
- Trigger: push to `main` (and manual **Run workflow** via `workflow_dispatch`)
- Build: `withastro/action` installs dependencies, runs `astro build`, and
  uploads `dist/` as a Pages artifact.
- Publish: `actions/deploy-pages` publishes the artifact to GitHub Pages.

The custom domain is claimed by the committed
[`public/CNAME`](../public/CNAME) file (contents: `squirrels.team`). Astro
copies `public/` verbatim into `dist/`, so the `CNAME` ships with every deploy
and the domain survives redeploys.

## One-time setup (maintainer)

These steps are outside the repo and require admin access. Do them once.

### 1. Enable GitHub Pages

Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.

> **Ordering matters.** `actions/deploy-pages` fails if Pages has never been
> enabled with **Source: GitHub Actions**. Enable Pages before (or right after)
> the first push to `main`. If the first **Deploy to GitHub Pages** run failed
> because Pages wasn't enabled yet, enable it and **re-run** that workflow run.

The repo's custom-domain settings field may show `squirrels.team` once the
`CNAME` is deployed; the committed `public/CNAME` is the source of truth.

### 2. Add DNS records (Cloudflare)

DNS for `squirrels.team` is managed in **Cloudflare**. Add the records below
with the proxy **off** (DNS only / grey cloud) so GitHub can issue and serve the
Let's Encrypt certificate and so **Enforce HTTPS** works.

| Type  | Name             | Value                   |
| ----- | ---------------- | ----------------------- |
| A     | `squirrels.team` | `185.199.108.153`       |
| A     | `squirrels.team` | `185.199.109.153`       |
| A     | `squirrels.team` | `185.199.110.153`       |
| A     | `squirrels.team` | `185.199.111.153`       |
| AAAA  | `squirrels.team` | `2606:50c0:8000::153`   |
| AAAA  | `squirrels.team` | `2606:50c0:8001::153`   |
| AAAA  | `squirrels.team` | `2606:50c0:8002::153`   |
| AAAA  | `squirrels.team` | `2606:50c0:8003::153`   |
| CNAME | `www`            | `denhamparry.github.io` |

### 3. Remove the SumUp redirect

The apex domain currently redirects to a SumUp fundraising page. Replacing the
apex A/AAAA records above (or removing the old URL-redirect rule) removes that
redirect.

> ⚠️ **Confirm before switching.** This is a breaking cutover — once the apex
> points at GitHub Pages, the SumUp redirect is gone. Fundraising stays
> reachable through the on-site **Donate** button (see issue #8), which links to
> `https://shop.squirrels.team`.

### 4. Enforce HTTPS

After the apex records resolve and GitHub has issued the certificate, tick
**Settings → Pages → Enforce HTTPS**.

## Verification

Run these once DNS has propagated:

```bash
dig +short squirrels.team A           # expect the four 185.199.108-111.153 IPs
dig +short www.squirrels.team CNAME   # expect denhamparry.github.io.
curl -sSI https://squirrels.team | head -n 1   # expect HTTP/2 200
```

Then confirm in a browser:

- `https://squirrels.team` loads the site over HTTPS with a valid certificate.
- `https://www.squirrels.team` reaches the site (redirects to the apex).
- **Enforce HTTPS** is enabled in repo settings.

## Local build check

```bash
npm run build                 # builds to dist/
test -f dist/CNAME && cat dist/CNAME   # must print exactly: squirrels.team
```
