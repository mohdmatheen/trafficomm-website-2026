import Link from "next/link";
import { company, markets, primaryNav, secondaryNav } from "@/data/site";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const [services, solutions, platforms] = primaryNav;
  const columns = [
    { title: "Services", links: services.links },
    { title: "Solutions", links: solutions.links },
    { title: "Platforms", links: platforms.links },
    { title: "Company", links: [...secondaryNav, { label: "Contact", href: "/contact" }] },
  ];

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="grid-bg-dark mask-fade-y pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="container-site relative">
        <div className="grid gap-12 border-b border-line-dark py-16 lg:grid-cols-[1.1fr_2fr] lg:py-20">
          <div>
            <Link href="/" className="text-[1.35rem]" aria-label="Trafficomm — home">
              <Logo inverted />
            </Link>
            <p className="mt-6 max-w-sm text-[1.03rem] leading-relaxed text-fog">
              {company.tagline} The performance operations layer behind agencies, ad-tech companies, publishers and brands — since {company.founded}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact">Request an Assessment</ButtonLink>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {columns.map((col) => (
              <nav key={col.title} aria-label={`Footer ${col.title}`}>
                <p className="eyebrow mb-5 text-mute">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-[0.96rem] text-fog transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 border-b border-line-dark py-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="eyebrow text-mute">Markets supported</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.96rem] text-fog">
            {markets.map((m) => (
              <li key={m.code} className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-signal" aria-hidden="true" />
                {m.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 py-8 text-[0.86rem] text-mute sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <p className="font-mono uppercase tracking-[0.12em]">Execute · Optimize · Measure · Report</p>
        </div>
      </div>
    </footer>
  );
}
