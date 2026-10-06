# LinkedIn Developer Platform — manual setup checklist

> **Nothing in this document has been implemented.** There is no Insight Tag, no
> Conversions API call, no Lead Sync and no GTM change in the codebase. This is
> the parallel workstream for you to run while the foundation is reviewed.
>
> Verified against LinkedIn's current documentation on 6 October 2026. Where a
> value is an ID or a credential, it is left blank — none has been invented.

## Start these NOW, in parallel

The API access reviews are the longest pole in the whole project and nothing in
the codebase can shorten them. In priority order:

1. **Company Page verification of the developer app** — blocks everything else.
2. **Conversions API access request** (`rw_conversions`, `r_ads`).
3. **Lead Sync access request** (`r_marketing_leadgen_automation`).

Steps 4 onward can wait until those are approved.

---

### 1. Confirm Page super-admin access

- linkedin.com/company/trafficomm-media-services → **Admin tools → Manage admins**
- Confirm your name is listed as **Super admin**.
- *Why it matters:* only a Page super admin can verify a developer app, and
  without verification the Conversions API request cannot proceed.

### 2. Create the developer app

- developer.linkedin.com → **My apps → Create app**
- App name: something recognisable, e.g. "Trafficomm Lead Infrastructure"
- **LinkedIn Page:** the Trafficomm Page above. This association is what makes
  verification possible.
- Privacy policy URL: **blocked** — the site has no privacy policy yet. See
  `docs/privacy-policy-draft.md`. LinkedIn asks for this at app creation.
- ✅ *Verify:* the app appears under My apps.

### 3. Verify the Page association

- App → **Settings → Verify** → generates a verification URL.
- Open that URL as the Page super admin and approve.
- ✅ *Verify:* the app's Settings tab shows the Page as **verified**, not pending.

### 4. Request the API products

App → **Products** tab.

| Product | Gives | Permissions |
|---|---|---|
| Advertising API | Conversions API, conversion rules | `rw_conversions`, `r_ads` |
| Lead Sync API | Lead Gen Form responses and webhooks | `r_marketing_leadgen_automation` |

- Both require review. Expect a form asking for your use case — describe it as
  measuring and optimising Trafficomm's own lead generation campaigns, with
  server-side conversion upload and lead retrieval into an internal system.
- ✅ *Verify:* each product moves from "Request access" to **granted** on the
  Products tab, and the permissions appear under **Auth → OAuth 2.0 scopes**.

### 5. Ad account roles

- Campaign Manager → **Account settings → Manage access**
- Confirm your user holds one of: `ACCOUNT_BILLING_ADMIN`, `ACCOUNT_MANAGER`,
  `CAMPAIGN_MANAGER`, `CREATIVE_MANAGER`.
- **`VIEWER` is not sufficient** — the Conversions API explicitly rejects it.
- ✅ *Verify:* note the **Ad Account ID**; its URN is `urn:li:sponsoredAccount:{id}`.

### 6. Insight Tag → Partner ID

- Campaign Manager → **Analyze → Insight Tag → Install my Insight Tag**
- Choose "I will install the tag myself" to reveal the **Partner ID**.
- **Do not install it yet.** It goes in GTM, gated on consent, after the privacy
  policy and consent mechanism are live.
- ✅ *Verify:* Partner ID is a numeric value shown on that screen.

### 7. Enable first-party cookies (this is what produces `li_fat_id`)

- Campaign Manager → **Insight Tag settings → enable first-party cookies /
  enhanced conversion tracking.**
- Without this, LinkedIn does not append `li_fat_id` to ad click URLs, and the
  capture already built into the site will simply never see one. Website-lead
  match rates are materially weaker without it.
- ✅ *Verify:* click one of your own ads and confirm `li_fat_id` appears in the
  landing URL. The site will then store it — visible in the dashboard as
  "li_fat_id ✓" on that lead.

### 8. Create the conversion rules

Campaign Manager → **Analyze → Conversions → Create conversion**, with
**Conversions API** as the method (not the Insight Tag).

| Rule | Type | Notes |
|---|---|---|
| Trafficomm — Website Lead | `LEAD` | Fires on a genuine, server-confirmed submission |
| Trafficomm — Qualified Lead | `QUALIFIED_LEAD` | Fires on human qualification only |

- Consider a 90-day post-click attribution window; `QUALIFIED_LEAD` supports up
  to 180 or 365 days.
- ✅ *Verify:* record each **Conversion ID** from the URL
  (`/conversions/{conversionId}`). The API form is
  `urn:lla:llaPartnerConversion:{id}`.

### 9. Lead Gen Form

- Build the form (fields and questions are already agreed; see Decision 16).
- **Requires the published privacy policy URL.**
- ✅ *Verify:* record the form URN. Note that answers return as `questionId` plus
  option **index**, not label text — the mapping has to be recorded when the form
  is built, or the stored answers will be meaningless.

### 10. Campaign

- Objective **Lead Generation**; once qualified-lead volume exists, switch the
  optimisation target to **`MAX_QUALIFIED_LEAD`**.
- Use Campaign Manager's **test lead** mechanism first. Test leads arrive with
  `testLead: true` and the dashboard already displays them with a "test" badge.

---

## What I will need from you for the next phase

Paste these into Vercel environment variables (Production and Preview separately
— never into the repository):

```
LINKEDIN_ACCESS_TOKEN          # or client id/secret + refresh token
LINKEDIN_AD_ACCOUNT_URN        # urn:li:sponsoredAccount:...
LINKEDIN_CONVERSION_LEAD       # urn:lla:llaPartnerConversion:...
LINKEDIN_CONVERSION_QUALIFIED  # urn:lla:llaPartnerConversion:...
LINKEDIN_API_VERSION           # e.g. 202609
LINKEDIN_WEBHOOK_SECRET        # for Lead Sync signature verification
```

Plus, not as secrets: the **Partner ID** (for the GTM tag) and the **Lead Gen
Form URN** with its question/option mapping.

---

## Platform constraints worth knowing before you commit

- **Versioned API with a sunset cadence.** The `Linkedin-Version: YYYYMM` header
  is mandatory. Version `202510` sunsets **15 October 2026 — nine days from
  now**. Pin `202609` or later and plan periodic bumps.
- **Webhook validation is mandatory.** Since 16 March 2026 LinkedIn only pushes
  lead notifications to webhooks that have passed challenge-response validation,
  and an unvalidated endpoint receives **nothing, silently**. The planned poll
  backstop exists because of this.
- **`conversionHappenedAt` must be within the past 90 days.** A lead qualified
  more than 90 days after it arrived cannot be sent. The schema already stores
  `qualified_at` separately from `submitted_at` so the right timestamp is
  available, but a long sales cycle will still hit this ceiling.
- **`MAX_QUALIFIED_LEAD` needs volume before it learns anything.** Expect to run
  on `LEAD` optimisation first and switch later.
- **`externalIds` supports a maximum of one value.**
