import type { Metadata } from "next";
import { AIOperations } from "@/components/sections/home/AIOperations";
import { CalculatorTeaser } from "@/components/sections/home/CalculatorTeaser";
import { CaseStudies } from "@/components/sections/home/CaseStudies";
import { Conversion } from "@/components/sections/home/Conversion";
import { FlagshipCase } from "@/components/sections/home/FlagshipCase";
import { GlobalExperience } from "@/components/sections/home/GlobalExperience";
import { Hero } from "@/components/sections/home/Hero";
import { InsightsPreview } from "@/components/sections/home/InsightsPreview";
import { OperatingModel } from "@/components/sections/home/OperatingModel";
import { PlatformEcosystem } from "@/components/sections/home/PlatformEcosystem";
import { Problem } from "@/components/sections/home/Problem";
import { ScaleStats } from "@/components/sections/home/ScaleStats";
import { ServicesGrid } from "@/components/sections/home/ServicesGrid";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Performance Operations. Built to Scale.",
    description:
      "Trafficomm is the performance operations layer behind agencies, ad-tech companies, publishers and brands — ad operations, performance marketing, programmatic, measurement and reporting since 2015.",
    path: "/",
  }),
  title: { absolute: "Trafficomm — Performance Operations. Built to Scale." },
};

export default function Home() {
  return (
    <>
      <Hero />
      <ScaleStats />
      <Problem />
      <ServicesGrid />
      <PlatformEcosystem />
      <FlagshipCase />
      <OperatingModel />
      <CaseStudies />
      <GlobalExperience />
      <AIOperations />
      <InsightsPreview />
      <CalculatorTeaser />
      <Conversion index="12" />
    </>
  );
}
