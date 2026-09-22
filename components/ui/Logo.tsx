import { cn } from "@/lib/cn";

/**
 * Trafficomm mark, redrawn as vector from the supplied brand artwork
 * (black "L" stroke + red "T" in forward-leaning parallelograms).
 */
export function LogoMark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <svg viewBox="0 0 1140 665" className={className} aria-hidden="true" focusable="false">
      <path d="M302 190h239L301 573h236l-60 92H0z" fill={inverted ? "#fff" : "#1f1f1f"} />
      <path d="M537 573 782 190h239L777 573z" fill="#ea3e3a" />
      <path d="M601 95 660 0h480l-61 95z" fill="#ea3e3a" />
    </svg>
  );
}

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-[1.15em] w-auto" inverted={inverted} />
      <span
        className={cn("font-brand font-semibold tracking-[-0.02em]", inverted ? "text-white" : "text-ink")}
      >
        Trafficomm
      </span>
    </span>
  );
}
