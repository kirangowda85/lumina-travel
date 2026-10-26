import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/packages";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/destinations`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/concierge`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const destinationRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${siteUrl}/destinations/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...destinationRoutes];
}
