import type { Stat } from "./types";

/**
 * Single source of truth for every recurring Trafficomm figure.
 *
 * Two different kinds of number live here and must never be mixed:
 *  - `companyMetrics`: company-wide operating scale since 2015.
 *  - `caseMetrics`: figures documented in one anonymized case study. They
 *    describe that engagement only.
 *
 * Wording rules (from Trafficomm's claims audit):
 *  - 250+ (company) is the PEAK / largest monthly campaign volume, not a
 *    current monthly run-rate. 250+ (performance case study) is the total
 *    number of campaigns managed on that engagement. They are different facts.
 *  - ~$10M is the approximate campaign value / media scale of one of the
 *    largest UAE tourism campaigns Trafficomm handled. It is not revenue,
 *    client revenue, annual spend or cumulative spend.
 *  - 4 → ~30 is a HISTORICAL team scale on one engagement. It is not the
 *    current team size and must never be phrased as "today" or "currently".
 *  - 70+ is the largest historical Trafficomm team size, not current headcount.
 *    Its label reads "Team members", so the qualifier in `detail` is not
 *    optional: every surface that shows this figure must show the detail with
 *    it, or the number becomes a current-headcount claim.
 *  - 7+ years (Case 01) is the span of the engagement; never "current" or "ongoing".
 */

type Metric = Stat & { id: string };

export const companyMetrics = {
  founded: { id: "founded", value: 2015, display: "2015", label: "Founded", detail: "Operating since 2015" },
  campaigns: { id: "campaigns", value: 10, suffix: "K+", label: "Campaigns handled", detail: "Since 2015" },
  creatives: { id: "creatives", value: 1, suffix: "M+", label: "Creatives & placements", detail: "Since inception" },
  campaignScale: { id: "campaignScale", value: 10, prefix: "~$", suffix: "M", label: "Campaign scale", detail: "UAE tourism campaign" },
  peakMonthly: { id: "peakMonthly", value: 250, suffix: "+", label: "Peak monthly campaign volume", detail: "Largest single month" },
  peakTeam: { id: "peakTeam", value: 70, suffix: "+", label: "Team members", detail: "Peak historical team size" },
} satisfies Record<string, Metric>;

/** Order used wherever the full company scale grid is shown. */
export const scaleStats: Stat[] = [
  companyMetrics.founded,
  companyMetrics.campaigns,
  companyMetrics.creatives,
  companyMetrics.campaignScale,
  companyMetrics.peakMonthly,
  companyMetrics.peakTeam,
];

/** One-line sentence form, for FAQs and body copy. */
export const companyScaleSentence =
  "Since 2015 Trafficomm has handled 10,000+ campaigns and 1M+ creatives and placements, with a peak monthly campaign volume of 250+ and a largest historical team size of 70+.";

/**
 * One supporting line for the scale grid. Keeps the necessary clarification
 * out of the metric labels themselves (hierarchy: figure → what it is → context).
 */
export const campaignScaleNote = "~$10M is the campaign value handled on a single UAE tourism campaign; it is not Trafficomm revenue.";

export const caseMetrics = {
  /** Leading MENA agency (Case 01). Historical: never "today" or "current". */
  menaTeam: {
    value: "4 → ~30",
    label: "Team scale",
    cardLabel: "Historical team scale",
    start: "4",
    scaledTo: "~30",
    copy: "The dedicated team scaled from 4 specialists to approximately 30 as the agency's operational requirements grew.",
  },
  menaCost: { value: "50%", label: "Resource cost reduction" },
  menaQuality: { value: "99.34%", label: "Work quality" },
  menaPartnership: { value: "7+ years", short: "7+ yrs", label: "Engagement span" },
  /** International agency, performance marketing (Case 02): total campaigns on that engagement. */
  perfCampaigns: { value: "250+", label: "Campaigns managed" },
  /** International ad network (Case 03). */
  richMedia: { value: "300+", label: "Rich media creatives" },
  /** UAE broadcast group (Case 04). */
  broadcasterCampaigns: { value: "50+", label: "Campaigns managed" },
} as const;
