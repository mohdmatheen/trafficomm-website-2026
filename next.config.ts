import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The parent folder has its own lockfile; pin the workspace root to this app.
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
