import { Eyebrow } from "@/components/ui/Section";
import { ParticleScale } from "@/components/visualizations/ParticleScale";

export function ScaleVisualization() {
  return (
    <section aria-labelledby="particles-title" className="relative overflow-hidden bg-ink py-20 text-white sm:py-28 lg:py-32">
      <div className="grid-bg-dark mask-radial pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="container-site relative">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow tone="dark" index="07" className="justify-center">
            Volume, visualized
          </Eyebrow>
          <h2 id="particles-title" className="mt-6 text-h3 text-fog">
            Behind every number: work that was set up, checked, monitored and reported.
          </h2>
        </div>
        <div className="mt-10 sm:mt-14">
          <ParticleScale />
        </div>
      </div>
    </section>
  );
}
