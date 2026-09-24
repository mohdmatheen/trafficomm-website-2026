/**
 * Email delivery for assessment submissions.
 *
 * Every value that identifies an account or authorises a request comes from the
 * environment. Nothing in this file is a credential, and no variable here is
 * prefixed NEXT_PUBLIC_, so none of it can reach the browser bundle: this module
 * is imported only by the API route, which runs server-side.
 *
 * The recipient address is an environment variable rather than a constant on
 * purpose — this repository is public, and a business address committed to it
 * would be harvested.
 *
 * Bodies are plain text, not HTML. A lead notification has no need for markup,
 * and plain text removes the injection surface that interpolating a stranger's
 * free-text answer into HTML would create.
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
};

export type AssessmentEmail = {
  subject: string;
  text: string;
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
  return headerSafe(`${prefix}New Trafficomm ${kind} — ${record.company}`);
}

export function assessmentTextBody(record: AssessmentRecord): string {
  const rows: [string, string][] = [
    ["Name", record.name],
    ["Company", record.company],
    ["Work email", record.email],
    ["Campaign volume (per month)", record.campaignsPerMonth],
  ];
  const width = Math.max(...rows.map(([label]) => label.length));
  const lines = [
    record.type === "call_request" ? "New call request from the Trafficomm website." : "New assessment request from the Trafficomm website.",
    "",
    ...rows.map(([label, value]) => `${label.padEnd(width)}  ${value}`),
    "",
    "Biggest operational challenge",
    record.challenge ? indent(record.challenge) : "  (not provided — this field is optional)",
    "",
    `Submitted  ${record.submittedAt}`,
    `Reply to this email to answer ${record.email} directly.`,
  ];
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

export function buildAssessmentEmail(record: AssessmentRecord): AssessmentEmail {
  return { subject: assessmentSubject(record), text: assessmentTextBody(record), replyTo: record.email };
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
    body: (c, e) => ({ From: c.from, To: c.to, ReplyTo: e.replyTo, Subject: e.subject, TextBody: e.text, MessageStream: "outbound" }),
  },
  resend: {
    url: "https://api.resend.com/emails",
    headers: (key) => ({ "Content-Type": "application/json", Authorization: `Bearer ${key}` }),
    body: (c, e) => ({ from: c.from, to: [c.to], reply_to: e.replyTo, subject: e.subject, text: e.text }),
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
