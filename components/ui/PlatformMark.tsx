import Image from "next/image";
import { platformLogos } from "@/data/platform-logos";
import { cn } from "@/lib/cn";

/**
 * Official platform mark in a standard light chip. All chips share one size;
 * the mark inside uses its optical box so compact symbols and wide wordmarks
 * read at a similar weight. Aspect ratio is always preserved (object-contain).
 */
export function PlatformMark({ slug, size = 56, className, scale = 1 }: { slug: string; size?: number; className?: string; scale?: number }) {
  const logo = platformLogos[slug];
  if (!logo) return null;
  const k = (size / 56) * scale;
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-[14px] bg-white ring-1 ring-black/5", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={logo.src}
        alt={logo.alt}
        width={Math.round(logo.box.w * k)}
        height={Math.round(logo.box.h * k)}
        unoptimized={logo.src.endsWith(".svg")}
        sizes={`${Math.round(logo.box.w * k)}px`}
        className="object-contain"
        style={{ width: Math.round(logo.box.w * k), height: Math.round(logo.box.h * k) }}
      />
    </span>
  );
}
