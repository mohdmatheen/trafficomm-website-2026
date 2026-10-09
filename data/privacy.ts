/**
 * Privacy policy content. Every statement describes what the code in this
 * repository does today (forms, API routes, analytics allowlist, storage).
 * When a practice changes, change this file in the same pull request.
 *
 * Deliberately absent until Trafficomm confirms them: a privacy mailbox,
 * fixed retention periods and the name of the production email/CRM provider.
 * Do not fill these in from assumptions.
 */
export const privacyUpdated = "2026-10-09";

export type PrivacySection = { id: string; heading: string; paragraphs?: string[]; items?: string[]; after?: string[] };

export const privacySections: PrivacySection[] = [
  {
    id: "who-we-are",
    heading: "Who we are",
    paragraphs: [
      "This website, www.trafficomm.com, is operated by Trafficomm Digital Media Services Pvt Ltd, a company incorporated in India (CIN U74999TN2016PTC104264). Our office is at 2nd floor, Metro Towers, Poonamalee High Road, Egmore, Chennai, Tamil Nadu 600084, India. In this policy, \"Trafficomm\", \"we\" and \"us\" mean that company. We decide how the personal information described below is used.",
      "This policy covers information collected through this website. It does not cover the work we do for clients under contract, which is governed by the agreement with each client.",
    ],
  },
  {
    id: "what-we-collect",
    heading: "What we collect",
    paragraphs: [
      "You can browse the site without telling us who you are. We collect personal information only in the situations below.",
    ],
    items: [
      "Operations assessment and call requests (the form on the contact page and elsewhere on the site): your name, company, work email address, approximate campaigns per month, whether you asked for an assessment or a conversation, and anything you choose to write about your operational challenge.",
      "How you reached the form: the page you were on, the referring website if your browser disclosed one, and any campaign tags in the link you followed (utm_source, utm_medium, utm_campaign, utm_content, utm_term). These are sent only with a form you submit.",
      "Delivery estimate requests in Trafficomm Labs: your name, company, work email address and, if you give them, your role and phone number, together with the analysis the AdOps capacity calculator produced. That analysis includes your market and currency, team size, campaign volume, platforms, workload and utilization, the total monthly cost and execution cost figures it calculated, and an indicative fit score. Individual salary inputs are never sent.",
      "Usage information through Google Analytics, described under \"Analytics and cookies\" below.",
      "Technical information that any website receives, such as your IP address, browser type and the page requested, which our hosting provider processes to deliver the site and protect it from abuse.",
    ],
  },
  {
    id: "calculator",
    heading: "The AdOps capacity calculator",
    paragraphs: [
      "The calculator in Trafficomm Labs runs in your browser. The figures you enter, including any salary or cost assumptions, stay on your device in your browser's session storage, which is cleared when you close the tab. Nothing you enter is sent to us unless you submit a delivery estimate request.",
      "To convert currencies, the site fetches a published exchange rate from a third-party rates service. That request is made from our server and contains only the two currencies, not anything about you.",
    ],
  },
  {
    id: "how-we-use",
    heading: "How we use it",
    items: [
      "To reply to your request, arrange the conversation you asked for and prepare an assessment or delivery estimate. Our basis for this is taking the steps you asked for before a possible contract, and our legitimate interest in answering business enquiries.",
      "To understand which pages and campaigns bring enquiries, using the page, referrer and campaign tags that travel with a form. Our basis is our legitimate interest in running and improving our marketing.",
      "To measure how the site is used in aggregate through Google Analytics. Our basis is our legitimate interest in understanding and improving the site.",
      "To keep the site and forms secure, for example by rejecting automated submissions and duplicate sends.",
    ],
    after: [
      "We do not sell personal information, and we do not use it to make automated decisions that have legal or similarly significant effects on you.",
    ],
  },
  {
    id: "analytics-and-cookies",
    heading: "Analytics and cookies",
    paragraphs: [
      "We use Google Tag Manager to load Google Analytics 4, a service from Google that tells us how visitors use the site, for example which pages are viewed and when a form is started or submitted. Google Analytics sets cookies in your browser, such as _ga and a _ga_ cookie specific to our property, to tell visits apart. Google processes this information as described in its own privacy policy, and keeps it under the retention settings of our Google Analytics property.",
      "The events our code sends to Google are limited by a fixed list of permitted fields. Your name, email address, company, phone number and anything you type into a free-text field are not on that list, so they are not sent to Google. Calculator results are sent only as ranges, for example a team-size band, never as the values you entered.",
      "Trafficomm's own code does not set any cookies. The calculator uses session storage on your device as described above. You can block or delete cookies in your browser settings, and Google offers a browser add-on that stops Google Analytics from collecting data about your visits.",
    ],
  },
  {
    id: "sharing",
    heading: "Who we share it with",
    paragraphs: ["We share personal information only with service providers that help us run the site and respond to you, and only for that purpose:"],
    items: [
      "Our website hosting provider, Vercel, which runs the site and the form handlers.",
      "The email delivery service and, where we use one, the business system to which form submissions are delivered so that our team receives them.",
      "Google, for Google Tag Manager and Google Analytics as described above.",
    ],
  },
  {
    id: "transfers",
    heading: "Where your information is processed",
    paragraphs: [
      "Trafficomm operates from India, and our team reads and responds to enquiries there. Our hosting, email and analytics providers operate internationally, so your information may be processed in countries other than the one you live in, including the United States and India.",
    ],
  },
  {
    id: "retention",
    heading: "How long we keep it",
    paragraphs: [
      "The website does not keep form submissions in a database. When you submit a form, the details are delivered to our team and are then held in our business email and records. To stop accidental double submissions, the site remembers a short fingerprint of a submission in memory for about 90 seconds. If a delivery fails, a short technical error message is written to our hosting provider's logs.",
      "We keep enquiry details for as long as we need them to respond to you and to manage any business relationship that follows. You can ask us to delete them at any time, as described below. Google Analytics data is kept under the retention settings of our analytics property.",
    ],
  },
  {
    id: "security",
    heading: "Security",
    paragraphs: [
      "The site is served only over HTTPS. Form handlers check and limit what they accept, and the credentials for the services that deliver submissions are held as server configuration, never in the pages your browser loads. No method of transmission or storage is completely secure, but we take reasonable steps to protect the information you send us.",
    ],
  },
  {
    id: "your-rights",
    heading: "Your choices and rights",
    paragraphs: [
      "You can ask us to tell you what personal information we hold about you, to correct it, to delete it, or to stop using it for a particular purpose. Depending on where you live, you may have further rights under laws such as India's Digital Personal Data Protection Act, the UK GDPR, the EU GDPR, the UAE and Saudi personal data protection laws, or US state privacy laws.",
      "To make a request, reply to any email you have received from us, or send a message through the contact page and say that it is a privacy request. We may need to confirm who you are before acting on it. If you are not satisfied with our response, you can complain to the data protection authority where you live.",
    ],
  },
  {
    id: "children",
    heading: "Children",
    paragraphs: ["This site is for businesses and professionals. It is not directed at children, and we do not knowingly collect information from them."],
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    paragraphs: ["When what we do with personal information changes, we update this page and the date at the top of it."],
  },
];
