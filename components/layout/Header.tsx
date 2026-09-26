"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { company, headerNav, primaryNav, type NavGroup } from "@/data/site";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, ChevronDown, Menu } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { PlatformMark } from "@/components/ui/PlatformMark";
import { ServiceIllustration } from "@/components/visual/ServiceIllustration";
import { SolutionGlyph } from "@/components/visual/SolutionGlyph";
import { MobileNav } from "./MobileNav";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [darkHero, setDarkHero] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pages whose first section is dark mark it with data-hero="dark"; the bar inverts over it until scrolled.
  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 8);
      setDarkHero(Boolean(document.querySelector('main > [data-hero="dark"], main > * > [data-hero="dark"]:first-child')));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);

  const inverted = darkHero && !scrolled && !open;

  // Close menus on route change.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const hoverOpen = useCallback((label: string | null) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(label), label ? 60 : 180);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  /**
   * On "/" the logo link has nowhere to navigate, so the browser left the reader
   * wherever they had scrolled to. Send them back to the top instead. No
   * `behavior` is passed: that resolves to the html `scroll-behavior`, which is
   * already smooth and already switches to auto under prefers-reduced-motion.
   * Anywhere else the link navigates normally and lands at the top by default.
   */
  const homeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    e.preventDefault();
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
          scrolled || open ? "bg-paper/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <div ref={navRef} className="container-site flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
          <Link href="/" onClick={homeClick} className="shrink-0 text-[1.15rem] lg:text-[1.25rem]" aria-label="Trafficomm — home">
            <Logo inverted={inverted} tagline={company.headerDescriptor} />
          </Link>

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {primaryNav.map((group) => (
                <li key={group.label} onMouseEnter={() => hoverOpen(group.label)} onMouseLeave={() => hoverOpen(null)}>
                  <MegaTrigger
                    group={group}
                    open={open === group.label}
                    active={isActive(group.href)}
                    inverted={inverted}
                    onToggle={() => setOpen((o) => (o === group.label ? null : group.label))}
                  />
                </li>
              ))}
              {headerNav.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={cn(
                      "whitespace-nowrap rounded-full px-3 py-2 text-[0.88rem] transition-colors",
                      inverted ? (isActive(l.href) ? "text-white" : "text-fog hover:text-white") : isActive(l.href) ? "text-ink" : "text-graphite/80 hover:text-ink",
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              <ButtonLink href="/contact" variant={inverted ? "light" : "secondary"} className="h-10 px-4 text-[0.84rem]">
                Request an Assessment
              </ButtonLink>
            </span>
            <button
              type="button"
              className={cn("inline-flex size-10 items-center justify-center rounded-full ring-1 ring-inset xl:hidden", inverted ? "text-white ring-line-dark-strong" : "ring-line-strong")}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

/** The trailing path segment is the service / solution / platform slug. */
const slugOf = (href: string) => href.split("/").filter(Boolean).pop() ?? "";

/**
 * The menu shows what each service does rather than naming it twice: the
 * service's own illustration sits beside every link, at the size it was drawn
 * for, so the six capabilities are distinguishable before the label is read.
 * Solutions use layer diagrams instead, because they answer a different
 * question — where Trafficomm sits in your organisation. Both are decorative;
 * the link text is the accessible name.
 */
function MegaTrigger({ group, open, active, onToggle, inverted }: { group: NavGroup; open: boolean; active: boolean; onToggle: () => void; inverted: boolean }) {
  const panelId = useId();
  const kind = group.label === "Services" ? "service" : group.label === "Solutions" ? "solution" : "platform";
  const wide = kind !== "platform";
  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className={cn(
          "flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-[0.88rem] transition-colors",
          inverted ? (active ? "text-white" : "text-fog hover:text-white") : active || open ? "text-ink" : "text-graphite/80 hover:text-ink",
        )}
      >
        {group.label}
        <ChevronDown className={cn("size-3.5 transition-transform duration-300", open && "rotate-180")} />
      </button>

      {open && (
        <div
          id={panelId}
          className={cn(
            "left-1/2 -translate-x-1/2 pt-3",
            // Services carry full-size illustrations, so that panel is wider —
            // enough that a name like "Performance Marketing" stays on one line.
            wide ? cn("fixed top-16 lg:top-[4.5rem]", kind === "service" ? "w-[min(70rem,94vw)]" : "w-[min(60rem,92vw)]") : "absolute top-full w-[min(760px,90vw)]",
          )}
        >
          <div className="overflow-hidden rounded-[var(--radius-panel)] bg-white shadow-[0_24px_60px_-20px_rgb(0_0_0/0.25)] ring-1 ring-line">
            <div className="grid grid-cols-[1fr_15rem]">
              <div className="p-6">
                <p className="eyebrow mb-4 text-steel">{group.intro}</p>
                <ul className={cn("grid", kind === "platform" ? "grid-cols-3 gap-1" : kind === "service" ? "grid-cols-2 gap-1.5" : "grid-cols-2 gap-1")}>
                  {group.links.map((l) => {
                    const slug = slugOf(l.href);
                    return (
                      <li key={l.href}>
                        <Link href={l.href} className={cn("group flex items-start rounded-xl px-3 transition-colors hover:bg-paper", kind === "service" ? "gap-5 py-3" : "gap-3 py-2.5")}>
                          {kind === "platform" ? (
                            <PlatformMark slug={slug} size={26} className="mt-0.5 shrink-0 rounded-md" />
                          ) : kind === "service" ? (
                            <ServiceIllustration slug={slug} width={144} className="mt-0.5 shrink-0" />
                          ) : (
                            <span className="mt-1 w-[4.5rem] shrink-0 transition-opacity duration-300 group-hover:opacity-100 sm:opacity-90">
                              <SolutionGlyph slug={slug} />
                            </span>
                          )}
                          <span className="min-w-0 flex-1">
                            <span className={cn("flex items-center justify-between gap-2 text-[0.92rem] text-ink", kind === "service" && "whitespace-nowrap")}>
                              {l.label}
                              <ArrowRight className="size-3.5 -translate-x-1 text-signal opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                            </span>
                            {l.description && <span className="mt-0.5 block text-[0.8rem] leading-snug text-steel">{l.description}</span>}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                {group.also && (
                  <div className="mt-4 border-t border-line pt-4">
                    <p className="eyebrow !text-[0.6rem] text-steel">{group.also.label}</p>
                    <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1.5">
                      {group.also.items.map((name, i) => (
                        <li key={name} className="flex items-center gap-2 text-[0.85rem] text-graphite">
                          {i > 0 && (
                            <span className="text-signal" aria-hidden="true">
                              ·
                            </span>
                          )}
                          <span>{name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-between border-l border-line bg-paper p-6">
                <Link href={group.href} className="group">
                  <span className="eyebrow text-steel">Overview</span>
                  <span className="mt-2 flex items-center gap-2 text-[1.05rem] text-ink">
                    All {group.label.toLowerCase()} <ArrowRight className="text-signal transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                {group.feature && (
                  <Link href={group.feature.href} className="group mt-8 block rounded-xl bg-ink p-4 text-white">
                    <span className="text-[0.92rem]">{group.feature.label}</span>
                    <span className="mt-1 block text-[0.78rem] leading-snug text-fog">{group.feature.description}</span>
                    <ArrowRight className="mt-3 text-signal transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
