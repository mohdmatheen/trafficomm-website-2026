import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "paper" | "white" | "dark";

const tones: Record<Tone, string> = {
  paper: "bg-paper text-ink",
  white: "bg-white text-ink",
  dark: "bg-ink text-white",
};

/** Page section wrapper: consistent vertical rhythm, tone and container. */
export function Section({
  children,
  tone = "paper",
  className,
  containerClassName,
  id,
  bleed = false,
  labelledBy,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  id?: string;
  bleed?: boolean;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-tone={tone}
      className={cn("relative py-20 sm:py-28 lg:py-36", tones[tone], className)}
    >
      {bleed ? children : <div className={cn("container-site", containerClassName)}>{children}</div>}
    </section>
  );
}

export function Eyebrow({ children, className, tone = "light", index }: { children: ReactNode; className?: string; tone?: "light" | "dark"; index?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", tone === "light" ? "text-steel" : "text-mute", className)}>
      <span className="inline-block size-1.5 bg-signal" aria-hidden="true" />
      {index && <span className={tone === "light" ? "text-ink" : "text-white"}>{index}</span>}
      {index && <span aria-hidden="true" className="h-px w-6 bg-current opacity-40" />}
      <span>{children}</span>
    </p>
  );
}

/** Standard section heading block: eyebrow, headline, optional lead copy. */
export function SectionHeading({
  eyebrow,
  index,
  title,
  lead,
  tone = "light",
  align = "left",
  className,
  id,
  as: As = "h2",
  size = "h2",
}: {
  eyebrow?: string;
  index?: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
  id?: string;
  as?: "h1" | "h2";
  size?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)} data-reveal>
      {eyebrow && (
        <Eyebrow tone={tone} index={index} className={cn("mb-6", align === "center" && "justify-center")}>
          {eyebrow}
        </Eyebrow>
      )}
      <As id={id} className={cn(size === "h1" ? "text-h1" : "text-h2", tone === "light" ? "text-ink" : "text-white")}>
        {title}
      </As>
      {lead && (
        <p className={cn("mt-6 text-lead", tone === "light" ? "text-steel" : "text-fog", align === "center" && "mx-auto max-w-2xl")}>
          {lead}
        </p>
      )}
    </div>
  );
}
