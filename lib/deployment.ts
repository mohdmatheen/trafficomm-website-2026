/**
 * Deployment-environment rules (server-side).
 *
 * Indexing is OFF by default everywhere — local, Vercel preview, and the
 * Vercel "production" deployment on *.vercel.app. Search engines may only
 * index a deployment that explicitly sets SITE_INDEXABLE=true, which is
 * reserved for the real trafficomm.com launch. Nothing inherits indexing
 * by accident, and production does not inherit preview noindex once the
 * flag is set there.
 */
export const isIndexable = process.env.SITE_INDEXABLE === "true";

/** True on any Vercel deployment that is not the live production site. */
export const isPreviewDeployment = Boolean(process.env.VERCEL_ENV) && !isIndexable;
