export const site = {
  name: "Maprizz",
  legalName: "Maprizz",
  tagline: "Tap. Get found. Get reviews. Get customers.",
  description:
    "Smart NFC business cards, Google review stands and digital profiles that help local businesses turn real-world conversations into customers.",
  url: "https://maprizz.com",
  domain: "maprizz.com",
  email: "hello@maprizz.com",
  phone: "",
  social: {
    instagram: "",
    facebook: "",
    linkedin: "",
  },
  analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID ?? "",
  cta: {
    primary: "Build My Tap Card",
    secondary: "Try the Demo",
  },
  compatibility:
    "Works with NFC-enabled modern smartphones, with QR as a backup. No app required.",
  disclaimer:
    "Google, Google Maps and Google Business Profile are trademarks of Google LLC. Maprizz is not affiliated with or endorsed by Google. Maprizz tracks taps on your review link; it cannot see whether a review was submitted.",
} as const;

export const navLinks = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/demo", label: "Demo" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/services", label: "Monthly plans" },
  { href: "/audit", label: "Free audit" },
] as const;

export const industries = [
  "Contractors",
  "Roofers",
  "Landscapers",
  "Detailers",
  "Barbers",
  "Salons",
  "Tattoo shops",
  "Restaurants",
  "Cleaning companies",
  "Realtors",
  "Photographers",
  "Mechanics",
  "Mobile services",
] as const;
