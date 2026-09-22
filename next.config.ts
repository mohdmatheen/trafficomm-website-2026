import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The parent folder has its own lockfile; pin the workspace root to this app.
  turbopack: { root: import.meta.dirname },
  // noindex, nofollow on every response (pages, assets, API) unless the
  // deployment explicitly opts in with SITE_INDEXABLE=true (see lib/deployment.ts).
  async headers() {
    if (process.env.SITE_INDEXABLE === "true") return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
