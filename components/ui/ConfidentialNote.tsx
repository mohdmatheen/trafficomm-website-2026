import { confidentialityNote } from "@/data/site";
import { cn } from "@/lib/cn";
import { Lock } from "./Icons";

export function ConfidentialNote({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <p className={cn("flex items-start gap-2.5 text-[0.88rem] leading-relaxed", tone === "light" ? "text-steel" : "text-mute", className)}>
      <Lock className={cn("mt-0.5 shrink-0", tone === "light" ? "text-ink" : "text-white")} />
      <span>{confidentialityNote}</span>
    </p>
  );
}
