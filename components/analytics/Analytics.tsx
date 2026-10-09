import { GoogleTagManager } from "@next/third-parties/google";
import { siteEnvironment } from "@/lib/deployment";

/**
 * Google Tag Manager, and nothing else.
 *
 * GA4 (G-G80TBEF4YT) is configured inside the container, not here. Adding gtag.js
 * to the site as well would give every page two GA4 pageviews, so this file must
 * stay the only measurement script the site loads.
 *
 * `GoogleTagManager` from @next/third-parties is the implementation Next.js
 * documents. It renders the dataLayer initialiser and the container loader through
 * `next/script`, which defaults to `afterInteractive` — the script is fetched after
 * hydration and never blocks rendering. Both tags carry fixed ids (`_next-gtm-init`,
 * `_next-gtm`), and `next/script` de-duplicates by id, so the container cannot be
 * injected twice however many times this component mounts.
 *
 * What it does not render is the <noscript> fallback, which Google's own install
 * instructions include, so that is added below.
 *
 * `site_environment` is seeded by `AnalyticsEnvironment` below, not through this
 * component's `dataLayer` prop: the prop is pushed *after* the `gtm.js` message, and the
 * container's Google tag fires on Initialization with `site_environment equals
 * production`, which GTM evaluates before it reaches a later push. Every deployment
 * loads GTM (previews included, so the container can be verified before launch) and
 * the exclusion of non-production traffic belongs in GTM.
 */
export const GTM_CONTAINER_ID = "GTM-N8G32FVT";

export function Analytics() {
  return <GoogleTagManager gtmId={GTM_CONTAINER_ID} />;
}

/**
 * Rendered in <head> as a parser-blocking inline script, so the environment is the
 * first dataLayer message, ahead of the `gtm.js` event that next/script pushes after
 * hydration. The value is a fixed string from the build, never visitor data.
 */
export function AnalyticsEnvironment() {
  const init = `window.dataLayer=window.dataLayer||[];window.dataLayer.push(${JSON.stringify({ site_environment: siteEnvironment })});`;
  return <script id="site-environment" dangerouslySetInnerHTML={{ __html: init }} />;
}

/**
 * Google places this immediately after the opening <body> tag. It is inert for
 * anyone running JavaScript, and hidden from assistive technology.
 */
export function AnalyticsNoScript() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
        aria-hidden="true"
        tabIndex={-1}
      />
    </noscript>
  );
}
