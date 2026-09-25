import type { MetadataRoute } from "next";
import { company } from "@/data/site";

/**
 * A minimal manifest so an installed shortcut carries the brand rather than a
 * screenshot of the page. This is a marketing site, not an app: no service worker,
 * no offline behaviour, and `display: browser` so it opens as a normal tab.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${company.name} — ${company.tagline}`,
    short_name: company.name,
    description: company.description,
    start_url: "/",
    display: "browser",
    background_color: "#f6f6f3",
    theme_color: "#f6f6f3",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
