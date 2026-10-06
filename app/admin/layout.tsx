import type { Metadata } from "next";

/**
 * Everything under /admin is internal.
 *
 * `noindex, nofollow` regardless of `SITE_INDEXABLE`, because unlike the rest of
 * the site these pages must never be indexable on any deployment. Nothing links
 * here from the site's navigation, header or footer, and the sitemap does not
 * list it — the only way in is to know the URL and hold a valid session.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  title: "Trafficomm — internal",
};

/** Always server-rendered: a cached admin page could serve one person's session view to another. */
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // `data-admin` is what the stylesheet keys on to hide the public header and
  // footer. The alternative — moving every public route into a route group so
  // /admin sits outside the marketing layout — is a large structural change to
  // a shipped site for a cosmetic gain on one internal page.
  return (
    <div data-admin className="min-h-dvh bg-paper">
      {children}
    </div>
  );
}
