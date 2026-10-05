/**
 * Delivery-estimate requests from the AdOps Capacity calculator.
 *
 * The visitor has already described their operation to the calculator, so the
 * form asks for contact details and nothing else. The analysis travels with the
 * submission — that is the point of the flow, and it is why the context is
 * allowed here when it is not allowed in analytics: this is an intentional,
 * explicit request for Trafficomm to look at these figures.
 *
 * Salary inputs are the exception. A team's pay is the most sensitive thing the
 * calculator holds and Trafficomm does not need it to scope delivery, so the
 * context carries cost *outputs* and never the per-role figures behind them.
 */

export type LabsLeadInput = {
  name?: string;
  company?: string;
  email?: string;
  role?: string;
  phone?: string;
  /** Honeypot. A real visitor never sees it. */
  website?: string;
  context?: unknown;
};

/** The analysis attached to a submission. Assembled field by field — never spread from the body. */
export type LabsLeadContext = {
  methodologyVersion: string;
  market: string;
  currency: string;
  fxRate: number;
  fxSource: string;
  fxAsOf: string;
  businessType: string;
  headcount: number;
  campaignsPerMonth: number;
  activeClients: number;
  marketsManaged: number;
  platforms: string[];
  complexityIndex: number;
  utilization: number;
  workloadHours: number;
  executionHours: number;
  externalizableHours: number;
  externalizableFte: number;
  efficiencyScore: number;
  loadedMonthlyCost: number;
  executionCost: number;
  salaryBasis: "market-estimate" | "custom";
  workloadBasis: "quick-estimate" | "detailed";
  externalAllocation: number | null;
  reportingAutomation: number | null;
  leadScore: number;
  leadClassification: string;
  capturedAt: string;
};

export type LabsLeadRecord = {
  type: "labs_delivery_estimate";
  tool: "adops-capacity";
  name: string;
  company: string;
  email: string;
  role: string;
  phone: string;
  submittedAt: string;
  environment: string;
  context: LabsLeadContext;
};

