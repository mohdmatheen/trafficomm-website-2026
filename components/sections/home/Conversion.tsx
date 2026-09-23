import { AssessmentForm } from "@/components/forms/AssessmentForm";
import { Eyebrow } from "@/components/ui/Section";
import { Check } from "@/components/ui/Icons";

const covers = [
  "Your current workflow, platforms and monthly volumes",
  "Where setup, QA and reporting time is being lost",
  "Key-person dependencies and quality risks",
  "An operating model that fits your team",
];

export function Conversion({
  index = "12",
  eyebrow = "Let's talk operations",
  title = ["What's Slowing", "Your Media Team Down?"],
  lead = "Request an operations assessment. We'll look at how your campaigns move from plan to report — and where a performance operations layer would make the difference.",
}: {
  index?: string | null;
  eyebrow?: string;
  title?: [string, string];
  lead?: string;
}) {
  return (
    <section id="assessment" aria-labelledby="convert-title" className="relative overflow-hidden bg-ink py-20 text-white sm:py-28 lg:py-36">
      <div className="grid-bg-dark mask-fade-y pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="container-site relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <Eyebrow tone="dark" index={index ?? undefined}>
            {eyebrow}
          </Eyebrow>
          <h2 id="convert-title" className={`mt-6 text-white ${title.join(" ").length > 40 ? "text-[clamp(2rem,1.4rem+2.1vw,3.3rem)] leading-[1.04] tracking-[-0.035em]" : "text-h2"}`}>
            {title[0]} <span className="block text-mute">{title[1]}</span>
          </h2>
          <p className="mt-6 max-w-md text-lead text-fog">{lead}</p>
          <p className="eyebrow mt-12 mb-5 text-mute">The assessment covers</p>
          <ul className="space-y-3">
            {covers.map((c) => (
              <li key={c} className="flex items-start gap-3 text-[1.05rem] text-fog">
                <Check className="mt-1 shrink-0 text-signal" /> {c}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <AssessmentForm tone="dark" idPrefix="home" />
        </div>
      </div>
    </section>
  );
}
