# Consent architecture — recommendation for approval

> Nothing in this document has been implemented. No consent mechanism exists on
> the site today, and the LinkedIn Insight Tag has not been installed. This is a
> recommendation and a decision request.

## The position today

The site has **no consent layer of any kind**. Google Tag Manager loads on every
page and GA4 runs inside it. That is a defensible posture for analytics-only
measurement in several markets and an indefensible one the moment advertising and
retargeting cookies are added — which is exactly what the LinkedIn Insight Tag
would do.

So the consent decision is not a tidy-up. It gates the Insight Tag.

## What actually drives the requirement

Three things, in order of how much they constrain the design:

1. **Google requires a certified consent management platform for advertising
   traffic in the EEA and UK.** Trafficomm is not advertising there initially,
   but the brief names the US and UK as later markets, and European visitors can
   reach the site regardless of where the ads run. Building something bespoke now
   and replacing it when the UK campaign starts is the technical debt the brief
   asks me to avoid.
2. **Consent Mode v2 is the signalling format**, whatever collects the consent.
   Tags read `ad_storage`, `ad_user_data`, `ad_personalization` and
   `analytics_storage` from the dataLayer. Any approach that does not speak this
   will have to be rewritten.
3. **UAE and Saudi Arabia both have data protection regimes** that bear on
   advertising cookies and on processing business contact data. **[LEGAL]** I am
   not qualified to tell you what they require in detail and will not guess; the
   technical architecture below is designed so the answer can be configured
   rather than rebuilt.

## Recommendation

**A Google-certified CMP, configured for Consent Mode v2, with the LinkedIn
Insight Tag gated on `ad_storage` inside GTM.**

Concretely:

- The CMP sets Consent Mode defaults **before** GTM fires, denying `ad_storage`,
  `ad_user_data` and `ad_personalization` until a choice is made.
- GA4 continues to run in the meantime using Consent Mode's modelled behaviour,
  so analytics does not go dark while someone decides.
- The LinkedIn Insight Tag gets a GTM trigger condition requiring `ad_storage`
  granted. It cannot fire otherwise, and that is enforced in the container, not
  in site code.
- Region defaults let UAE and Saudi visitors be treated differently from EEA
  visitors **if and only if** legal advice says they may be.

### Why a CMP rather than a banner we write ourselves

A hand-rolled banner is perhaps a day's work and would satisfy the letter of
"smallest". It would also have to be replaced the moment Trafficomm advertises
into the UK or EEA, because Google requires a certified platform for that
traffic — and replacing a consent layer after it has been collecting consent is
materially harder than choosing one now. The CMP is the smaller option measured
over the life of the campaign rather than over the sprint.

**Cost:** certified CMPs (Cookiebot, Osano, Usercentrics, CookieYes and others)
have free tiers that typically cover a site of this size, with paid tiers for
higher traffic. **[DECISION]** Which vendor, and who owns the account.

### The cheaper alternative, stated honestly

If Trafficomm commits to **never** advertising into the EEA or UK, a minimal
first-party banner writing Consent Mode v2 signals into the dataLayer is
sufficient and avoids a vendor. It is roughly 150 lines plus a GTM trigger
change. I would only recommend this if that commitment is real, because the
migration cost later is the whole point of the recommendation above.

## What must be true before the Insight Tag goes live

1. Privacy policy published, covering advertising cookies and retargeting.
2. Consent mechanism live, setting Consent Mode v2 defaults before GTM.
3. Insight Tag trigger in GTM conditioned on `ad_storage` granted.
4. Tag verified as **not** firing before consent, and firing after it.
5. Production-only trigger exception confirmed, so preview deployments cannot
   contaminate LinkedIn's data.

## Sequencing

The consent work and the LinkedIn Developer Platform approvals are independent
and should run in parallel. The approvals have an external review time nobody
controls; the consent work does not. Neither blocks the Phase 1–4 foundation
already built.

**[DECISION]** Approve the CMP route, or confirm that EEA/UK advertising is
permanently out of scope and approve the minimal banner instead.
