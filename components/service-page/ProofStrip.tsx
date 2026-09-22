import { Metric } from "@/components/ui/Metric";
import { scaleStats } from "@/data/site";

/** Approved company-wide figures only; the note makes their scope explicit. */
export function ProofStrip({ note }: { note: string }) {
  const pick = ["Campaigns handled", "Creatives & placements", "Campaigns / month", "Peak team scale", "Founded"];
  const stats = pick.map((l) => scaleStats.find((s) => s.label === l)!).filter(Boolean);
  const labels: Record<string, string> = { Founded: "Operating since", "Campaigns / month": "Largest monthly volume" };
  return (
    <section aria-label="Operating scale" className="border-y border-line bg-white">
      <div className="container-site">
        <dl className="grid grid-cols-2 md:grid-cols-5">
          {stats.map((s, i) => (
            <div key={s.label} className={`flex flex-col border-line py-7 md:py-9 ${i % 2 === 1 ? "pl-5 md:pl-6" : "md:pl-6"} ${i === 0 ? "md:pl-0" : ""} ${i > 0 ? "md:border-l" : ""} ${i % 2 === 1 ? "border-l md:border-l" : ""} ${i >= 2 ? "border-t md:border-t-0" : ""}`}>
              <dt className="eyebrow order-2 mt-3 !text-[0.72rem] text-steel">{labels[s.label] ? `${labels[s.label]}` : s.label}</dt>
              <dd className="order-1 whitespace-nowrap text-[clamp(2.1rem,1.5rem+1.6vw,3.1rem)] leading-none tracking-[-0.045em] text-ink">
                <Metric stat={s} />
              </dd>
            </div>
          ))}
        </dl>
        <p className="border-t border-line py-4 text-[0.88rem] leading-relaxed text-steel">{note}</p>
      </div>
    </section>
  );
}
