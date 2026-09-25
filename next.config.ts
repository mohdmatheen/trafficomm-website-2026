import type { NextConfig } from "next";

const indexable = process.env.SITE_INDEXABLE === "true";
/** The *.vercel.app alias Vercel gives the production deployment, e.g. trafficomm-website-2026.vercel.app. */
const projectAlias = process.env.VERCEL_PROJECT_PRODUCTION_URL;

const nextConfig: NextConfig = {
  // The parent folder has its own lockfile; pin the workspace root to this app.
  turbopack: { root: import.meta.dirname },
  // noindex, nofollow on every response (pages, assets, API) unless the
  // deployment explicitly opts in with SITE_INDEXABLE=true (see lib/deployment.ts).
  async headers() {
    if (indexable) return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  /**
   * The production deployment answers on two hostnames: www.trafficomm.com and the
   * Vercel project alias. Both served identical indexable HTML, which is a duplicate
   * of the entire site on a domain nobody should be ranking. Canonical tags now point
   * at www, and this closes the gap by moving the alias there permanently.
   *
   * Scoped by exact Host, so it can only ever affect requests that arrive at that one
   * hostname — preview deployments have their own branch and hash URLs and are untouched.
   */
  async redirects() {
    if (!indexable || !projectAlias) return [];
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: projectAlias }],
        destination: "https://www.trafficomm.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
