import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ArrowRight } from "./Icons";

type Variant = "primary" | "secondary" | "ghost" | "light" | "outline-dark";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-signal-cta text-white hover:bg-signal-ink shadow-[0_1px_0_rgb(255_255_255/0.2)_inset]",
  secondary: "bg-ink text-white hover:bg-graphite",
  ghost: "text-ink hover:bg-ink/5 ring-1 ring-inset ring-line-strong",
  light: "bg-white text-ink hover:bg-paper",
  "outline-dark": "text-white ring-1 ring-inset ring-line-dark-strong hover:bg-white/5",
};
const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9rem]",
  lg: "h-13 px-6 text-[0.95rem]",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "group inline-flex items-center justify-center gap-2.5 rounded-full font-medium tracking-[-0.01em] whitespace-nowrap",
    "transition-[background-color,color,box-shadow,transform] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );
}

type Common = { variant?: Variant; size?: Size; arrow?: boolean; children: ReactNode; className?: string };

export function ButtonLink({ href, variant, size, arrow = true, children, className, ...rest }: Common & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
      {arrow && <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />}
    </Link>
  );
}

export function Button({ variant, size, arrow = false, children, className, ...rest }: Common & ComponentProps<"button">) {
  return (
    <button className={buttonClasses(variant, size, className)} {...rest}>
      {children}
      {arrow && <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />}
    </button>
  );
}

/** Inline text link with animated arrow. */
export function ArrowLink({ href, children, className, tone = "light" }: { href: string; children: ReactNode; className?: string; tone?: "light" | "dark" }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-[0.9rem] font-medium",
        tone === "light" ? "text-ink" : "text-white",
        className,
      )}
    >
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
        {children}
      </span>
      <ArrowRight className="text-signal transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}
