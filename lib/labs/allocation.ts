/**
 * Capacity reallocation.
 *
 * A scenario-planning aid, not a prediction. Trafficomm has no basis for knowing
 * how an agency would use released capacity, so the default split is labelled
 * illustrative everywhere it appears and the visitor can change it.
 *
 * Shares are held as percentages and converted to hours for display. Moving one
 * category redistributes the difference across the others in proportion to their
 * current size, so the total is always exactly 100% and no category can be
 * driven negative — six independent sliders fighting each other would be both
 * worse to use and capable of producing an impossible state.
 */

export type AllocationId = "strategy" | "newBusiness" | "analysis" | "creative" | "service" | "other";

export const ALLOCATION_CATEGORIES: { id: AllocationId; label: string; blurb: string }[] = [
  { id: "strategy", label: "Client strategy", blurb: "Strategic recommendations, account development and expansion conversations." },
  { id: "newBusiness", label: "New business & pitches", blurb: "Pitches, proposals and prospect development." },
  { id: "analysis", label: "Performance analysis", blurb: "Analysis, experimentation and optimisation planning." },
  { id: "creative", label: "Creative testing & learning", blurb: "Creative analysis, testing strategy and what the results teach." },
  { id: "service", label: "Client service", blurb: "Senior capacity for strategic communication and relationships." },
  { id: "other", label: "Team development / other", blurb: "Training, documentation, process work and everything else a team never gets to." },
];

/** An illustrative starting point, not a recommendation. Sums to 100. */
export const DEFAULT_ALLOCATION: Record<AllocationId, number> = {
  strategy: 25,
  newBusiness: 22,
  analysis: 18,
  creative: 15,
  service: 12,
  other: 8,
};

const IDS = ALLOCATION_CATEGORIES.map((c) => c.id);
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Number.isFinite(n) ? n : lo));

/**
 * Sets one category and absorbs the difference across the rest, in proportion to
 * their current shares. When the others are all at zero the remainder is spread
 * evenly, because proportional redistribution has nothing to work with.
 */
export function redistribute(current: Record<AllocationId, number>, id: AllocationId, next: number): Record<AllocationId, number> {
  const target = clamp(Math.round(next), 0, 100);
  const others = IDS.filter((k) => k !== id);
  const othersTotal = others.reduce((s, k) => s + current[k], 0);
  const remaining = 100 - target;

  const out = { ...current, [id]: target } as Record<AllocationId, number>;
  if (othersTotal <= 0) {
    const even = remaining / others.length;
    for (const k of others) out[k] = even;
  } else {
    for (const k of others) out[k] = (current[k] / othersTotal) * remaining;
  }

  // Round to whole percentages, then put any rounding remainder on the largest
  // untouched category so the total is exactly 100 rather than 99 or 101.
  for (const k of others) out[k] = Math.max(0, Math.round(out[k]));
  const drift = 100 - IDS.reduce((s, k) => s + out[k], 0);
  if (drift !== 0) {
    const biggest = others.reduce((a, b) => (out[a] >= out[b] ? a : b));
    out[biggest] = Math.max(0, out[biggest] + drift);
  }
  return out;
}

export type AllocationRow = { id: AllocationId; label: string; blurb: string; percent: number; hours: number };

/**
 * Converts shares to hours against the released capacity. The last row absorbs
 * the rounding remainder so the rows add up to the released total exactly — a
 * breakdown that does not sum to its own headline undermines the whole screen.
 */
export function allocationRows(shares: Record<AllocationId, number>, releasedHours: number): AllocationRow[] {
  const released = Math.max(0, Number.isFinite(releasedHours) ? releasedHours : 0);
  const rows = ALLOCATION_CATEGORIES.map((c) => ({
    ...c,
    percent: shares[c.id],
    hours: Math.round((shares[c.id] / 100) * released),
  }));
  const drift = Math.round(released) - rows.reduce((s, r) => s + r.hours, 0);
  if (drift !== 0 && rows.length) {
    const biggest = rows.reduce((a, b) => (a.hours >= b.hours ? a : b));
    biggest.hours = Math.max(0, biggest.hours + drift);
  }
  return rows;
}

export const allocationTotal = (shares: Record<AllocationId, number>) => IDS.reduce((s, k) => s + shares[k], 0);
