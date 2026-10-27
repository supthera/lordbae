import type { MetadataRoute } from "next";

import { properties } from "@/lib/properties";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/tools`, changeFrequency: "monthly", priority: 0.6 },
    ...properties.map((property) => ({
      url: `${siteUrl}/collection/${property.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
