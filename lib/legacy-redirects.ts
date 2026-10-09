/**
 * Path redirects for URLs left over from the previous PHP site.
 *
 * Each rule is one exact path with evidence behind it (GSC exclusions and the Links
 * report, 2026-10-09; see seo/technical/tracking-privacy-legacy-2026-10-09.md §7).
 * Nothing here is a wildcard. Old URLs without an established equivalent stay 404
 * rather than being redirected to something they never were: /testimonials/*,
 * /services/2, /services/3 and bare /public/index.php. /blog/3 (with or without the
 * /public/index.php prefix) stays as is until its former content and a relevant
 * replacement are established (Matheen, 2026-10-09). Add a rule only with evidence.
 *
 * Kept separate from host-redirects.ts, and importing nothing, so the tests can load it.
 */
export type PathRedirect = { source: string; destination: string; permanent: true };

export const legacyRedirects: PathRedirect[] = [
  // The PHP front controller served the home page and About through it; GSC lists both
  // as "Duplicate without user-selected canonical" (page indexing report, 2026-10-04).
  { source: "/index.php", destination: "/", permanent: true },
  { source: "/public/index.php/about", destination: "/about", permanent: true },
];
