import { utmKeys, type SubmissionContext } from "./assessment";

/**
 * Email delivery for assessment submissions.
 *
 * Every value that identifies an account or authorises a request comes from the
 * environment. Nothing in this file is a credential, and no variable here is
 * prefixed NEXT_PUBLIC_, so none of it can reach the browser bundle: this module
 * is imported only by the API route, which runs server-side.
 *
 * The recipient and sender come from the environment and are never read from the
 * request, so a visitor cannot redirect a notification or use the endpoint as a
 * relay. The only visitor-controlled address in the message is Reply-To, which is
 * the work email they submitted and which validation has already constrained to a
 * single address with no whitespace.
 *
 * The recipient address is an environment variable rather than a constant on
 * purpose — this repository is public, and a business address committed to it
 * would be harvested.
 */

/** The delivered record. Market and platform were removed pre-launch and must never return. */
export type AssessmentRecord = {
  type: "operations_assessment" | "call_request";
  name: string;
  company: string;
  email: string;
  campaignsPerMonth: string;
  challenge: string;
  submittedAt: string;
  /** "preview" marks a test submission so it is never mistaken for a real lead. */
  environment: "production" | "preview" | "development";
  context?: SubmissionContext;
};

export type AssessmentEmail = {
  subject: string;
  /** Plain-text body. Always sent, and the only body some clients will render. */
  text: string;
  /** HTML body. A progressive enhancement over `text`, never a replacement. */
  html: string;
  /** The visitor's work email, so a reply in the inbox goes straight to them. */
  replyTo: string;
};

/**
 * Strips CR/LF and clamps length. Both supported providers take JSON, so a
 * newline cannot forge a header there — but a subject is a header, and treating
 * one field as untrusted while treating the next as safe is how that stops
 * being true after a provider change.
 */
const headerSafe = (value: string, max = 180) => value.replace(/[\r\n]+/g, " ").trim().slice(0, max);

export function assessmentSubject(record: AssessmentRecord): string {
  const kind = record.type === "call_request" ? "Call Request" : "Assessment Request";
  const prefix = record.environment === "production" ? "" : `[${record.environment}] `;
  const company = record.company.trim();
  // Validation requires a company, so the suffix is a fallback rather than a branch we expect.
  return headerSafe(`${prefix}New Trafficomm ${kind}${company ? ` — ${company}` : ""}`);
}

/** Label/value pairs in the order they appear in both bodies. */
function fields(record: AssessmentRecord): [string, string][] {
  return [
    ["Name", record.name],
    ["Company", record.company],
    ["Work email", record.email],
    ["Campaign volume (per month)", record.campaignsPerMonth],
  ];
}

/** Attribution, omitted entirely when the visitor arrived with none. */
function attribution(record: AssessmentRecord): [string, string][] {
  const c = record.context;
  const rows: [string, string][] = [];
  if (c?.path) rows.push(["Submitted from", c.path]);
  if (c?.referrer) rows.push(["Referred by", c.referrer]);
  for (const key of utmKeys) {
    const value = c?.utm?.[key];
    if (value) rows.push([`utm_${key}`, value]);
  }
  return rows;
}

const formatted = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : `${d.toUTCString().replace(" GMT", "")} UTC`;
};

export function assessmentTextBody(record: AssessmentRecord): string {
  const rows = fields(record);
  const extra = attribution(record);
  const width = Math.max(...[...rows, ...extra].map(([label]) => label.length));
  const lines = [
    record.type === "call_request" ? "New call request from the Trafficomm website." : "New assessment request from the Trafficomm website.",
    "",
    ...rows.map(([label, value]) => `${label.padEnd(width)}  ${value}`),
    "",
    "Biggest operational challenge",
    record.challenge ? indent(record.challenge) : "  (not provided — this field is optional)",
    "",
    `Submitted  ${formatted(record.submittedAt)}`,
  ];
  if (extra.length) lines.push("", ...extra.map(([label, value]) => `${label.padEnd(width)}  ${value}`));
  lines.push("", `Reply to this email to answer ${record.email} directly.`);
  if (record.environment !== "production") {
    lines.unshift(`NOTE: sent from the ${record.environment} environment. This is a test submission, not a real lead.`, "");
  }
  return lines.join("\n");
}

