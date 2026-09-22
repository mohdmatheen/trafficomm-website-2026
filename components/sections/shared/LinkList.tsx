import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";

/** Bordered list of internal links, used for related services / platforms. */
export function LinkList({ items, tone = "light" }: { items: { href: string; label: string; meta?: string }[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <ul className={`divide-y border-y ${dark ? "divide-line-dark border-line-dark" : "divide-line border-line"}`}>
      {items.map((it) => (
        <li key={it.href}>
          <Link href={it.href} className="group flex items-center justify-between gap-4 py-4">
            <span className={`text-[1.05rem] tracking-[-0.01em] ${dark ? "text-white" : "text-ink"}`}>{it.label}</span>
            <span className="flex items-center gap-3">
              {it.meta && <span className={`hidden font-mono text-[0.66rem] uppercase tracking-[0.1em] sm:inline ${dark ? "text-mute" : "text-steel"}`}>{it.meta}</span>}
              <ArrowRight className="text-signal transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
