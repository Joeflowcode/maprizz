import type { PlanId } from "@/lib/services";

export type Industry = {
  slug: string;
  name: string;
  navLabel: string;
  headline: string;
  lead: string;
  recommended: PlanId;
  problems: { title: string; body: string }[];
  outcomes: string[];
};

export const industries: Industry[] = [
  {
    slug: "contractors",
    name: "Contractors",
    navLabel: "Contractors",
    headline: "The contractor they find first is the one they call.",
    lead: "Homeowners search Google, skim reviews, and bounce if the next step is unclear. Maprizz keeps your listing, site, and review ask in working order so good jobs are easier to win.",
    recommended: "growth",
    problems: [
      { title: "The listing is unfinished", body: "Wrong categories, missing services, old photos, or a service area that does not match where you actually work." },
      { title: "The website does not close", body: "A Facebook page or a brochure site with no click-to-call, no quote path, and no pages for the jobs you want." },
      { title: "Reviews stall after a busy season", body: "Happy customers would leave a review if asking were as easy as a tap on the truck or at the door." },
    ],
    outcomes: [
      "A Google profile that matches the work you want",
      "A mobile site with call and quote on every page",
      "A review stand or tap card for after the job",
      "A monthly report on the activity we can actually see",
    ],
  },
  {
    slug: "home-services",
    name: "Home services",
    navLabel: "Home services",
    headline: "When the pipe bursts, they do not browse. They pick.",
    lead: "Cleaning, landscaping, HVAC, plumbing, and the rest of the trades live or die on being easy to find and easy to trust. We handle the online pieces so you can stay on the job.",
    recommended: "website",
    problems: [
      { title: "You disappear between jobs", body: "Hours, photos, and posts go stale. Nearby searches start preferring whoever looks active." },
      { title: "Every town is not a page", body: "Useful service-area content beats a pile of thin city pages. We write for the work you actually do." },
      { title: "The ask for a review never happens", body: "A counter stand or a card in the truck is a reminder, not a gimmick — and we never fake the review." },
    ],
    outcomes: [
      "Current hours, services, and photos on Google",
      "Service pages that say what you do and where",
      "One person to text when something on the site needs a small edit",
      "Honest reporting — taps, calls we can see, not invented rankings",
    ],
  },
  {
    slug: "auto-detailers",
    name: "Auto detailers",
    navLabel: "Auto detailers",
    headline: "Show the work. Make booking a one-thumb job.",
    lead: "Detailing sells on photos, reviews, and a booking path that works in a parking lot. We tighten the Google listing, the site, and the tap-to-review flow.",
    recommended: "gbp",
    problems: [
      { title: "Photos are the product and they are old", body: "Google and the website should show recent work, not last year's wrap." },
      { title: "Booking is buried", body: "If they cannot tap to text, call, or book from the listing, they move to the next shop." },
      { title: "Reviews come in bursts", body: "A review stand at pickup makes the ask part of the handoff, not a follow-up you forget." },
    ],
    outcomes: [
      "A listing with the right services and fresh photos",
      "A simple site or profile with Book / Text / Call",
      "A review stand for the front desk or mobile kit",
      "Replies to reviews within the monthly allowance",
    ],
  },
  {
    slug: "barbers-salons",
    name: "Barbers & salons",
    navLabel: "Barbers & salons",
    headline: "Walk-ins still look you up before they sit down.",
    lead: "Your chair is the product. Google, Instagram, booking, and reviews should all point at the same shop — and a tap card saves the awkward 'what's your handle?' at the end of a cut.",
    recommended: "gbp",
    problems: [
      { title: "Hours and booking do not match", body: "Google says walk-in. The site says book only. People bounce." },
      { title: "The card in their wallet is dead paper", body: "A tap card opens booking, Instagram, or save-contact. Paper just sits in a drawer." },
      { title: "Reviews lag behind the work", body: "A stand at the desk is the allowed, easy ask — no incentives, no gating." },
    ],
    outcomes: [
      "Accurate hours, services, and booking links",
      "A smart card for the stylist or the front",
      "A review stand that opens your Google review form",
      "A profile you can update when the team or hours change",
    ],
  },
];

export function industryBySlug(slug: string) {
  return industries.find((item) => item.slug === slug) ?? null;
}
