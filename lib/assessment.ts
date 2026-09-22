import { markets } from "@/data/site";
import { platforms } from "@/data/platforms";

/** Shared between the client form and the API route so validation never drifts. */
export const marketOptions = [...markets.map((m) => m.name), "Other"];
export const platformOptions = platforms.map((p) => p.name);
export const volumeOptions = ["Fewer than 25", "25–50", "50–100", "100–250", "250+"];

export type AssessmentInput = {
  name: string;
  company: string;
  email: string;
  markets: string[];
  platforms: string[];
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
  if (!Array.isArray(input.markets) || input.markets.length === 0) e.markets = "Select at least one market.";
  else if (input.markets.some((m) => !marketOptions.includes(m))) e.markets = "Invalid market selection.";
  if (Array.isArray(input.platforms) && input.platforms.some((p) => !platformOptions.includes(p))) e.platforms = "Invalid platform selection.";
  if (!volumeOptions.includes(str(input.volume))) e.volume = "Select your monthly campaign volume.";
  if (str(input.challenge).length > 2000) e.challenge = "Please keep this under 2,000 characters.";
  return e;
}
