/**
 * Hostname redirects for the production deployment.
 *
 * Lives here rather than inline in next.config.ts so it can be tested: the config
 * file uses `import.meta.dirname`, which the test runner's module transform cannot
 * load. This module imports nothing, so it is safe for both.
 *
 * History, because it cost an outage: the rule below originally matched on
 * VERCEL_PROJECT_PRODUCTION_URL. That variable holds the project's *production
 * domain*, which Vercel sets to the custom domain once one is assigned — so it
 * resolved to www.trafficomm.com, not the vercel.app alias, and the rule became
 * "redirect www.trafficomm.com to www.trafficomm.com". Every path on production
 * returned 308 to itself (ERR_TOO_MANY_REDIRECTS). Both hosts are literals now.
 */

/** The canonical host. This one serves the site; it is never a redirect source. */
export const CANONICAL_HOST: string = "www.trafficomm.com";

/** The Vercel-generated alias for the production deployment, which serves a duplicate. */
export const PRODUCTION_ALIAS: string = "trafficomm-website-2026.vercel.app";

/** A host redirect whose source and destination are the same host is an infinite loop. */
export const aliasRedirectIsSafe = PRODUCTION_ALIAS !== CANONICAL_HOST;

export type HostRedirect = {
  source: string;
  has: { type: "host"; value: string }[];
  destination: string;
  permanent: boolean;
};

/**
 * Matched on one exact literal host, so it cannot fire for the canonical domain, for
 * the apex (Vercel redirects that at the domain level), or for a preview — previews
 * answer on their own branch and hash URLs. Returns nothing unless the deployment is
 * the indexable production one.
 */
export function hostRedirects(indexable: boolean): HostRedirect[] {
  if (!indexable || !aliasRedirectIsSafe) return [];
  return [
    {
      source: "/:path*",
      has: [{ type: "host", value: PRODUCTION_ALIAS }],
      destination: `https://${CANONICAL_HOST}/:path*`,
      permanent: true,
    },
  ];
}
