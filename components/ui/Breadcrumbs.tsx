import Link from "next/link";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import { cn } from "@/lib/cn";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className={cn("eyebrow flex flex-wrap items-center gap-2", tone === "light" ? "text-steel" : "text-mute")}>
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className={tone === "light" ? "text-ink" : "text-white"}>
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.path} className="hover:text-signal transition-colors">
                    {c.name}
                  </Link>
                )}
                {!last && <span aria-hidden="true">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(all)} />
    </>
  );
}
