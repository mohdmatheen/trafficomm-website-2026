import { LogoMark } from "@/components/ui/Logo";

export function AgencyIntegration({ agencyOwns, trafficommSupports }: { agencyOwns: readonly string[]; trafficommSupports: readonly string[] }) {
  return (
    <div className="relative rounded-[var(--radius-panel)] border border-dashed border-line-strong p-3 pt-11 sm:p-4 sm:pt-12" data-reveal>
      <span className="eyebrow absolute left-5 top-4 text-steel">Your team, extended</span>
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1.2fr]">
        <div className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-line sm:p-8">
          <p className="eyebrow text-steel">Agency owns</p>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {agencyOwns.map((a) => (
              <li key={a} className="py-3 text-[1.1rem] tracking-[-0.01em] text-ink">
                {a}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-center py-1" aria-hidden="true">
          <span className="flex size-10 items-center justify-center rounded-full bg-paper font-mono text-[1.1rem] text-signal ring-1 ring-line">+</span>
        </div>
        <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-ink p-6 text-white sm:p-8">
          <div className="grid-bg-dark absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-signal">Trafficomm supports</p>
              <LogoMark className="w-6" inverted />
            </div>
            <ul className="mt-5 grid grid-cols-2 gap-2">
              {trafficommSupports.map((t) => (
                <li key={t} className="rounded-md bg-white/[0.06] px-3 py-2.5 text-[0.98rem] text-fog ring-1 ring-inset ring-line-dark">
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.96rem] leading-relaxed text-fog">More operational capacity — with strategy, planning and client relationships staying with your team.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
