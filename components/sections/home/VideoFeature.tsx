import { Section, SectionHeading } from "@/components/ui/Section";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { brandFilm } from "@/data/site";

export function VideoFeature() {
  return (
    <Section tone="dark" labelledBy="film-title" className="overflow-hidden border-b border-line-dark">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-[radial-gradient(ellipse_at_top,rgb(234_62_58/0.12),transparent_65%)]" aria-hidden="true" />
      <div className="relative">
        <SectionHeading
          id="film-title"
          tone="dark"
          align="center"
          index="12"
          eyebrow="60 seconds with Trafficomm"
          className="mx-auto"
          title={
            <>
              See What Happens Behind <span className="block text-mute">Thousands of Digital Campaigns.</span>
            </>
          }
        />
        <div className="mx-auto mt-14 max-w-5xl" data-reveal>
          <VideoPlayer {...brandFilm} />
        </div>
      </div>
    </Section>
  );
}
