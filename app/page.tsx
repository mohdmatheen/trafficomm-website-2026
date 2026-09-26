import type { Metadata } from "next";
import { AIOperations } from "@/components/sections/home/AIOperations";
import { Conversion } from "@/components/sections/home/Conversion";
import { FlagshipCase } from "@/components/sections/home/FlagshipCase";
import { GlobalExperience } from "@/components/sections/home/GlobalExperience";
import { Hero } from "@/components/sections/home/Hero";
import { OperatingModel } from "@/components/sections/home/OperatingModel";
import { OperatingPressure } from "@/components/sections/home/OperatingPressure";
import { ScaleStats } from "@/components/sections/home/ScaleStats";
import { ServicesGrid } from "@/components/sections/home/ServicesGrid";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Performance Operations. Built for Execution.",
    description:
      "Trafficomm is the performance operations layer behind agencies, ad-tech companies, publishers and brands — ad operations, performance marketing, programmatic, measurement and reporting since 2015.",
    path: "/",
  }),
  title: { absolute: "Trafficomm — Performance Operations. Built for Execution." },
};

export default function Home() {
  return (
    <>
      <Hero />
      <ScaleStats />
      <OperatingPressure />
      <ServicesGrid />
      <FlagshipCase index="04" />
      <OperatingModel index="05" />
      <GlobalExperience index="06" />
      <AIOperations index="07" />
      <Conversion index="08" />
    </>
  );
}
