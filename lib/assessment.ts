/**
 * Shared between the client form and the API route so validation never drifts.
 *
 * Market and platform selection were removed before launch: they qualified the
 * lead at the cost of asking a stranger to fill in two chip grids, and the same
 * detail surfaces in the first conversation. Nothing downstream may require them.
 */
export const volumeOptions = ["Fewer than 25", "25–50", "50–100", "100–250", "250+"];

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

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FREE_MAIL = /@(gmail|yahoo|hotmail|outlook|live|icloud|aol|proton(mail)?)\./i;

export function validateAssessment(input: Partial<AssessmentInput>): FieldErrors {
  const e: FieldErrors = {};
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  if (str(input.name).length < 2) e.name = "Please enter your name.";
  if (str(input.company).length < 2) e.company = "Please enter your company.";
  const email = str(input.email);
  if (!EMAIL.test(email)) e.email = "Please enter a valid email address.";
  else if (FREE_MAIL.test(email)) e.email = "Please use your work email.";
  if (!volumeOptions.includes(str(input.volume))) e.volume = "Select your monthly campaign volume.";
  if (str(input.challenge).length > 2000) e.challenge = "Please keep this under 2,000 characters.";
  return e;
}
