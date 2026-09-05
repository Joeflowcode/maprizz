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
    badge: "Most popular",
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
    name: "Google Business Profile",
    price: 149,
    priceLabel: "$149",
    cadence: "/ month",
    note: "Month to month. Cancel any time. Setup included.",
    badge: null as string | null,
    description:
      "We run your Google listing so you show up first and look like the obvious choice.",
    href: "/audit?plan=gbp",
    features: [
      "Full profile optimization: categories, services, hours, description, photos",
      "Weekly Google posts and fresh photos",
      "Replies to every review within 48 hours, in your voice",
      "Q&A monitoring and spam-review reporting",
      "Google review stand included, with review-link tap tracking",
      "Monthly report: calls, direction requests, website clicks, review-link taps",
    ],
  },
  {
    id: "website" as const,
    name: "Website + Local SEO",
    price: 299,
    priceLabel: "$299",
    cadence: "/ month",
    note: "Site build included. 6-month minimum, then month to month. You own the domain and content.",
    badge: null,
    description:
      "A fast, mobile-first website built for your trade, kept current and tuned to rank in your service area.",
    href: "/audit?plan=website",
    features: [
      "New website designed and built in the first 30 days",
      "Hosting, SSL, backups and updates handled",
      "Unlimited small edits: prices, photos, hours, new services",
      "Local SEO: a page for each service and each town you serve",
      "Click-to-call, booking and review links wired to your Maprizz card",
      "Monthly report: search rankings, visitors, calls and form fills",
    ],
  },
  {
    id: "growth" as const,
    name: "Growth Plan",
    price: 399,
    priceLabel: "$399",
    cadence: "/ month",
    note: "6-month minimum, then month to month. Saves $49/month versus the two plans separately.",
    badge: "Best value",
    description:
      "Everything in both plans, plus the hardware. One partner for how customers find, contact and review you.",
    href: "/audit?plan=growth",
    features: [
      "Everything in Google Business Profile",
      "Everything in Website + Local SEO",
      "Business Kit included: Smart Business Card + review stand",
      "Extra cards for your crew at cost",
      "Quarterly strategy call: what to fix, what to double down on",
      "Priority support, same-day replies",
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
      "No, and we won't pretend otherwise. Google doesn't share that with anyone. Maprizz tracks how many people tapped your review link, which is a strong signal, and you can watch your review count on Google itself.",
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
      "No. The Tap Card, Smart Business Card and Business Kit are one-time purchases and keep working forever. Plans are for businesses that want Maprizz to actively run their Google presence or website.",
  },
  {
    question: "Am I locked into a contract?",
    answer:
      "The Google Business Profile plan is month to month from day one. Website plans have a 6-month minimum because we build the site up front; after that, month to month. Cancel by email, no hoops.",
  },
  {
    question: "Who owns the website and the Google profile?",
    answer:
      "You do. Your domain stays in your name, your Google Business Profile stays under your Google account (we're added as a manager), and if you leave we hand over the site files.",
  },
  {
    question: "Can you guarantee rankings or a number of reviews?",
    answer:
      "No, and anyone who does is guessing. We can guarantee the work gets done every month and show you the numbers Google reports. Most local businesses see the biggest change simply from a complete, active profile and an easy way to ask for reviews.",
  },
] as const;

export const auditInterests = [
  { value: "unsure", label: "Not sure yet, just want the audit" },
  { value: "cards", label: "NFC cards / review stand only" },
  { value: "gbp", label: "Google Business Profile plan ($149/mo)" },
  { value: "website", label: "Website + Local SEO plan ($299/mo)" },
  { value: "growth", label: "Growth Plan ($399/mo)" },
] as const;

export function getProduct(id: ProductPackage) {
  return products.find((p) => p.id === id) ?? products[1];
}

export function getServicePlan(id: ServicePlan) {
  return servicePlans.find((p) => p.id === id) ?? servicePlans[0];
}
