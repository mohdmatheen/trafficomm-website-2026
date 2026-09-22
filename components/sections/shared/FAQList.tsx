import { JsonLd, faqSchema } from "@/components/seo/JsonLd";
import { Plus } from "@/components/ui/Icons";
import type { FAQ } from "@/data/types";

/** Native <details> accordion — keyboard accessible with zero JS. */
export function FAQList({ faqs, withSchema = true }: { faqs: FAQ[]; withSchema?: boolean }) {
  if (!faqs.length) return null;
  return (
    <>
      <div className="divide-y divide-line border-y border-line">
        {faqs.map((f) => (
          <details key={f.q} className="group py-1">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.12rem] tracking-[-0.015em] text-ink [&::-webkit-details-marker]:hidden">
              {f.q}
              <Plus className="size-5 shrink-0 text-steel transition-transform duration-300 group-open:rotate-45 group-open:text-signal" />
            </summary>
            <p className="max-w-3xl pb-6 text-[1rem] leading-relaxed text-steel">{f.a}</p>
          </details>
        ))}
      </div>
      {withSchema && <JsonLd data={faqSchema(faqs)} />}
    </>
  );
}
