/**
 * AdOps Capacity — model types and market configuration.
 *
 * Source of truth: Trafficomm_AdOps_Capacity_Prototype_KSA_UAE_Final_Salary_Assumptions.xlsx
 * (sheets: Inputs, Engine, Market Benchmarks). Every default below is taken from
 * that workbook; nothing here is invented. See lib/labs/engine.ts for the
 * formulas and the cell references they correspond to.
 */

export type MarketCode = "SA" | "AE";
export type CurrencyCode = "SAR" | "AED" | "USD";

export type RoleId = "manager" | "senior" | "specialist" | "analytics" | "other";

export type ActivityCategory = "Execution" | "Measurement" | "Strategy" | "Administration";

export type ActivityId =
  | "setup"
  | "qa"
  | "reporting"
  | "extraction"
  | "pacing"
  | "optimization"
  | "creative"
  | "tracking"
  | "strategy"
  | "meetings";

/** The ten efficiency inputs scored 1–5 (Inputs!H13:H22). */
export type EfficiencyId =
  | "setupAutomation"
  | "reportingAutomation"
  | "extractionAutomation"
  | "budgetAlerts"
  | "naming"
  | "utm"
  | "sop"
  | "qaGovernance"
  | "trackingValidation"
  | "dashboardEfficiency";

export type Market = {
  code: MarketCode;
  /** Exactly as the workbook's Inputs!B5 writes it — the engine branches on this string. */
  name: "Saudi Arabia" | "UAE";
  label: string;
  currency: Exclude<CurrencyCode, "USD">;
  /** Workbook snapshot (Inputs!E33). Used only when the live FX service is unavailable. */
  fallbackUsdRate: number;
  /** Market Benchmarks sheet — monthly salary in the market's own currency. */
  salaries: Record<Exclude<RoleId, "other">, number>;
  /** Indicative range copy from Market Benchmarks!E, shown as provenance. */
  salaryBasis: Record<Exclude<RoleId, "other">, string>;
};

export const ROLES: { id: RoleId; label: string }[] = [
  { id: "manager", label: "Performance Manager" },
  { id: "senior", label: "Senior Specialist" },
  { id: "specialist", label: "Specialist / Executive" },
  { id: "analytics", label: "Reporting / Analytics" },
  { id: "other", label: "Other" },
];

/**
 * Market Benchmarks sheet, rows 3–10. The Inputs sheet carries the same numbers
 * in its C13:C16 formulas; its column K labels disagree and are stale (K16 also
 * duplicates K15), so the benchmark sheet and the formulas are treated as
 * authoritative. Saudi matches the set Trafficomm approved separately.
 */
export const MARKETS: Record<MarketCode, Market> = {
  SA: {
    code: "SA",
    name: "Saudi Arabia",
    label: "Saudi Arabia",
    currency: "SAR",
    fallbackUsdRate: 0.26659,
    salaries: { manager: 18000, senior: 14000, specialist: 10000, analytics: 8000 },
    salaryBasis: {
      manager: "Trafficomm approved default",
      senior: "Trafficomm approved default",
      specialist: "Trafficomm approved default",
      analytics: "Trafficomm approved default",
    },
  },
  AE: {
    code: "AE",
    name: "UAE",
    label: "United Arab Emirates",
    currency: "AED",
    fallbackUsdRate: 0.272257,
    salaries: { manager: 32500, senior: 24000, specialist: 21000, analytics: 22000 },
    salaryBasis: {
      manager: "Indicative range AED 25,000–40,000",
      senior: "Indicative range AED 20,000–28,000",
      specialist: "Indicative range AED 18,000–24,000",
      analytics: "Indicative range AED 18,000–26,000",
    },
  },
};

/**
 * Inputs!A21:D30. `externalizable` is the share of each activity's hours the
 * workbook treats as suitable for external delivery — it is an assumption in the
 * model, not an observation about any particular team.
 */
