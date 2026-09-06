import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { packageList } from "@/lib/packages";
import { planList } from "@/lib/services";

export function pageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = path === "/" ? title : `${title} | ${siteConfig.name}`;
  return {
    // The root layout template appends "| Maprizz"; the homepage supplies its own full title.
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}

const sameAs = [siteConfig.social.instagram, siteConfig.social.facebook, siteConfig.social.linkedin].filter(Boolean);

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/icon.svg`,
  image: `${siteConfig.url}/opengraph-image`,
  description: siteConfig.description,
  email: siteConfig.email,
  ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
  priceRange: "$$",
  areaServed: [
    { "@type": "City", name: siteConfig.location.city },
    { "@type": "AdministrativeArea", name: siteConfig.location.area },
    { "@type": "Country", name: "United States" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.location.city,
    addressRegion: "OR",
    addressCountry: "US",
  },
  founder: { "@type": "Person", name: siteConfig.founder.name },
  ...(sameAs.length ? { sameAs } : {}),
};

export const productsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    ...planList.map((plan, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: `Maprizz ${plan.name}`,
        description: plan.tagline,
        provider: { "@id": `${siteConfig.url}/#organization` },
        areaServed: siteConfig.location.area,
        offers: {
          "@type": "Offer",
          price: (plan.monthly / 100).toFixed(2),
          priceCurrency: "USD",
          url: `${siteConfig.url}/subscribe?plan=${plan.id}`,
        },
      },
    })),
    ...packageList.map((pkg, index) => ({
      "@type": "ListItem",
      position: planList.length + index + 1,
      item: {
        "@type": "Product",
        name: `Maprizz ${pkg.name}`,
        description: pkg.tagline,
        url: `${siteConfig.url}/order?package=${pkg.id}`,
        brand: { "@type": "Brand", name: siteConfig.name },
        offers: {
          "@type": "Offer",
          price: (pkg.price / 100).toFixed(2),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${siteConfig.url}/order?package=${pkg.id}`,
        },
      },
    })),
  ],
};

export function faqJsonLd(items: ReadonlyArray<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
