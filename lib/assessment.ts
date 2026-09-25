/**
 * Shared between the client form and the API route so validation never drifts.
 *
 * Market and platform selection were removed before launch: they qualified the
 * lead at the cost of asking a stranger to fill in two chip grids, and the same
 * detail surfaces in the first conversation. Nothing downstream may require them.
 */
export const volumeOptions = ["Fewer than 25", "25–50", "50–100", "100–250", "250+"];

/**
 * Upper bounds. The form cannot produce anything near these; they exist because
 * the endpoint is public, and an unbounded string is a payload, not a name.
 */
export const limits = { name: 120, company: 160, email: 254, challenge: 2000 } as const;

export type AssessmentInput = {
  name: string;
  company: string;
  email: string;
  volume: string;
  challenge: string;
  intent: "assessment" | "call";
  /** Honeypot — must stay empty. */
  website?: string;
};

export type FieldErrors = Partial<Record<keyof AssessmentInput, string>>;

/**
 * One address, and nothing that separates or wraps addresses. The submitted email
 * becomes the notification's Reply-To, so permitting "," ";" "<" or ">" would let a
 * visitor turn one reply address into a list — the closest thing to header injection
 * a JSON email API still allows. Whitespace is already excluded, so CRLF cannot pass.
 */
const EMAIL = /^[^\s@,;<>"]+@[^\s@,;<>"]+\.[^\s@,;<>"]{2,}$/;
const FREE_MAIL = /@(gmail|yahoo|hotmail|outlook|live|icloud|aol|proton(mail)?)\./i;

export function validateAssessment(input: Partial<AssessmentInput>): FieldErrors {
  const e: FieldErrors = {};
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const name = str(input.name);
  if (name.length < 2) e.name = "Please enter your name.";
  else if (name.length > limits.name) e.name = `Please keep this under ${limits.name} characters.`;

  const company = str(input.company);
  if (company.length < 2) e.company = "Please enter your company.";
  else if (company.length > limits.company) e.company = `Please keep this under ${limits.company} characters.`;

  const email = str(input.email);
  if (!EMAIL.test(email) || email.length > limits.email) e.email = "Please enter a valid email address.";
  else if (FREE_MAIL.test(email)) e.email = "Please use your work email.";

  if (!volumeOptions.includes(str(input.volume))) e.volume = "Select your monthly campaign volume.";

  if (str(input.challenge).length > limits.challenge) e.challenge = `Please keep this under ${limits.challenge.toLocaleString()} characters.`;

  // `intent` decides the subject line, so an unexpected value is rejected rather than coerced.
  if (input.intent !== undefined && input.intent !== "assessment" && input.intent !== "call") e.intent = "Invalid request.";

  return e;
}

/**
 * Where the enquiry came from — useful for attribution, and none of it is
 * trusted: the client supplies it, so every value is clamped and pattern-checked
 * server-side before it reaches an email. Deliberately excludes user agent, IP
 * and anything else that identifies the device rather than the campaign.
 */
export type SubmissionContext = {
  /** Path on this site the form was submitted from, e.g. "/contact". */
  path?: string;
  /** The external page that linked here, if the browser disclosed one. */
  referrer?: string;
  utm?: Partial<Record<"source" | "medium" | "campaign" | "term" | "content", string>>;
};

export const utmKeys = ["source", "medium", "campaign", "term", "content"] as const;

const CONTEXT_MAX = 300;
/** Printable single-line text only: a newline in an attribution value has no legitimate meaning. */
const clean = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.replace(/[\r\n\t]+/g, " ").trim().slice(0, CONTEXT_MAX);
  return trimmed || undefined;
};

/** Returns only the fields that survive validation; anything else is dropped, not reported. */
export function sanitizeContext(input: unknown): SubmissionContext {
  if (!input || typeof input !== "object") return {};
  const raw = input as Record<string, unknown>;
  const out: SubmissionContext = {};

  const path = clean(raw.path);
  // Site-relative paths only, so the email cannot be made to display an arbitrary URL.
  if (path && /^\/[\w\-/.]*$/.test(path)) out.path = path;

  const referrer = clean(raw.referrer);
  if (referrer && /^https?:\/\//i.test(referrer)) out.referrer = referrer;

  if (raw.utm && typeof raw.utm === "object") {
    const utm: NonNullable<SubmissionContext["utm"]> = {};
    for (const key of utmKeys) {
      const value = clean((raw.utm as Record<string, unknown>)[key]);
      if (value) utm[key] = value;
    }
    if (Object.keys(utm).length) out.utm = utm;
  }

  return out;
}
