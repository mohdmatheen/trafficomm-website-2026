import { adOperationsPage } from "./ad-operations";
import type { ServicePageContent } from "./types";

/** Services with a full detail page. Others fall back to the standard service template until built. */
export const servicePages: Record<string, ServicePageContent> = {
  "ad-operations": adOperationsPage,
};
