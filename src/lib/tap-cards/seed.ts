import type { ReferralCard } from "./types";

export const JOEY_CARD_SLUG = "joey";

export const seedCards: ReferralCard[] = [
  {
    id: "card_joey",
    slug: JOEY_CARD_SLUG,
    referrer_name: "Joey",
    label: "Joey's personal card",
    created_at: "2026-09-05T00:00:00.000Z",
    active: true,
  },
  {
    id: "card_jacqueline",
    slug: "jacqueline",
    referrer_name: "Jacqueline",
    label: "Jacqueline",
    created_at: "2026-09-05T00:00:00.000Z",
    active: true,
  },
  {
    id: "card_doug",
    slug: "doug",
    referrer_name: "Doug",
    label: "Doug",
    created_at: "2026-09-05T00:00:00.000Z",
    active: true,
  },
];

export const joeyCopy = {
  firstName: "Joey",
  brand: "Maprizz",
  headline: "I help local businesses get found, get reviews, and get more customers.",
  support:
    "Websites, Google Business Profile optimization, review systems, SEO, and simple tools that help local businesses grow.",
} as const;

export const cardServices = [
  {
    title: "Google Business Profile",
    body: "Improve visibility on Google Maps and local search.",
  },
  {
    title: "Google Review Systems",
    body: "NFC/QR tap cards and review stands that make getting reviews easier.",
  },
  {
    title: "Websites",
    body: "Fast, modern websites built to turn visitors into customers.",
  },
  {
    title: "Local SEO",
    body: "Help businesses rank higher for searches in their area.",
  },
  {
    title: "Digital Business Cards",
    body: "Tap a card and instantly open contact info, social links, websites, reviews, and more.",
  },
] as const;

export const leadHelpOptions = [
  { value: "google-business-profile", label: "Google Business Profile" },
  { value: "review-systems", label: "Google Review Systems" },
  { value: "website", label: "Website" },
  { value: "local-seo", label: "Local SEO" },
  { value: "digital-cards", label: "Digital Business Cards" },
  { value: "not-sure", label: "Not sure yet — just want the free audit" },
] as const;

export const reservedSlugs = new Set([
  "admin",
  "api",
  "audit",
  "auth",
  "card",
  "cards",
  "contact",
  "dashboard",
  "demo",
  "favicon.ico",
  "link-unavailable",
  "login",
  "order",
  "p",
  "pricing",
  "privacy",
  "r",
  "robots.txt",
  "services",
  "sitemap.xml",
  "t",
  "terms",
]);
