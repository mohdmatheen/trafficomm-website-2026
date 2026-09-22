"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { primaryNav, secondaryNav, type NavGroup } from "@/data/site";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, ChevronDown, Menu } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
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

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
          scrolled || open ? "bg-paper/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <div ref={navRef} className="container-site flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
          <Link href="/" className="text-[1.15rem] lg:text-[1.25rem]" aria-label="Trafficomm — home">
            <Logo inverted={inverted} />
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
              {secondaryNav.map((l) => (
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

function MegaTrigger({ group, open, active, onToggle, inverted }: { group: NavGroup; open: boolean; active: boolean; onToggle: () => void; inverted: boolean }) {
  const panelId = useId();
  const cols = group.links.length > 6 ? "grid-cols-3" : "grid-cols-2";
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
      <div id={panelId} className="absolute left-1/2 top-full w-[min(760px,90vw)] -translate-x-1/2 pt-3">
        <div className="overflow-hidden rounded-[var(--radius-panel)] bg-white shadow-[0_24px_60px_-20px_rgb(0_0_0/0.25)] ring-1 ring-line">
          <div className="grid grid-cols-[1fr_15rem]">
            <div className="p-6">
              <p className="eyebrow mb-4 text-steel">{group.intro}</p>
              <ul className={cn("grid gap-1", cols)}>
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="group block rounded-xl px-3 py-2.5 transition-colors hover:bg-paper">
                      <span className="flex items-center justify-between text-[0.92rem] text-ink">
                        {l.label}
                        <ArrowRight className="size-3.5 -translate-x-1 text-signal opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                      </span>
                      {l.description && <span className="mt-0.5 block text-[0.8rem] leading-snug text-steel">{l.description}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
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