const indent = (text: string) =>
  text
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");

/** HTML escape. Every interpolated value below is visitor input and passes through this. */
const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/**
 * Trafficomm's palette, inline. Email clients strip <style> blocks and external
 * stylesheets, and many block remote images, so this uses tables, inline styles
 * and no images at all — the message has to be legible in Outlook, not elegant
 * in a browser.
 */
const ink = "#0c0c0d";
const paper = "#f6f6f3";
const steel = "#5d5d64";
const signal = "#c42b27";
const line = "#e2e2dd";
const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

/**
 * Two columns, and the label wraps. An earlier version held the label on one line,
 * which overflowed a 375px phone by 150px — these are read on a phone as often as
 * on a desk, and an inbox has no horizontal scroll to rescue it. `word-break` is
 * there for long referrer URLs for the same reason.
 */
function row(label: string, value: string, isLink = false): string {
  const shown = isLink ? `<a href="mailto:${esc(value)}" style="color:${signal};text-decoration:none">${esc(value)}</a>` : esc(value);
  return `<tr>
      <td width="38%" style="width:38%;padding:10px 0;border-bottom:1px solid ${line};font:400 11px/1.5 ${mono};letter-spacing:0.06em;text-transform:uppercase;color:${steel};vertical-align:top">${esc(label)}</td>
      <td style="padding:10px 0 10px 14px;border-bottom:1px solid ${line};font:400 15px/1.5 ${sans};color:${ink};vertical-align:top;word-break:break-word">${shown}</td>
    </tr>`;
}

export function assessmentHtmlBody(record: AssessmentRecord): string {
  const heading = record.type === "call_request" ? "Call request" : "Assessment request";
  const extra = attribution(record);
  const notice =
    record.environment !== "production"
      ? `<tr><td style="padding:14px 20px;background:#fff4f4;border:1px solid ${signal};font:400 13px/1.5 ${sans};color:${signal}">
          Sent from the <strong>${esc(record.environment)}</strong> environment — a test submission, not a real lead.
        </td></tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(assessmentSubject(record))}</title></head>
<body style="margin:0;padding:16px 10px;background:${paper};font-family:${sans};-webkit-font-smoothing:antialiased">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;margin:0 auto">
    ${notice}
    <tr><td style="height:${notice ? "16px" : "0"}"></td></tr>
    <tr><td style="background:#ffffff;border:1px solid ${line};padding:26px 20px">
      <p style="margin:0;font:400 11px/1.4 ${mono};letter-spacing:0.14em;text-transform:uppercase;color:${signal}">Trafficomm &middot; ${esc(heading)}</p>
      <h1 style="margin:14px 0 0;font:600 24px/1.25 ${sans};word-break:break-word;letter-spacing:-0.02em;color:${ink}">${esc(record.company)}</h1>
      <p style="margin:8px 0 0;font:400 14px/1.5 ${sans};color:${steel}">${esc(formatted(record.submittedAt))}</p>

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:26px;border-collapse:collapse;border-top:1px solid ${line}">
        ${fields(record)
          .map(([label, value]) => row(label, value, label === "Work email"))
          .join("\n        ")}
      </table>

      <p style="margin:26px 0 0;font:400 11px/1.4 ${mono};letter-spacing:0.08em;text-transform:uppercase;color:${steel}">Biggest operational challenge</p>
      <div style="margin-top:10px;padding:16px 18px;background:${paper};border-left:2px solid ${signal};font:400 15px/1.6 ${sans};color:${ink};white-space:pre-wrap">${
        record.challenge ? esc(record.challenge) : `<span style="color:${steel}">Not provided — this field is optional.</span>`
      }</div>
${
  extra.length
    ? `
      <p style="margin:26px 0 0;font:400 11px/1.4 ${mono};letter-spacing:0.08em;text-transform:uppercase;color:${steel}">Attribution</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:6px;border-collapse:collapse;border-top:1px solid ${line}">
        ${extra.map(([label, value]) => row(label, value)).join("\n        ")}
      </table>`
    : ""
}
      <p style="margin:24px 0 0;padding-top:18px;border-top:1px solid ${line};font:400 14px/1.6 ${sans};color:${steel};word-break:break-word">
        Reply to this email to answer <a href="mailto:${esc(record.email)}" style="color:${signal};text-decoration:none">${esc(record.email)}</a> directly.
      </p>
    </td></tr>
    <tr><td style="padding:16px 4px 0;font:400 12px/1.5 ${sans};color:${steel}">Sent by the Trafficomm website.</td></tr>
  </table>
</body></html>`;
}

