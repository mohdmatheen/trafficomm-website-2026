import type { FAQ } from "../types";

/**
 * Content model for a full service page. Each service supplies one of these;
 * the ServiceDetailPage template renders it section by section. Sections
 * are optional so later services can omit what does not apply.
 */
export type ServicePageContent = {
  slug: string;
  seo: { title: string; description: string };
  hero: {
    eyebrow: string;
    title: [string, string];
    lead: string;
    capabilityLine: string[];
    lifecycle: string[];
  };
  proof: { note: string };
  pressure: {
    title: [string, string];
    lead: string;
    tiers: { title: string; items: string[]; tone: "base" | "mid" | "risk" }[];
    resolution: { label: string; statement: string };
  };
  lifecycle: {
    title: [string, string];
    lead: string;
    stages: { code: string; title: string; summary: string; items: string[] }[];
  };
  operatingChain?: {
    title: [string, string];
    lead: string;
    nodes: { label: string; owner: "client" | "trafficomm" | "qa"; items: string[] }[];
  };
  qaGates?: {
    title: [string, string];
    lead: string;
    gates: { code: string; title: string; checks: string[] }[];
  };
  platforms?: {
    title: [string, string];
    lead: string;
    /** Platform slug → functions performed for this service. */
    functions: Record<string, string[]>;
  };
  caseStudy?: { slug: string; eyebrow: string; context: string };
  reporting?: {
    title: [string, string];
    lead: string;
    cadences: { label: string; items: string[] }[];
  };
  integration?: {
    title: [string, string];
    lead: string;
    agencyOwns: string[];
    trafficommSupports: string[];
  };
  engagement?: {
    title: [string, string];
    lead: string;
    models: { title: string; body: string }[];
  };
  faqs: FAQ[];
  related: { href: string; label: string; meta?: string }[];
  cta: { eyebrow: string; title: [string, string]; lead: string };
};
