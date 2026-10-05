/**
 * Banding for analytics.
 *
 * Events describe the shape of an operation, never its figures. A band is the
 * most specific thing allowed to leave the browser: it is enough to tell a
 * 40-person agency from a 3-person team without transmitting either number, and
 * no salary or cost value is banded at all because none is ever sent.
 */
const band = (n: number, edges: number[]): string => {
  for (let i = 0; i < edges.length; i++) if (n <= edges[i]) return i === 0 ? `0-${edges[0]}` : `${edges[i - 1] + 1}-${edges[i]}`;
  return `${edges[edges.length - 1]}+`;
};

export const teamBand = (headcount: number) => band(headcount, [2, 5, 10, 25, 50]);
export const platformsBand = (count: number) => band(count, [2, 4, 6, 8]);
export const campaignVolumeBand = (n: number) => band(n, [25, 50, 100, 250, 500]);

export const utilizationBand = (u: number): string => {
  const pct = u * 100;
  if (pct < 60) return "<60%";
  if (pct < 75) return "60-75%";
  if (pct < 90) return "75-90%";
  if (pct <= 100) return "90-100%";
  return ">100%";
};

export const externalizableBand = (hours: number) => band(Math.round(hours), [100, 250, 500, 750, 1500]);