export function buildAssessmentEmail(record: AssessmentRecord): AssessmentEmail {
  return {
    subject: assessmentSubject(record),
    text: assessmentTextBody(record),
    html: assessmentHtmlBody(record),
    replyTo: record.email,
  };
}

/** Both providers are a single authenticated JSON POST, so neither needs an SDK. */
export type EmailProvider = "postmark" | "resend";

export type EmailConfig = { provider: EmailProvider; apiKey: string; from: string; to: string };

/** Only the variables this module reads, so a caller can pass a literal in a test. */
export type EmailEnv = Record<string, string | undefined>;

/**
 * Returns null when email delivery is not configured, which is not an error —
 * the webhook may be the chosen channel instead.
 */
export function assessmentEmailConfig(env: EmailEnv = process.env): EmailConfig | null {
  const provider = env.ASSESSMENT_EMAIL_PROVIDER?.trim().toLowerCase();
  const apiKey = env.ASSESSMENT_EMAIL_API_KEY?.trim();
  const from = env.ASSESSMENT_EMAIL_FROM?.trim();
  const to = env.ASSESSMENT_EMAIL_TO?.trim();
  if (!provider && !apiKey && !from && !to) return null;
  if (provider !== "postmark" && provider !== "resend") {
    throw new Error(`ASSESSMENT_EMAIL_PROVIDER must be "postmark" or "resend" (received ${provider ? `"${provider}"` : "nothing"}).`);
  }
  // A half-configured provider must fail loudly at delivery, not send nothing quietly.
  const missing = [
    ["ASSESSMENT_EMAIL_API_KEY", apiKey],
    ["ASSESSMENT_EMAIL_FROM", from],
    ["ASSESSMENT_EMAIL_TO", to],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);
  if (missing.length) throw new Error(`Email delivery is partly configured; missing ${missing.join(", ")}.`);
  return { provider, apiKey: apiKey!, from: from!, to: to! };
}

const endpoints: Record<EmailProvider, { url: string; headers: (key: string) => Record<string, string>; body: (c: EmailConfig, e: AssessmentEmail) => unknown }> = {
  postmark: {
    url: "https://api.postmarkapp.com/email",
    headers: (key) => ({ "Content-Type": "application/json", Accept: "application/json", "X-Postmark-Server-Token": key }),
    body: (c, e) => ({ From: c.from, To: c.to, ReplyTo: e.replyTo, Subject: e.subject, HtmlBody: e.html, TextBody: e.text, MessageStream: "outbound" }),
  },
  resend: {
    url: "https://api.resend.com/emails",
    headers: (key) => ({ "Content-Type": "application/json", Authorization: `Bearer ${key}` }),
    body: (c, e) => ({ from: c.from, to: [c.to], reply_to: e.replyTo, subject: e.subject, html: e.html, text: e.text }),
  },
};

/**
 * The exact request each provider's documented API expects. Kept pure and
 * exported so the request shape is covered by tests without a live account:
 * a typo in a header name or a field name is the kind of mistake that only
 * shows up as a silently undelivered lead.
 */
export function buildProviderRequest(config: EmailConfig, record: AssessmentRecord) {
  const provider = endpoints[config.provider];
  return {
    url: provider.url,
    headers: provider.headers(config.apiKey),
    body: provider.body(config, buildAssessmentEmail(record)),
  };
}

/** Throws on any non-2xx so the caller can refuse the submission rather than claim success. */
export async function sendAssessmentEmail(config: EmailConfig, record: AssessmentRecord): Promise<void> {
  const { url, headers, body } = buildProviderRequest(config, record);
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body), signal: AbortSignal.timeout(8000) });
  if (!res.ok) {
    // The provider's message is useful in server logs; it never reaches the visitor.
    const detail = await res.text().catch(() => "");
    throw new Error(`${config.provider} responded ${res.status}${detail ? `: ${detail.slice(0, 300)}` : ""}`);
  }
}
