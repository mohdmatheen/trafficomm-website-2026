/**
 * FX service.
 *
 * Every monetary figure in the calculator is shown in the market's own currency
 * with a USD equivalent beneath it, so a rate is always needed and a missing
 * rate must never break the tool. The resolution order is:
 *
 *   1. a cached live rate, if one was fetched recently enough;
 *   2. a freshly fetched live rate;
 *   3. the workbook's 25 Sep 2026 snapshot (lib/labs/model.ts).
 *
 * The snapshot is the same number the prototype was signed off against, so a
 * failed fetch degrades to "slightly stale" rather than to "wrong" or "blank".
 * The provenance travels with the rate so the UI can say which one it used.
 */
import { MARKETS, type MarketCode } from "./model";

export type FxSource = "live" | "cache" | "fallback";

export type FxRate = {
  /** Units of USD per 1 unit of local currency. */
  rate: number;
  source: FxSource;
  /** When the rate was obtained. For the fallback this is the workbook snapshot date. */
  asOf: string;
};

/** The workbook's snapshot date, used as the fallback's provenance. */
const SNAPSHOT_DATE = "2026-09-25";
const TTL_MS = 12 * 60 * 60 * 1000; // Rates move slowly; twice a day is ample and keeps calls rare.

const cache = new Map<MarketCode, FxRate & { fetchedAt: number }>();

export function fallbackRate(market: MarketCode): FxRate {
  return { rate: MARKETS[market].fallbackUsdRate, source: "fallback", asOf: SNAPSHOT_DATE };
}

/**
 * Resolves a rate, never throwing. Callers render immediately with the fallback
 * and upgrade when this settles, so a slow or dead provider costs nothing.
 */
export async function getUsdRate(market: MarketCode, signal?: AbortSignal): Promise<FxRate> {
  const cached = cache.get(market);
  if (cached && Date.now() - cached.fetchedAt < TTL_MS) {
    return { rate: cached.rate, source: "cache", asOf: cached.asOf };
  }

  const currency = MARKETS[market].currency;
  try {
    const res = await fetch(`/api/labs/fx?from=${currency}`, { signal });
    if (!res.ok) throw new Error(`fx ${res.status}`);
    const data: unknown = await res.json();
    const rate = typeof data === "object" && data !== null && "rate" in data ? Number((data as { rate: unknown }).rate) : NaN;
    const asOf =
      typeof data === "object" && data !== null && "asOf" in data && typeof (data as { asOf: unknown }).asOf === "string"
        ? (data as { asOf: string }).asOf
        : new Date().toISOString().slice(0, 10);
    // A rate far from the snapshot is more likely a bad response than a real move.
    if (!Number.isFinite(rate) || rate <= 0 || Math.abs(rate / MARKETS[market].fallbackUsdRate - 1) > 0.25) {
      throw new Error("fx out of expected range");
    }
    cache.set(market, { rate, source: "live", asOf, fetchedAt: Date.now() });
    return { rate, source: "live", asOf };
  } catch {
    return fallbackRate(market);
  }
}

/** Test seam: clears the in-memory cache. */
export function __resetFxCache() {
  cache.clear();
}

const NBSP = " ";

/**
 * Money is rendered without decimals: these are planning figures in the
 * thousands, and cents imply a precision the model does not have. Sub-unit
 * amounts (an hourly rate, a cost per campaign) keep two decimals.
 */
export function formatMoney(amount: number, currency: string, opts?: { decimals?: number }): string {
  const decimals = opts?.decimals ?? (Math.abs(amount) < 1000 ? 2 : 0);
  const n = new Intl.NumberFormat("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(
    Number.isFinite(amount) ? amount : 0,
  );
  return `${currency}${NBSP}${n}`;
}

export function formatUsd(amount: number, rate: number, opts?: { decimals?: number }): string {
  return `≈${NBSP}${formatMoney(amount * rate, "USD", opts)}`;
}

export function formatHours(hours: number): string {
  const n = new Intl.NumberFormat("en-US", { maximumFractionDigits: hours < 10 ? 1 : 0 }).format(
    Number.isFinite(hours) ? hours : 0,
  );
  return `${n}${NBSP}hrs`;
}

export function formatPercent(fraction: number, decimals = 0): string {
  const v = Number.isFinite(fraction) ? fraction * 100 : 0;
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: decimals }).format(v)}%`;
}

export function formatNumber(n: number, decimals = 1): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: decimals }).format(Number.isFinite(n) ? n : 0);
}