export const ACTIVITIES: { id: ActivityId; label: string; category: ActivityCategory; defaultHoursPerWeek: number; externalizable: number }[] = [
  { id: "setup", label: "Campaign setup / trafficking", category: "Execution", defaultHoursPerWeek: 45, externalizable: 0.9 },
  { id: "qa", label: "Campaign QA", category: "Execution", defaultHoursPerWeek: 20, externalizable: 0.9 },
  { id: "reporting", label: "Reporting production", category: "Execution", defaultHoursPerWeek: 35, externalizable: 0.9 },
  { id: "extraction", label: "Data extraction", category: "Execution", defaultHoursPerWeek: 15, externalizable: 0.95 },
  { id: "pacing", label: "Budget pacing", category: "Execution", defaultHoursPerWeek: 15, externalizable: 0.85 },
  { id: "optimization", label: "Routine optimization", category: "Execution", defaultHoursPerWeek: 40, externalizable: 0.7 },
  { id: "creative", label: "Creative coordination", category: "Execution", defaultHoursPerWeek: 15, externalizable: 0.7 },
  { id: "tracking", label: "Tracking / measurement", category: "Measurement", defaultHoursPerWeek: 10, externalizable: 0.6 },
  { id: "strategy", label: "Strategy & analysis", category: "Strategy", defaultHoursPerWeek: 45, externalizable: 0.1 },
  { id: "meetings", label: "Client / internal meetings", category: "Administration", defaultHoursPerWeek: 30, externalizable: 0.05 },
];

/** Inputs!G13:H22. Grouped as the Dashboard's efficiency components group them. */
export const EFFICIENCY_INPUTS: { id: EfficiencyId; label: string; component: "automation" | "standardization" | "reporting" | "governance" }[] = [
  { id: "setupAutomation", label: "Campaign setup automation", component: "automation" },
  { id: "reportingAutomation", label: "Reporting automation", component: "automation" },
  { id: "extractionAutomation", label: "Data extraction automation", component: "automation" },
  { id: "budgetAlerts", label: "Budget monitoring / alerts", component: "automation" },
  { id: "naming", label: "Naming conventions", component: "standardization" },
  { id: "utm", label: "UTM / taxonomy standards", component: "standardization" },
  { id: "sop", label: "SOP / workflow consistency", component: "standardization" },
  { id: "qaGovernance", label: "QA checklist / governance", component: "governance" },
  { id: "trackingValidation", label: "Tracking validation", component: "governance" },
  { id: "dashboardEfficiency", label: "Dashboard / reporting efficiency", component: "reporting" },
];

/**
 * Inputs!D4:E9 — operating assumptions. These are editable, so the type carries
 * `number` rather than the literal values: an `as const` here would narrow the
 * defaults into the input type and reject any other figure.
 */
export type OperatingAssumptions = {
  hoursPerWeek: number;
  weeksPerMonth: number;
  productiveAvailability: number;
  employerOverhead: number;
  avgCreativesPerCampaign: number;
  reportingComplexity: number;
};

export const OPERATING_DEFAULTS: OperatingAssumptions = {
  hoursPerWeek: 40,
  weeksPerMonth: 4.33,
  productiveAvailability: 0.85,
  employerOverhead: 0.2,
  avgCreativesPerCampaign: 8,
  reportingComplexity: 4,
};

export type BusinessType = "Agency" | "Brand / In-house";

export type CalculatorInput = {
  market: MarketCode;
  businessType: BusinessType;
  activeClients: number;
  campaignsPerMonth: number;
  marketsManaged: number;
  headcount: Record<RoleId, number>;
  /** Monthly cost per role in the market's currency. Defaults to the benchmark salary. */
  salaries: Record<RoleId, number>;
  hoursPerWeek: Record<ActivityId, number>;
  efficiency: Record<EfficiencyId, number>;
  operating: OperatingAssumptions;
};

/** The workbook's own default scenario (Inputs sheet as supplied). */
export function defaultInput(market: MarketCode = "SA"): CalculatorInput {
  const m = MARKETS[market];
  return {
    market,
    businessType: "Agency",
    activeClients: 25,
    campaignsPerMonth: 150,
    marketsManaged: 5,
    headcount: { manager: 1, senior: 2, specialist: 4, analytics: 1, other: 0 },
    salaries: { ...m.salaries, other: 0 },
    hoursPerWeek: Object.fromEntries(ACTIVITIES.map((a) => [a.id, a.defaultHoursPerWeek])) as Record<ActivityId, number>,
    efficiency: {
      setupAutomation: 2,
      reportingAutomation: 2,
      extractionAutomation: 3,
      budgetAlerts: 2,
      naming: 4,
      utm: 4,
      sop: 4,
      qaGovernance: 4,
      trackingValidation: 4,
      dashboardEfficiency: 3,
    },
    operating: { ...OPERATING_DEFAULTS },
  };
}
