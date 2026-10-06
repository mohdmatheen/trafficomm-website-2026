# Trafficomm Privacy Policy — DRAFT, NOT PUBLISHED

> **Status: draft for approval. Not published, not routed, not linked.**
> There is no `/privacy` page on the site and this file does not create one.
>
> **This draft requires legal review before publication.** It was written from
> what the repository and infrastructure actually do, not from a template, but a
> privacy policy is a legal document and nobody has reviewed it as one. Every
> point marked **[DECISION]** needs a business answer and every point marked
> **[LEGAL]** needs a lawyer, because the honest position is that the drafting
> below describes technical reality accurately and makes no claim to be advice.

---

## What is factual here, and what is not

Everything in the "What we collect" and "Who we share it with" sections below is
derived directly from the codebase: the two forms, the fields they validate, the
analytics allowlist, the email delivery module, the optional webhook and the
planned LinkedIn integration. Those parts are accurate.

The retention periods, the legal bases, the regulator references and the data
subject rights are **placeholders**. They depend on decisions nobody has made and
on jurisdictions nobody has confirmed.

---

## DRAFT TEXT

### Privacy Policy

**Trafficomm Digital Media Services Pvt Ltd** ("Trafficomm", "we", "us") operates
trafficomm.com. This policy explains what we collect through this website, why,
and what we do with it.

Last updated: **[DECISION: publication date]**

#### Who we are

Trafficomm has provided ad operations and campaign execution services to
advertising agencies since 2015, delivered from a centralised operations team in
Chennai, India.

**[DECISION]** Registered address to publish.
**[DECISION]** Contact address for privacy enquiries — a dedicated mailbox
(for example `privacy@trafficomm.com`) is preferable to a personal address.
**[LEGAL]** Whether a representative or data protection officer must be named for
any market in which the site is actively promoted.

#### What we collect

**When you contact us.** Our Operations Assessment and call-request forms ask for
your name, company, work email address, approximate monthly campaign volume and,
optionally, a description of your operational challenge. All of these are
business contact details. We ask for a work email rather than a personal one.

**When you use Trafficomm Labs.** The AdOps Capacity calculator runs entirely in
your browser. Nothing you enter — including any salary or cost figures — is sent
to us unless you choose to request a delivery estimate. If you do, we receive
your name, company, work email, optionally your role and phone number, and the
analysis the calculator produced from your inputs. **Individual salary figures
are never transmitted.**

**How you reached us.** We record the page you first landed on, the referring
website if your browser disclosed one, and any campaign parameters in the link
you followed (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`,
`utm_term`). Where you arrive from a LinkedIn advertisement, LinkedIn may append
a click identifier (`li_fat_id`) which we record with your enquiry. This
information is held in your browser for the duration of your visit and is sent to
us only if you submit a form.

**Analytics.** We use Google Analytics 4 through Google Tag Manager to understand
how the site is used. The events we send are restricted by an allowlist in our
own code: your name, email address, company and the free-text content of any
message **cannot** be sent to Google, because there is no field for them to
travel in. Calculator figures are sent only as bands (for example a team-size
range), never as the values you entered.

**[PLANNED — not yet live]** LinkedIn Insight Tag for advertising measurement and
retargeting. See "Advertising" below. This is not currently installed.

#### Cookies and similar technologies

**[DECISION — depends on the consent architecture chosen]** This section must list
the actual cookies set once consent is implemented. At the time of writing the
site sets cookies through Google Tag Manager and Google Analytics only. The
LinkedIn Insight Tag, if approved, will set advertising cookies and must not be
enabled before this section and the consent mechanism are in place.

#### Advertising **[PLANNED — not yet live]**

If you arrive from a LinkedIn advertisement or submit a LinkedIn Lead Gen Form:

- LinkedIn provides us with the contact details you chose to share on that form,
  together with the campaign and advertisement the lead came from.
- We may send LinkedIn a signal when we determine that an enquiry is a genuine,
  relevant business opportunity, so that LinkedIn can show our advertisements to
  more people like you. **Where we send your email address for this purpose, it is
  irreversibly hashed (SHA-256) before it leaves our systems** — we do not send
  LinkedIn your email address in readable form.
- We do not sell your information, and we do not share it with advertising
  networks other than as described here.

**[LEGAL]** Confirm the lawful basis for this processing in each target market,
and whether it requires consent rather than legitimate interest.

#### Who we share it with

- **Our email provider**, to deliver your enquiry to us.
- **Our hosting provider** (Vercel), which runs the website and the database.
- **Our database provider**, which stores enquiries so we can respond to and
  manage them.
- **Google**, for the analytics described above.
- **[PLANNED]** LinkedIn, as described under Advertising.
- **[DECISION]** Any CRM or workflow tool an enquiry is forwarded to.

We do not sell personal information.

#### Where your information is held

Trafficomm operates from India. Our hosting, database and email providers may
process data in other countries.

**[LEGAL]** International transfer mechanism, and which specific regions the
hosting and database are configured to use. This matters most if European
visitors convert.

#### How long we keep it

**[DECISION — required before publication]** A retention period for enquiries and
for leads marked invalid. A policy that says "as long as necessary" without a
figure is not useful to a reader and is increasingly not acceptable to
regulators. A defensible starting point would be a stated number of months for
unconverted enquiries and a longer period for customers, but the number is a
business decision.

#### Your choices

You can ask us what we hold about you, ask us to correct it, or ask us to delete
it, by writing to **[DECISION: privacy contact]**.

**[LEGAL]** The specific rights to enumerate depend on which jurisdictions'
regimes Trafficomm accepts as applicable. Do not list GDPR rights verbatim unless
that has been confirmed; equally, do not omit them if European visitors are
knowingly being converted.

#### Changes

We will update this policy when what we do changes, and the date at the top will
change with it.

---

## Notes for review — read before publishing

1. **The LinkedIn sections describe a system that does not exist yet.** Either
   publish them only when the integration goes live, or publish with the
   "planned" framing retained. Publishing them as current would be inaccurate.
2. **The analytics claim is unusually strong and it is true.** The allowlist in
   `lib/analytics.ts` genuinely prevents personal data reaching GTM, and it is
   asserted by tests. It is worth stating plainly because most policies cannot.
3. **The salary claim is also true and worth keeping** — the Labs calculator
   really does keep salary inputs in the browser.
4. **A Lead Gen Form cannot be created without a published privacy policy URL.**
   LinkedIn requires one on every form. This document is therefore on the
   critical path for campaign launch, not a tidy-up afterwards.
5. **Nothing here should be published by an engineer.** It needs a legal reviewer
   and a business owner for the bracketed decisions.
