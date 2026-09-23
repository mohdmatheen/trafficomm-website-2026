import { LogoMark } from "@/components/ui/Logo";

/**
 * One band instead of two: who owns what, and what changes operationally.
 *
 * The ownership comparison and the "what changes for your team" cards used to
 * be separate full-height sections saying two halves of the same thing. Here
 * the comparison is the argument and the outcomes are its consequences, in
 * the same frame — same copy, one scroll instead of two.
 */
export function OperatingModel({
  frame,
  ownerLabel,
  clientOwns,
  trafficommSupports,
  note,
  outcomes,
}: {
  frame: string;
  ownerLabel: string;
  clientOwns: readonly string[];
  trafficommSupports: readonly string[];
  note: string;
  outcomes: readonly { title: string; body: string }[];
}) {
  return (
    <div className="relative rounded-[var(--radius-panel)] border border-dashed border-line-strong p-3 pt-11 sm:p-4 sm:pt-12" data-reveal>
      <span className="eyebrow absolute left-5 top-4 text-steel">{frame}</span>
      {/* Side by side at every width: the split is the point, and two stacked
          panels made a phone scroll past the comparison instead of reading it. */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-[1fr_auto_1.2fr] md:gap-3">
        <div className="rounded-[var(--radius-card)] bg-white p-4 ring-1 ring-line sm:p-6 lg:p-8">
          <p className="eyebrow text-steel">{ownerLabel}</p>
          <ul className="mt-4 divide-y divide-line border-y border-line sm:mt-5">
            {clientOwns.map((a) => (
              <li key={a} className="py-2.5 text-[0.95rem] leading-snug tracking-[-0.01em] text-ink sm:py-3 sm:text-[1.1rem]">
                {a}
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden items-center justify-center py-1 md:flex" aria-hidden="true">
          <span className="flex size-10 items-center justify-center rounded-full bg-paper font-mono text-[1.1rem] text-signal ring-1 ring-line">+</span>
        </div>
        <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-ink p-4 text-white sm:p-6 lg:p-8">
          <div className="grid-bg-dark absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-signal">Trafficomm handles</p>
              <LogoMark className="w-6" inverted />
            </div>
            <ul className="mt-4 grid gap-1.5 sm:mt-5 sm:grid-cols-2 sm:gap-2">
              {trafficommSupports.map((t) => (
                <li key={t} className="rounded-md bg-white/[0.06] px-2.5 py-2 text-[0.92rem] leading-snug text-fog ring-1 ring-inset ring-line-dark sm:px-3 sm:py-2.5 sm:text-[0.98rem]">
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.92rem] leading-relaxed text-fog sm:mt-6 sm:text-[0.96rem]">{note}</p>
          </div>
        </div>
      </div>

      <div className="mt-2 rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-line sm:mt-3 sm:p-6 lg:p-8">
        <p className="eyebrow text-steel">What changes operationally</p>
        <ul className="mt-5 grid gap-x-8 gap-y-5 sm:mt-6 sm:grid-cols-2 sm:gap-y-6 lg:grid-cols-4">
          {outcomes.map((o) => (
            <li key={o.title}>
              <span className="block h-0.5 w-8 bg-signal" aria-hidden="true" />
              <h3 className="mt-4 text-[1.08rem] leading-snug tracking-[-0.02em] text-ink">{o.title}</h3>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-steel">{o.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
