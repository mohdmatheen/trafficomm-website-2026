import { NextResponse } from "next/server";
import { MARKETS } from "@/lib/labs/model";

/**
 * FX proxy for the capacity calculator.
 *
 * Kept server-side so the provider can be swapped (or given a key) without
 * touching the client, and so the response can be cached at the edge rather
 * than once per visitor. It only ever returns a rate: on any provider failure
 * it answers with the workbook snapshot and says so, because the calculator
 * must not depend on a third party being up.
 */
export const revalidate = 43200; // 12h — see lib/labs/currency.ts.

const SNAPSHOT_DATE = "2026-09-25";
const SUPPORTED = new Set(Object.values(MARKETS).map((m) => m.currency));

function snapshotFor(from: string) {
  const market = Object.values(MARKETS).find((m) => m.currency === from);
  return market?.fallbackUsdRate ?? null;
}

export async function GET(request: Request) {
  const from = (new URL(request.url).searchParams.get("from") || "").toUpperCase();
  if (!SUPPORTED.has(from as "SAR" | "AED")) {
    return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });
  }
  const snapshot = snapshotFor(from)!;

  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`, {
      next: { revalidate },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { result?: string; rates?: Record<string, number>; time_last_update_utc?: string };
    const rate = data.rates?.USD;
    if (data.result !== "success" || typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0) {
      throw new Error("unexpected payload");
    }
    const asOf = data.time_last_update_utc ? new Date(data.time_last_update_utc).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
    return NextResponse.json({ from, to: "USD", rate, asOf, source: "live" });
  } catch {
    return NextResponse.json({ from, to: "USD", rate: snapshot, asOf: SNAPSHOT_DATE, source: "fallback" });
  }
}
