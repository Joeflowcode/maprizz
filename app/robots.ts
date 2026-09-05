import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard",
        "/admin",
        "/login",
        "/t/",
        "/r/",
        "/p/",
        "/order/success",
        "/link-unavailable",
      ],
    },
    host: site.url,
    sitemap: `${site.url}/sitemap.xml`,
  };
}