export type LabsLeadErrors = Partial<Record<"name" | "company" | "email" | "role" | "phone", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Free inboxes are accepted — plenty of small agencies use them — but flagged for routing. */
const FREE_DOMAINS = new Set(["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "live.com", "aol.com", "proton.me", "protonmail.com"]);

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Messages name what to do, not what went wrong. */
export function validateLabsLead(input: LabsLeadInput): LabsLeadErrors {
  const errors: LabsLeadErrors = {};
  const name = clean(input.name);
  const company = clean(input.company);
  const email = clean(input.email);

  if (name.length < 2) errors.name = "Enter your name so we know who to reply to.";
  if (company.length < 2) errors.company = "Enter your company or agency name.";
  if (!email) errors.email = "Enter your work email so we can send the estimate.";
  else if (!EMAIL.test(email)) errors.email = "Check the email address — it looks incomplete.";
  if (clean(input.phone).length > 40) errors.phone = "That phone number looks too long.";
  if (clean(input.role).length > 120) errors.role = "Shorten the role to under 120 characters.";
  return errors;
}

export const isFreeEmailDomain = (email: string) => FREE_DOMAINS.has(email.split("@")[1]?.toLowerCase() ?? "");

const num = (v: unknown, fallback = 0) => (typeof v === "number" && Number.isFinite(v) ? v : fallback);
const str = (v: unknown, max = 60) => clean(v, max);

/**
 * Rebuilds the context from a submitted payload, field by field with a known
 * type for each. Anything the client invents is dropped, and no salary key
 * exists for a per-role figure to arrive under.
 */
export function sanitizeLabsContext(input: unknown): LabsLeadContext {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const platforms = Array.isArray(raw.platforms) ? raw.platforms.filter((p): p is string => typeof p === "string").slice(0, 30).map((p) => p.slice(0, 40)) : [];
  const basis = raw.salaryBasis === "custom" ? "custom" : "market-estimate";
  const workload = raw.workloadBasis === "detailed" ? "detailed" : "quick-estimate";
  return {
    methodologyVersion: str(raw.methodologyVersion, 12) || "unknown",
    market: str(raw.market, 40),
    currency: str(raw.currency, 8),
    fxRate: num(raw.fxRate),
    fxSource: str(raw.fxSource, 16),
    fxAsOf: str(raw.fxAsOf, 24),
    businessType: str(raw.businessType, 40),
    headcount: num(raw.headcount),
    campaignsPerMonth: num(raw.campaignsPerMonth),
    activeClients: num(raw.activeClients),
    marketsManaged: num(raw.marketsManaged),
    platforms,
    complexityIndex: num(raw.complexityIndex),
    utilization: num(raw.utilization),
    workloadHours: num(raw.workloadHours),
    executionHours: num(raw.executionHours),
    externalizableHours: num(raw.externalizableHours),
    externalizableFte: num(raw.externalizableFte),
    efficiencyScore: num(raw.efficiencyScore),
    loadedMonthlyCost: num(raw.loadedMonthlyCost),
    executionCost: num(raw.executionCost),
    salaryBasis: basis,
    workloadBasis: workload,
    externalAllocation: typeof raw.externalAllocation === "number" ? num(raw.externalAllocation) : null,
    reportingAutomation: typeof raw.reportingAutomation === "number" ? num(raw.reportingAutomation) : null,
    leadScore: num(raw.leadScore),
    leadClassification: str(raw.leadClassification, 16),
    capturedAt: str(raw.capturedAt, 32) || new Date().toISOString(),
  };
}

const money = (n: number, currency: string) => `${currency} ${Math.round(n).toLocaleString("en-US")}`;
const hrs = (n: number) => `${Math.round(n).toLocaleString("en-US")} hrs/month`;
const pct = (n: number) => `${Math.round(n * 100)}%`;

/** Plain-text body. Scannable in an inbox without rendering HTML. */
export function labsLeadText(r: LabsLeadRecord): string {
  const c = r.context;
  const lines = [
    "TRAFFICOMM LABS — DELIVERY ESTIMATE REQUEST",
    "",
    `Name     ${r.name}`,
    `Company  ${r.company}`,
    `Email    ${r.email}${isFreeEmailDomain(r.email) ? "  (free email domain)" : ""}`,
    r.role ? `Role     ${r.role}` : null,
    r.phone ? `Phone    ${r.phone}` : null,
    "",
    "THE OPERATION THEY ANALYSED",
    `Market                 ${c.market} (${c.currency})`,
    `Business type          ${c.businessType}`,
    `Team                   ${c.headcount} people`,
    `Campaigns / month      ${c.campaignsPerMonth}`,
    `Clients / accounts     ${c.activeClients}`,
    `Markets managed        ${c.marketsManaged}`,
    `Platforms (${c.platforms.length})          ${c.platforms.join(", ") || "none selected"}`,
    "",
    "RESULTS",
    `Utilization            ${pct(c.utilization)}`,
    `Monthly workload       ${hrs(c.workloadHours)}`,
    `Execution hours        ${hrs(c.executionHours)}`,
    `Externalizable         ${hrs(c.externalizableHours)}  (${c.externalizableFte.toFixed(1)} FTE)`,
    `Complexity index       ${c.complexityIndex.toFixed(2)} / 5`,
    `Efficiency score       ${c.efficiencyScore} / 100`,
    `Loaded monthly cost    ${money(c.loadedMonthlyCost, c.currency)}  (~USD ${Math.round(c.loadedMonthlyCost * c.fxRate).toLocaleString("en-US")})`,
    `Execution cost         ${money(c.executionCost, c.currency)}  (~USD ${Math.round(c.executionCost * c.fxRate).toLocaleString("en-US")})`,
    "",
    "HOW THE FIGURES WERE PRODUCED",
    `Salaries               ${c.salaryBasis === "custom" ? "their own costs" : "Trafficomm market estimates"}`,
    `Workload               ${c.workloadBasis === "detailed" ? "entered directly" : "quick estimate"}`,
    c.externalAllocation !== null ? `Simulator externalization  ${pct(c.externalAllocation)}` : null,
    c.reportingAutomation !== null ? `Simulator reporting automation  ${pct(c.reportingAutomation)}` : null,
    `FX                     1 ${c.currency} = ${c.fxRate} USD (${c.fxSource}, ${c.fxAsOf})`,
    `Methodology            v${c.methodologyVersion}`,
    `Analysed at            ${c.capturedAt}`,
    "",
    "INTERNAL",
    `Lead score             ${c.leadScore} — ${c.leadClassification}`,
    `Environment            ${r.environment}`,
  ];
  return lines.filter((l): l is string => l !== null).join("\n");
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export function labsLeadHtml(r: LabsLeadRecord): string {
  const c = r.context;
  const row = (k: string, v: string) =>
    `<tr><td style="padding:6px 16px 6px 0;color:#5d5d64;font:13px/1.5 -apple-system,Segoe UI,sans-serif;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;color:#0c0c0d;font:13px/1.5 -apple-system,Segoe UI,sans-serif">${esc(v)}</td></tr>`;
  const section = (title: string, rows: string) =>
    `<h2 style="margin:26px 0 8px;font:600 12px/1.4 -apple-system,Segoe UI,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#85858c">${esc(title)}</h2><table style="border-collapse:collapse">${rows}</table>`;

  return `<div style="max-width:640px;margin:0 auto;padding:24px">
<h1 style="margin:0;font:600 19px/1.3 -apple-system,Segoe UI,sans-serif;color:#0c0c0d">Trafficomm Labs — delivery estimate request</h1>
<p style="margin:6px 0 0;color:#5d5d64;font:13px/1.5 -apple-system,Segoe UI,sans-serif">AdOps Capacity calculator · methodology v${esc(c.methodologyVersion)}</p>
${section("Contact", [row("Name", r.name), row("Company", r.company), row("Email", r.email + (isFreeEmailDomain(r.email) ? " (free domain)" : "")), r.role ? row("Role", r.role) : "", r.phone ? row("Phone", r.phone) : ""].join(""))}
${section("The operation they analysed", [row("Market", `${c.market} (${c.currency})`), row("Business type", c.businessType), row("Team", `${c.headcount} people`), row("Campaigns / month", String(c.campaignsPerMonth)), row("Clients / accounts", String(c.activeClients)), row("Markets managed", String(c.marketsManaged)), row("Platforms", c.platforms.join(", ") || "none selected")].join(""))}
${section("Results", [row("Utilization", pct(c.utilization)), row("Monthly workload", hrs(c.workloadHours)), row("Execution hours", hrs(c.executionHours)), row("Externalizable", `${hrs(c.externalizableHours)} (${c.externalizableFte.toFixed(1)} FTE)`), row("Complexity index", `${c.complexityIndex.toFixed(2)} / 5`), row("Efficiency score", `${c.efficiencyScore} / 100`), row("Loaded monthly cost", `${money(c.loadedMonthlyCost, c.currency)} (~USD ${Math.round(c.loadedMonthlyCost * c.fxRate).toLocaleString("en-US")})`), row("Execution cost", `${money(c.executionCost, c.currency)} (~USD ${Math.round(c.executionCost * c.fxRate).toLocaleString("en-US")})`)].join(""))}
${section("How the figures were produced", [row("Salaries", c.salaryBasis === "custom" ? "their own costs" : "Trafficomm market estimates"), row("Workload", c.workloadBasis === "detailed" ? "entered directly" : "quick estimate"), c.externalAllocation !== null ? row("Simulator externalization", pct(c.externalAllocation)) : "", c.reportingAutomation !== null ? row("Simulator reporting automation", pct(c.reportingAutomation)) : "", row("FX", `1 ${c.currency} = ${c.fxRate} USD (${c.fxSource}, ${c.fxAsOf})`), row("Analysed at", c.capturedAt)].join(""))}
${section("Internal", [row("Lead score", `${c.leadScore} — ${c.leadClassification}`), row("Environment", r.environment)].join(""))}
</div>`;
}

export function buildLabsLeadEmail(r: LabsLeadRecord) {
  const c = r.context;
  return {
    subject: `Labs delivery estimate — ${r.company} (${c.market}, ${Math.round(c.externalizableHours)} hrs/mo externalizable)`,
    replyTo: r.email,
    text: labsLeadText(r),
    html: labsLeadHtml(r),
  };
}
