import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { joeyCopy } from "./seed";

export const referralMetadata: Metadata = {
  title: `${joeyCopy.firstName} · ${joeyCopy.brand}`,
  description: joeyCopy.headline,
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: `${joeyCopy.firstName} · ${joeyCopy.brand}`,
    description: joeyCopy.headline,
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
};
