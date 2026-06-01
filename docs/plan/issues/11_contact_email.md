# GitHub Issue #11: Set up `contact@squirrels.team` email

**Issue:** [#11](https://github.com/denhamparry/squirrelsteam/issues/11)
**Status:** Complete
**Date:** 2026-06-01
**Branch:** `denhamparry.co.uk/docs/gh-issue-11`
**Merge style:** `gh pr merge --rebase` (repo only allows rebase merges)

## Problem Statement

The address `contact@squirrels.team` is published on the About / Join us page
(#7) and the Fundraising page (#8), but no mailbox or forwarding exists behind
it. Mail sent there currently bounces. Issue #11 asks for a working inbox.

### Current Behavior

- `src/pages/about.astro` and `src/pages/fundraising.astro` both reference
  `contact@squirrels.team`, so the address is live on the site.
- DNS for `squirrels.team` is managed in **Cloudflare** (issue #3, closed).
- No MX records exist for the apex, so the domain cannot receive mail.

### Expected Behavior

- Mail to `contact@squirrels.team` is delivered to a real inbox
  (`lewis@denhamparry.co.uk`) via **Cloudflare Email Routing**.
- The setup is documented so any maintainer can reproduce or change it.

## Scope of this PR

Most of issue #11 is **Cloudflare dashboard work** that cannot be performed from
the repository (adding MX/TXT records, verifying the destination inbox, sending
a test email). Those steps are the maintainer's to action.

**This PR delivers what the repo can own:**

1. A `docs/email.md` runbook documenting the Cloudflare Email Routing setup —
   the records, the forwarding decision, and a verification procedure — mirroring
   the existing `docs/hosting.md` DNS runbook.
2. A link to the new runbook from `README.md` (alongside the hosting runbook).
3. Confirmation that `contact@squirrels.team` is correct on the About page
   (already true — no code change needed; recorded here for the issue checklist).

**Out of scope (maintainer actions, tracked in the runbook):** enabling Email
Routing in Cloudflare, verifying the destination inbox, and sending the test
email.

## Solution Design

### Forwarding target

`contact@squirrels.team` → **`lewis@denhamparry.co.uk`** (decided with the
maintainer). A single-address forward via Cloudflare Email Routing; no full
mailbox is provisioned.

### DNS records (Cloudflare Email Routing)

Cloudflare **adds these automatically** when Email Routing is enabled — the
runbook documents them so they are reviewable and recoverable:

| Type | Name             | Value                                        | Notes              |
| ---- | ---------------- | -------------------------------------------- | ------------------ |
| MX   | `squirrels.team` | `route1.mx.cloudflare.net`                   | priority auto-set  |
| MX   | `squirrels.team` | `route2.mx.cloudflare.net`                   | by Cloudflare      |
| MX   | `squirrels.team` | `route3.mx.cloudflare.net`                   |                    |
| TXT  | `squirrels.team` | `v=spf1 include:_spf.mx.cloudflare.net ~all` | SPF                |

> **Priorities** are assigned automatically by Cloudflare when Email Routing is
> enabled — do not set them by hand (they vary per zone).
>
> **DKIM:** not applicable to inbound forwarding. Cloudflare Email Routing does
> not DKIM-sign forwarded mail (it uses ARC to preserve the original signature),
> so there is **no DKIM record to add** for this forwarding-only setup. DKIM
> would only be needed if the domain later sends outbound mail.
>
> **DMARC (recommended):** because the domain sends no outbound mail, publish a
> protective policy to stop spoofing:
> `TXT _dmarc.squirrels.team` → `v=DMARC1; p=reject; rua=mailto:lewis@denhamparry.co.uk`

### Proxy / cloud status

MX and TXT records are **DNS-only** (Email Routing manages them; they are not
proxied). This is consistent with `docs/hosting.md`, where the GitHub Pages A/AAAA
records are grey-cloud.

## Files Modified

- `docs/email.md` — **new** Cloudflare Email Routing runbook.
- `README.md` — add a link to `docs/email.md` near the existing hosting link.

## Verification (in this PR)

- `contact@squirrels.team` appears in `src/pages/about.astro` (confirmed at
  line 6) — issue checklist item "Confirm address is correct on the About page".
- `npm run build` succeeds (docs/README changes do not affect the build, but the
  site still builds clean).
- Pre-commit hooks (prettier, markdownlint) pass.

## Verification (maintainer, post-merge — documented in the runbook)

1. Enable Email Routing in Cloudflare, add `contact@` → `lewis@denhamparry.co.uk`.
2. Verify the destination inbox (Cloudflare sends a confirmation link).
3. Add the DMARC record above.
4. Send a test email to `contact@squirrels.team` and confirm receipt.

## Out-of-scope / Follow-up

- Actual Cloudflare dashboard configuration (maintainer action).
- A shared club mailbox (vs. personal forward) if the committee later wants one.
