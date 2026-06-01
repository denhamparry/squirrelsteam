# Email — `contact@squirrels.team`

The address `contact@squirrels.team` is published on the
[About / Join us](../src/pages/about.astro) and
[Fundraising](../src/pages/fundraising.astro) pages. Mail to it is delivered
through **Cloudflare Email Routing**, which forwards every message to an
existing inbox. No full mailbox is provisioned — it is a forward only.

| Setting           | Value                       |
| ----------------- | --------------------------- |
| Address           | `contact@squirrels.team`    |
| Forwards to        | `lewis@denhamparry.co.uk`   |
| Provider          | Cloudflare Email Routing    |
| DNS managed in    | Cloudflare (see [`hosting.md`](hosting.md)) |

## One-time setup (maintainer)

These steps happen in the Cloudflare dashboard and require admin access. Do them
once.

### 1. Enable Email Routing

Cloudflare dashboard → **squirrels.team** → **Email** → **Email Routing** →
**Get started**. Enabling it **adds the required MX and SPF records
automatically** (see [DNS records](#dns-records) below) — you do not add them by
hand.

### 2. Add the forwarding rule

Under **Email Routing → Routing rules → Custom addresses**, add:

| Custom address           | Action          | Destination               |
| ------------------------ | --------------- | ------------------------- |
| `contact@squirrels.team` | Send to an email | `lewis@denhamparry.co.uk` |

### 3. Verify the destination inbox

Cloudflare sends a confirmation email to `lewis@denhamparry.co.uk`. Click the
link in it — forwarding does **not** work until the destination is verified.
Check **Email Routing → Destination addresses** shows the address as *Verified*.

### 4. Add a DMARC record (recommended)

The domain sends no outbound mail, so publish a protective DMARC policy to stop
spoofing of `@squirrels.team`. Add a **DNS-only** TXT record:

| Type | Name                    | Value                                                              |
| ---- | ----------------------- | ------------------------------------------------------------------ |
| TXT  | `_dmarc.squirrels.team` | `v=DMARC1; p=reject; rua=mailto:lewis@denhamparry.co.uk`           |

## DNS records

Cloudflare adds the MX and SPF records below **automatically** when Email
Routing is enabled. They are documented here so the configuration is reviewable
and recoverable. All are **DNS-only** (grey cloud) — Email Routing manages them;
they are not proxied.

| Type | Name             | Value                                        | Notes             |
| ---- | ---------------- | -------------------------------------------- | ----------------- |
| MX   | `squirrels.team` | `route1.mx.cloudflare.net`                   | priority auto-set |
| MX   | `squirrels.team` | `route2.mx.cloudflare.net`                   | by Cloudflare     |
| MX   | `squirrels.team` | `route3.mx.cloudflare.net`                   |                   |
| TXT  | `squirrels.team` | `v=spf1 include:_spf.mx.cloudflare.net ~all` | SPF               |
| TXT  | `_dmarc...`      | (see [step 4](#4-add-a-dmarc-record-recommended)) | DMARC — manual |

> **MX priorities** are assigned automatically by Cloudflare and vary per zone —
> do not set them by hand.
>
> **DKIM** is **not** required. Cloudflare Email Routing does not DKIM-sign
> forwarded mail (it uses ARC to preserve the sender's original signature), so
> there is no DKIM record to add for a forwarding-only setup. DKIM would only be
> needed if `@squirrels.team` later sends outbound mail.
>
> **Existing SPF:** if an SPF record already exists, merge rather than duplicate,
> e.g. `v=spf1 include:_spf.mx.cloudflare.net include:_spf.google.com ~all`.

## Verification

After the destination inbox is verified and DNS has propagated:

```bash
dig +short squirrels.team MX            # expect route1/route2/route3.mx.cloudflare.net
dig +short squirrels.team TXT           # expect the v=spf1 ...cloudflare.net ~all record
dig +short _dmarc.squirrels.team TXT    # expect the v=DMARC1; p=reject; ... record
```

Then send a test email to `contact@squirrels.team` from an external account
and confirm it arrives in `lewis@denhamparry.co.uk`.

## Changing the forwarding target

To point the address at a different inbox (e.g. a shared committee mailbox):

1. Add and verify the new destination in **Email Routing → Destination
   addresses**.
2. Edit the `contact@squirrels.team` custom-address rule to send to it.
3. Update the **Forwards to** value at the top of this document and the DMARC
   `rua=` address if it should change too.
