"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { primaryNav, secondaryNav } from "@/data/site";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { Close, Plus } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { PlatformMark } from "@/components/ui/PlatformMark";
import { ServiceGlyph } from "@/components/visual/ServiceGlyph";
import { SolutionGlyph } from "@/components/visual/SolutionGlyph";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const opener = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      // Keep focus inside the dialog.
      const focusables = panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open, onClose]);

  // Mount only while open: keeps ~90 hidden elements out of every page's HTML.
  if (!open) return null;

  return (
    <div
      id="mobile-nav"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-[60] flex flex-col bg-paper xl:hidden"
    >
      <div className="container-site flex h-16 shrink-0 items-center justify-between">
        <Link href="/" className="text-[1.15rem]" onClick={onClose}>
          <Logo />
        </Link>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="inline-flex size-10 items-center justify-center rounded-full ring-1 ring-inset ring-line-strong"
        >
          <Close />
        </button>
      </div>

      <nav aria-label="Mobile" className="container-site flex-1 overflow-y-auto pb-8">
        <ul className="divide-y divide-line border-y border-line">
          {primaryNav.map((group) => {
            const isOpen = expanded === group.label;
            const id = `m-${group.label.toLowerCase()}`;
            return (
              <li key={group.label}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={id}
                  onClick={() => setExpanded(isOpen ? null : group.label)}
                  className="flex w-full items-center justify-between py-5 text-left text-[1.6rem] tracking-[-0.03em]"
                >
                  {group.label}
                  <Plus className={cn("size-5 transition-transform duration-300", isOpen && "rotate-45 text-signal")} />
                </button>
                <div id={id} hidden={!isOpen} className="pb-5">
                  <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {group.links.map((l) => {
                      // Same miniatures as the desktop menu, so the services stay
                      // distinguishable by shape on a phone too. Decorative: the link
                      // text is the accessible name.
                      const slug = l.href.split("/").filter(Boolean).pop() ?? "";
                      return (
                        <li key={l.href}>
                          <Link href={l.href} onClick={onClose} className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-[1rem] text-graphite active:bg-white">
                            {group.label === "Platforms" ? (
                              <PlatformMark slug={slug} size={24} className="shrink-0 rounded-md" />
                            ) : (
                              <span className="w-12 shrink-0">{group.label === "Services" ? <ServiceGlyph slug={slug} /> : <SolutionGlyph slug={slug} />}</span>
                            )}
                            {l.label}
                          </Link>
                        </li>
                      );
                    })}
                    <li>
                      <Link href={group.href} onClick={onClose} className="flex min-h-11 items-center rounded-lg px-3 py-2.5 text-[1rem] text-signal-ink">
                        All {group.label.toLowerCase()} →
                      </Link>
                    </li>
                  </ul>
                  {group.also && (
                    <div className="mt-3 px-3">
                      <p className="eyebrow !text-[0.6rem] text-steel">{group.also.label}</p>
                      <p className="mt-1.5 text-[0.9rem] leading-relaxed text-graphite">{group.also.items.join(" · ")}</p>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
          {secondaryNav.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={onClose} className="block py-5 text-[1.6rem] tracking-[-0.03em]">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3">
          <ButtonLink href="/contact" onClick={onClose} size="lg">
            Request an Operations Assessment
          </ButtonLink>
          <ButtonLink href="/contact#call" onClick={onClose} variant="ghost" size="lg">
            Talk to Trafficomm
          </ButtonLink>
        </div>
      </nav>
    </div>
  );
}
