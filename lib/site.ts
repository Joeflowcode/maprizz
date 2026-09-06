export const site = {
  name: "Maprizz",
  legalName: "Maprizz",
  tagline: "Get found. Build trust. Grow locally.",
  description:
    "Google Business Profile management, websites, local SEO, and review tools for local businesses. Based in Bend, Oregon. Start with a free business audit.",
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
  { href: "/#services", label: "What we do" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#pricing", label: "Monthly plans" },
  { href: "/#cards", label: "Tap cards" },
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
