/**
 * The product catalog. Prices live here, on the server, and are never trusted from the
 * client. Amounts are in US cents.
 */

export type PackageId = "tap_card" | "smart_card" | "business_kit";

export type Package = {
  id: PackageId;
  name: string;
  price: number;
  priceLabel: string;
  tagline: string;
  includes: string[];
  cta: string;
  popular?: boolean;
  /** Ships with a Maprizz digital profile page. */
  hasProfile: boolean;
  /** Ships with a Google review NFC stand (creates a review tap link). */
  hasReviewStand: boolean;
};

export const packages: Record<PackageId, Package> = {
  tap_card: {
    id: "tap_card",
    name: "Tap Card",
    price: 4900,
    priceLabel: "$49",
    tagline: "A branded NFC card that opens your website when tapped.",
    includes: [
      "Custom NFC card",
      "Tap directly to your website",
      "QR backup",
      "Logo setup",
      "Permanent Maprizz URL",
      "Change your destination later",
    ],
    cta: "Get Tap Card",
    hasProfile: false,
    hasReviewStand: false,
  },
  smart_card: {
    id: "smart_card",
    name: "Smart Business Card",
    price: 7900,
    priceLabel: "$79",
    tagline: "An NFC card that opens your mobile digital business profile.",
    includes: [
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
    cta: "Build My Card",
    popular: true,
    hasProfile: true,
    hasReviewStand: false,
  },
  business_kit: {
    id: "business_kit",
    name: "Business Kit",
    price: 14900,
    priceLabel: "$149",
    tagline: "Smart card plus a Google review stand for the counter.",
    includes: [
      "Smart Business Card",
      "Google Review NFC stand",
      "QR codes",
      "Google review setup",
      "Digital profile",
      "Maprizz setup",
    ],
    cta: "Get Business Kit",
    hasProfile: true,
    hasReviewStand: true,
  },
};

export const packageList: Package[] = [packages.tap_card, packages.smart_card, packages.business_kit];

export const packageIds = ["tap_card", "smart_card", "business_kit"] as const;

export function isPackageId(value: unknown): value is PackageId {
  return typeof value === "string" && (packageIds as readonly string[]).includes(value);
}

export function formatCents(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    cents / 100,
  );
}
