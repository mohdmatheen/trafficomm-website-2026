/**
 * Path redirects for URLs left over from the previous PHP site.
 *
 * Each rule is one exact path with evidence behind it (GSC exclusions and the Links
 * report, 2026-10-09; see seo/technical/tracking-privacy-legacy-2026-10-09.md §7).
 * Nothing here is a wildcard, and old URLs without an equivalent page (/testimonials/*,
 * /services/2, /services/3, bare /public/index.php) deliberately stay 404 rather than being redirected to
 * something they never were. Add a rule only with the same kind of evidence.
 *
 * Kept separate from host-redirects.ts, and importing nothing, so the tests can load it.
 */
export type PathRedirect = { source: string; destination: string; permanent: true };

export const legacyRedirects: PathRedirect[] = [
  // Old blog post with three external links (infobel.com x2, infobel.in); /insights is the blog's successor.
  { source: "/blog/3", destination: "/insights", permanent: true },
  // The same post and the About page, as GSC saw them through the PHP front controller.
  { source: "/public/index.php/blog/3", destination: "/insights", permanent: true },
  { source: "/public/index.php/about", destination: "/about", permanent: true },
  // The front controller itself served the home page; GSC lists it as a duplicate of a canonical page.
  { source: "/index.php", destination: "/", permanent: true },
];
