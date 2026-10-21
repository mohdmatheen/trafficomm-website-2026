/**
 * Path redirects for URLs left over from the previous PHP site.
 *
 * Each rule is one exact path with evidence behind it (GSC exclusions and the Links
 * report, 2026-10-09; see seo/technical/tracking-privacy-legacy-2026-10-09.md §7).
 * Nothing here is a wildcard. Old URLs without an established equivalent stay 404
 * rather than being redirected to something they never were: /testimonials/*,
 * /services/2, /services/3 and bare /public/index.php. Add a rule only with evidence.
 *
 * Kept separate from host-redirects.ts, and importing nothing, so the tests can load it.
 */
export type PathRedirect = { source: string; destination: string; permanent: true };

export const legacyRedirects: PathRedirect[] = [
  // The PHP front controller served the home page and About through it; GSC lists both
  // as "Duplicate without user-selected canonical" (page indexing report, 2026-10-04).
  { source: "/index.php", destination: "/", permanent: true },
  { source: "/public/index.php/about", destination: "/about", permanent: true },
  // Google AI Mode cites /blog/3 in answers about what Trafficomm is and whether it
  // offers white-label ad operations, and the URL is a 404 (live answer checks,
  // 2026-10-21). Matheen chose the white-label page as its replacement (2026-10-21).
  { source: "/blog/3", destination: "/solutions/white-label-ad-operations", permanent: true },
  { source: "/public/index.php/blog/3", destination: "/solutions/white-label-ad-operations", permanent: true },
];
