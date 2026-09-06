export type ProductPackage = "tap_card" | "smart_card" | "business_kit";

export type ServicePlan = "gbp" | "website" | "growth";

export const products = [
  {
    id: "tap_card" as const,
    name: "Tap Card",
    price: 49,
    priceLabel: "$49",
    cadence: "one time",
    description: "A branded NFC card that opens your website when tapped.",
    badge: null as string | null,
    cta: "Get Tap Card",
    href: "/order?package=tap_card",
    features: [
      "Custom NFC card",
      "Tap directly to your website",
      "QR backup",
      "Logo setup",
      "Permanent Maprizz URL",
      "Change your destination later",
    ],
  },
  {
    id: "smart_card" as const,
    name: "Smart Business Card",
    price: 79,
    priceLabel: "$79",
    cadence: "one time",
    description:
      "An NFC card that opens your mobile digital business profile.",
    badge: "Digital profile",
    cta: "Build My Card",
    href: "/order?package=smart_card",
    features: [
      "Custom NFC card",
      "Maprizz digital profile",
      "Call",
      "Text",
      "Website",
      "Directions",
      "Social links",
      "Save Contact",
      "QR backup",
      "Update links later",
    ],
  },
  {
    id: "business_kit" as const,
    name: "Business Kit",
    price: 149,
    priceLabel: "$149",
    cadence: "one time",
    description: "Smart card plus a Google review stand for the counter.",
    badge: null,
    cta: "Get Business Kit",
    href: "/order?package=business_kit",
    features: [
      "Smart Business Card",
      "Google Review NFC stand",
      "QR codes",
      "Google review setup",
      "Digital profile",
      "Maprizz setup",
    ],
  },
] as const;

export const servicePlans = [
  {
    id: "gbp" as const,
    name: "Google Foundations",
    price: 299,
    priceLabel: "$299",
    cadence: "/mo",
    note: "Setup included. Month to month.",
    badge: null as string | null,
    description: "For businesses that need a complete, active Google presence.",
    href: "/audit?plan=gbp",
    features: [
      "One Google Business Profile optimized and maintained",
      "4 posts per month using your updates and photos",
      "Up to 20 review replies per month",
      "One Google review stand + review-link setup",
      "Monthly report on available profile activity",
    ],
  },
  {
    id: "website" as const,
    name: "Website + Local SEO",
    price: 599,
    priceLabel: "$599",
    cadence: "/mo",
    note: "Build included. 6-month initial term.",
    badge: null,
    description: "For businesses ready for a website that makes the next step easy.",
    href: "/audit?plan=website",
    features: [
      "Custom mobile-friendly website, up to 5 pages",
      "Hosting, SSL, and maintenance included",
      "Service and service-area content within the page allowance",
      "Up to 2 small content edits per month",
      "Call, quote, and booking links + available analytics",
    ],
  },
  {
    id: "growth" as const,
    name: "Local Growth",
    price: 799,
    priceLabel: "$799",
    cadence: "/mo",
    note: "Setup + build included. 6-month initial term.",
    badge: "The complete plan",
    description: "Your Google presence, website, and review tools. One local partner.",
    href: "/audit?plan=growth",
    features: [
      "Everything in Google Foundations",
      "Everything in Website + Local SEO",
      "Smart business card + review stand included",
      "One new or improved service page per month",
      "Monthly 30-minute progress and priorities call",
    ],
  },
] as const;

export const homeFaqs = [
  {
    question: "Does the customer need an app?",
    answer:
      "No. NFC-enabled modern smartphones read the card natively and open the link in the browser. Every card also carries a QR code as a backup for phones without NFC.",
  },
  {
    question: "What happens if I change my website or phone number later?",
    answer:
      "Nothing changes on the card. Every Maprizz product points to a permanent short URL like maprizz.com/t/ABC123. You change where it goes from your dashboard and the card keeps working.",
  },
  {
    question: "Can Maprizz tell me how many Google reviews I got?",
    answer:
      "A tap is not a completed review. Review-link taps and changes in your visible Google review count are different measures; we report them separately where available.",
  },
  {
    question:
      "What's the difference between the Tap Card and the Smart Business Card?",
    answer:
      "The Tap Card opens one destination, usually your website. The Smart Business Card opens a Maprizz profile page with Call, Text, Website, Directions, socials and Save Contact all on one screen. Both use the same permanent URL system.",
  },
  {
    question: "How does the review stand work?",
    answer:
      "It sits on your counter or in your truck. A customer taps or scans it and lands directly on your Google review form. You set the review link once and can change it any time.",
  },
  {
    question: "Is asking for reviews allowed?",
    answer:
      "Yes. Asking customers to leave a review is fine. What's not allowed is offering incentives, gating (only asking happy customers), or writing reviews yourself. Maprizz makes the ask easier; it never fakes the review.",
  },
  {
    question: "Do I need a monthly plan to use the cards?",
    answer:
      "No. Cards and review stands are one-time purchases and keep working on their own. The monthly plans are for businesses that want Maprizz to actively run their Google Business Profile, website and local SEO. Plans are month to month; website plans have a 6-month minimum because the site is built up front.",
  },
  {
    question: "How long does it take?",
    answer:
      "Most cards ship within a few business days of your order. If we meet you in person, we can usually set up your profile and URLs on the spot and deliver the printed card shortly after.",
  },
] as const;

export const servicesFaqs = [
  {
    question: "Do I need a monthly plan to use the cards?",
    answer:
      "No. The Tap Card, Smart Business Card and Business Kit are one-time purchases and do not require a monthly service plan. Plans are for businesses that want Maprizz to actively run their Google presence or website.",
  },
  {
    question: "Am I locked into a contract?",
    answer:
      "Google Foundations is month to month from day one. Website plans have a 6-month minimum because we build the site up front; after that, month to month. Cancel by email, no hoops.",
  },
  {
    question: "Who owns the website and the Google profile?",
    answer:
      "You do. Your domain stays in your name, your Google Business Profile stays under your Google account (we're added as a manager), and if you leave we hand over the site files.",
  },
  {
    question: "Can you guarantee rankings or a number of reviews?",
    answer:
      "No. Rankings depend on factors such as relevance, distance, and competition. We commit to the work in your plan and report the metrics available to us. Review-link taps are not the same as completed reviews or booked jobs.",
  },
] as const;

export const auditInterests = [
  { value: "unsure", label: "Not sure yet, just want the audit" },
  { value: "cards", label: "NFC cards / review stand only" },
  { value: "gbp", label: "Google Foundations ($299/mo)" },
  { value: "website", label: "Website + Local SEO ($599/mo)" },
  { value: "growth", label: "Local Growth ($799/mo)" },
] as const;

export function getProduct(id: ProductPackage) {
  return products.find((p) => p.id === id) ?? products[1];
}

export function getServicePlan(id: ServicePlan) {
  return servicePlans.find((p) => p.id === id) ?? servicePlans[0];
}
