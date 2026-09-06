/**
 * Monthly retainer plans. This is the recurring-revenue side of Maprizz: the cards get a
 * business in the door, the plans keep it. Prices are month-to-month unless noted and can
 * be changed here without touching any page.
 */

export type PlanId = "gbp" | "website" | "growth";

export type Plan = {
  id: PlanId;
  name: string;
  monthly: number; // US cents
  priceLabel: string;
  tagline: string;
  /** What the customer sees under "Included" */
  includes: string[];
  /** Small print under the price: commitment, setup, what's bundled. */
  terms: string;
  cta: string;
  /** Stripe bills this many months before a website plan can end. */
  minimumMonths: 1 | 6;
  /** What Joey still has to ship after the first payment. */
  setupNote: string;
  popular?: boolean;
};

export const plans: Record<PlanId, Plan> = {
  gbp: {
    id: "gbp",
    name: "Google Foundations",
    monthly: 29900,
    priceLabel: "$299",
    tagline: "For businesses that need a complete, active Google presence.",
    includes: [
      "One Google Business Profile optimized and maintained",
      "4 posts per month using your updates and photos",
      "Up to 20 review replies per month",
      "One Google review stand + review-link setup",
      "Monthly report on available profile activity",
    ],
    terms: "Billed monthly. Setup included. Month to month — cancel by email.",
    cta: "Start monthly billing",
    minimumMonths: 1,
    setupNote: "Google profile work plus one review stand.",
  },
  website: {
    id: "website",
    name: "Website + Local SEO",
    monthly: 59900,
    priceLabel: "$599",
    tagline: "For businesses ready for a website that makes the next step easy.",
    includes: [
      "Custom mobile-friendly website, up to 5 pages",
      "Hosting, SSL, and maintenance included",
      "Service and service-area content within the page allowance",
      "Up to 2 small content edits per month",
      "Call, quote, and booking links + available analytics",
    ],
    terms: "Billed monthly. Build included. 6-month initial term, then month to month. You own the domain and content.",
    cta: "Start monthly billing",
    minimumMonths: 6,
    setupNote: "Website build after we have your content and access.",
  },
  growth: {
    id: "growth",
    name: "Local Growth",
    monthly: 79900,
    priceLabel: "$799",
    tagline: "Your Google presence, website, and review tools. One local partner.",
    includes: [
      "Everything in Google Foundations",
      "Everything in Website + Local SEO",
      "Smart business card + review stand included",
      "One new or improved service page per month",
      "Monthly 30-minute progress and priorities call",
    ],
    terms: "Billed monthly. Setup + build included. 6-month initial term, then month to month.",
    cta: "Start monthly billing",
    minimumMonths: 6,
    setupNote: "Website, Google profile, smart card, and review stand.",
    popular: true,
  },
};

export const planList: Plan[] = [plans.gbp, plans.website, plans.growth];

export const planIds = ["gbp", "website", "growth"] as const;

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && (planIds as readonly string[]).includes(value);
}

/** What a lead can say they're interested in. Stored on lead_requests.interest. */
export const leadInterests = [
  { id: "not_sure", label: "Not sure yet, just want the audit" },
  { id: "cards", label: "NFC cards / review stand only" },
  { id: "gbp", label: `Google Foundations (${plans.gbp.priceLabel}/mo)` },
  { id: "website", label: `Website + Local SEO (${plans.website.priceLabel}/mo)` },
  { id: "growth", label: `Local Growth (${plans.growth.priceLabel}/mo)` },
] as const;

export type LeadInterest = (typeof leadInterests)[number]["id"];

export const leadInterestIds = leadInterests.map((i) => i.id) as [LeadInterest, ...LeadInterest[]];

export function interestLabel(id: string | null | undefined) {
  return leadInterests.find((i) => i.id === id)?.label ?? null;
}

/** What a retainer actually looks like month to month; shown on /services. */
export const retainerHowItWorks = [
  {
    title: "Free audit first.",
    body: "We look at your Google Business Profile and website and tell you, in plain language, what is costing you customers. No score, no pressure.",
  },
  {
    title: "Pick a plan. Pay monthly.",
    body: "Your card is charged today, then automatically every month. Profile work or a new site starts in the first 30 days. You approve everything before it goes live.",
  },
  {
    title: "Every month, the work gets done.",
    body: "Posts, photos, review replies, edits, SEO. You get one short report and one person to text.",
  },
] as const;

export const retainerFaqs = [
  {
    question: "How does monthly billing work?",
    answer:
      "Plans are subscriptions. Stripe charges your card today for the first month, then automatically on the same date each month. You will get a receipt by email. Google Foundations is month to month. Website and Local Growth plans have a 6-month initial term, billed monthly, then continue month to month.",
  },
  {
    question: "Do I need a monthly plan to use the cards?",
    answer:
      "No. The Tap Card, Smart Business Card and Business Kit are one-time purchases and keep working forever. Plans are for businesses that want Maprizz to actively run their Google presence or website.",
  },
  {
    question: "Am I locked into a contract?",
    answer:
      "Google Foundations is month to month from day one. Website plans have a 6-month minimum because we build the site up front; after that, month to month. Cancel by email, no hoops. There is no self-serve cancel button in the first six months of a website plan.",
  },
  {
    question: "Who owns the website and the Google profile?",
    answer:
      "You do. Your domain stays in your name, your Google Business Profile stays under your Google account (we're added as a manager), and if you leave we hand over the site files.",
  },
  {
    question: "Can you guarantee rankings or a number of reviews?",
    answer:
      "No. Rankings depend on relevance, distance, and competition. We commit to the work in your plan and report the metrics available to us. Review-link taps are not the same as completed reviews or booked jobs.",
  },
] as const;
