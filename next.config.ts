import type { NextConfig } from "next";
import { hostRedirects } from "./lib/host-redirects";

const indexable = process.env.SITE_INDEXABLE === "true";

const nextConfig: NextConfig = {
  // The parent folder has its own lockfile; pin the workspace root to this app.
  turbopack: { root: import.meta.dirname },
  // noindex, nofollow on every response (pages, assets, API) unless the
  // deployment explicitly opts in with SITE_INDEXABLE=true (see lib/deployment.ts).
  async headers() {
    if (indexable) return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  // The production deployment also answers on its vercel.app alias, which serves a
  // full indexable copy of the site. See lib/host-redirects.ts for the rule and for
  // why it is built from literal hostnames.
  async redirects() {
    return hostRedirects(indexable);
  },
};

export default nextConfig;
