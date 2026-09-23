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

/**
 * `tagline` sets the positioning line under the wordmark. It is deliberately
 * quiet — mono, small, wide-tracked — so it reads as a descriptor of the
 * company rather than competing with the mark. It does not change the header's
 * height: the wordmark loses its vertical centring, not the bar its size.
 */
export function Logo({ className, inverted = false, tagline }: { className?: string; inverted?: boolean; tagline?: string }) {
  const wordmark = (
    <span className={cn("block font-brand font-semibold leading-none tracking-[-0.02em]", inverted ? "text-white" : "text-ink")}>Trafficomm</span>
  );
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-[1.15em] w-auto" inverted={inverted} />
      {tagline ? (
        <span className="block">
          {wordmark}
          <span
            className={cn(
              // Hidden on the narrowest phones, where the bar also has to hold the menu button.
              "mt-1 hidden whitespace-nowrap font-mono text-[0.52em] uppercase leading-none tracking-[0.14em] min-[420px]:block",
              inverted ? "text-fog" : "text-steel",
            )}
          >
            {tagline}
          </span>
        </span>
      ) : (
        wordmark
      )}
    </span>
  );
}
