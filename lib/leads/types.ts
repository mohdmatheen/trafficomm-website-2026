/**
 * The lead lifecycle.
 *
 * The transition map is the authority on what may follow what, and it is applied
 * server-side on every status change. The dashboard uses the same map to decide
 * which buttons to render, but that is a convenience: a request that names an
 * illegal transition is rejected by the API whatever the UI offered.
 */

export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "OPPORTUNITY",
  "PROPOSAL",
  "WON",
  "LOST",
  "INVALID",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_SOURCES = ["website_assessment", "website_call", "website_labs", "linkedin_leadgen"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const SOURCE_LABELS: Record<LeadSource, string> = {
  website_assessment: "Website — assessment",
  website_call: "Website — call request",
  website_labs: "Labs — delivery estimate",
  linkedin_leadgen: "LinkedIn Lead Gen",
};

/**
 * Permitted transitions.
 *
 * INVALID is reachable from anywhere before a deal is closed, because the
 * discovery that an enquiry was never real does not arrive on a schedule. WON,
 * LOST and INVALID are terminal: reopening a closed lead would make the
 * conversion record ambiguous, and a second enquiry from the same company is a
 * second lead.
 *
 * QUALIFIED is deliberately reachable only from NEW or CONTACTED. It is the
 * status that will fire a LinkedIn conversion, so it must be a decision taken
 * once on the way through, not a state a lead can drift back into.
 */
export const ALLOWED_TRANSITIONS: Record<LeadStatus, readonly LeadStatus[]> = {
  NEW: ["CONTACTED", "QUALIFIED", "INVALID"],
  CONTACTED: ["QUALIFIED", "INVALID"],
  QUALIFIED: ["OPPORTUNITY", "LOST", "INVALID"],
  OPPORTUNITY: ["PROPOSAL", "LOST"],
  PROPOSAL: ["WON", "LOST"],
  WON: [],
  LOST: [],
  INVALID: [],
};

export const canTransition = (from: LeadStatus, to: LeadStatus): boolean =>
  (ALLOWED_TRANSITIONS[from] as readonly string[]).includes(to);

export const isLeadStatus = (value: unknown): value is LeadStatus =>
  typeof value === "string" && (LEAD_STATUSES as readonly string[]).includes(value);

/**
 * How a status reads commercially. The dashboard groups by this so a raw lead,
 * a qualified lead, an opportunity and an invalid enquiry are distinguishable at
 * a glance rather than by reading eight similar words.
 */
export const STATUS_GROUP: Record<LeadStatus, "raw" | "qualified" | "opportunity" | "closed" | "invalid"> = {
  NEW: "raw",
  CONTACTED: "raw",
  QUALIFIED: "qualified",
  OPPORTUNITY: "opportunity",
  PROPOSAL: "opportunity",
  WON: "closed",
  LOST: "closed",
  INVALID: "invalid",
};

export type Lead = {
  id: string;
  source: LeadSource;
  externalLeadId: string | null;
  leadUrn: string | null;
  idempotencyKey: string;
  deliveryState: "delivered" | "recovered";
  firstName: string | null;
  lastName: string | null;
  email: string;
  company: string | null;
  jobTitle: string | null;
  countryCode: string | null;
  liFatId: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  referrer: string | null;
  landingPath: string | null;
  firstTouchAt: string | null;
  campaignUrn: string | null;
  creativeUrn: string | null;
  formUrn: string | null;
  requirement: string | null;
  campaignVolume: string | null;
  isTestLead: boolean;
  status: LeadStatus;
  submittedAt: string;
  qualifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadStatusChange = {
  id: number;
  leadId: string;
  fromStatus: LeadStatus | null;
  toStatus: LeadStatus;
  changedBy: string;
  changedAt: string;
  note: string | null;
};

export type DispatchState = "pending" | "sent" | "failed" | "abandoned";
export type ConversionType = "LEAD" | "QUALIFIED_LEAD";
