import { platformLogos } from "@/data/platform-logos";
import { cn } from "@/lib/cn";

/**
 * Official platform mark in a standard light chip. All chips share one size;
 * the mark inside uses its optical box so compact symbols and wide wordmarks
 * read at a similar weight. Aspect ratio is always preserved (object-contain).
 *
 * Accessibility: the mark is decorative by default, because every use sits
 * beside the platform name (visible text, or text inside the control). Pass
 * `alt` only where no other text identifies the platform — otherwise screen
 * readers announce the name twice.
 */
export function PlatformMark({ slug, size = 56, className, scale = 1, alt = "" }: { slug: string; size?: number; className?: string; scale?: number; alt?: string }) {
  const logo = platformLogos[slug];
  if (!logo) return null;
  const k = (size / 56) * scale;
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-[14px] bg-white ring-1 ring-black/5", className)}
      style={{ width: size, height: size }}
    >
      {/* Plain <img>: logos are pre-sized static assets (SVG, or PNG exported at 480px for HiDPI), so the image optimizer adds markup without benefit. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.src}
        alt={alt}
        width={Math.round(logo.box.w * k)}
        height={Math.round(logo.box.h * k)}
        loading="lazy"
        decoding="async"
        className="object-contain"
        style={{ width: Math.round(logo.box.w * k), height: Math.round(logo.box.h * k) }}
      />
    </span>
  );
}
