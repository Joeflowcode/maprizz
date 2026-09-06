import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: Array<{ path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }> = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/subscribe", priority: 0.9, changeFrequency: "monthly" },
    { path: "/audit", priority: 0.9, changeFrequency: "monthly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/bend", priority: 0.8, changeFrequency: "monthly" },
    { path: "/for", priority: 0.8, changeFrequency: "monthly" },
    { path: "/for/contractors", priority: 0.7, changeFrequency: "monthly" },
    { path: "/for/home-services", priority: 0.7, changeFrequency: "monthly" },
    { path: "/for/auto-detailers", priority: 0.6, changeFrequency: "monthly" },
    { path: "/for/barbers-salons", priority: 0.6, changeFrequency: "monthly" },
    { path: "/demo", priority: 0.6, changeFrequency: "monthly" },
    { path: "/order", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
