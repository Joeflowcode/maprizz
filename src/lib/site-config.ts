/**
 * Central site configuration for Maprizz. Edit here to change contact details, nav, and
 * copy that appears in several places.
 */

type SiteConfig = {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  url: string;
  domain: string;
  email: string;
  phone: string;
  founder: { name: string; firstName: string };
  location: { city: string; region: string; area: string; country: string };
  social: { instagram: string; facebook: string; linkedin: string };
  analyticsId: string;
  cta: { primary: string; primaryHref: string; secondary: string; secondaryHref: string };
  cardCta: { primary: string; secondary: string };
  compatibility: string;
  disclaimer: string;
};

export const siteConfig: SiteConfig = {
  name: "Maprizz",
  legalName: "Maprizz",
  tagline: "Get found. Build trust. Grow locally.",
  description:
    "Google Business Profile management, websites, local SEO, and review tools for local businesses. Based in Bend, Oregon. Start with a free business audit.",

  /** Canonical production domain. No trailing slash. */
  url: "https://maprizz.com",
  domain: "maprizz.com",

  email: process.env.NEXT_PUBLIC_JOEY_EMAIL?.trim() || "hello@maprizz.com",
  /** Leave empty to hide phone links. */
  phone: process.env.NEXT_PUBLIC_JOEY_PHONE?.trim() ?? "",

  founder: { name: "Joey McVeigh", firstName: "Joey" },
  location: { city: "Bend", region: "Oregon", area: "Central Oregon", country: "US" },

  /** Leave empty to hide. */
  social: {
    instagram: process.env.NEXT_PUBLIC_JOEY_INSTAGRAM?.trim() ?? "",
    facebook: "",
    linkedin: "",
  },

  analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID ?? "",

  cta: {
    primary: "Get my free audit",
    primaryHref: "/audit",
    secondary: "See how it works",
    secondaryHref: "/#how-it-works",
  },
  cardCta: { primary: "Build My Card", secondary: "Try the Demo" },

  compatibility: "Works with NFC-enabled modern smartphones, with QR as a backup. No app required.",

  disclaimer:
    "Google, Google Maps and Google Business Profile are trademarks of Google LLC. Maprizz is not affiliated with or endorsed by Google. Maprizz tracks taps on your review link; it cannot see whether a review was submitted.",
};

export const navLinks = [
  { href: "/#what-we-do", label: "What we do" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/services", label: "Monthly plans" },
  { href: "/#cards", label: "Tap cards" },
  { href: "/about", label: "About" },
] as const;

export const footerLinks = {
  products: [
    { href: "/services#google", label: "Google Foundations — $299/mo" },
    { href: "/services#website", label: "Website + Local SEO — $599/mo" },
    { href: "/services#growth", label: "Local Growth — $799/mo" },
    { href: "/order?package=tap_card", label: "Tap Card — $49" },
    { href: "/order?package=smart_card", label: "Smart Business Card — $79" },
    { href: "/order?package=business_kit", label: "Business Kit — $149" },
  ],
  company: [
    { href: "/subscribe", label: "Start monthly billing" },
    { href: "/audit", label: "Free business audit" },
    { href: "/about", label: "About Joey" },
    { href: "/bend", label: "Bend & Central Oregon" },
    { href: "/for", label: "Industries we help" },
    { href: "/demo", label: "Interactive card demo" },
    { href: "/contact", label: "Contact" },
    { href: "/login", label: "Customer login" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
} as const;

export const audiences = [
  "Home services",
  "Contractors",
  "Roofers",
  "Landscapers",
  "Auto detailers",
  "Barbers & salons",
  "Cleaning companies",
  "Local shops",
  "Mechanics",
  "Mobile services",
] as const;
