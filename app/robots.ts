import type { MetadataRoute } from "next";

// NEXT_PUBLIC_SITE_URL should be set to the deployed domain (e.g.
// https://payana-stories.vercel.app) in production — falls back to localhost so `next
// dev` still renders something sane without extra env setup.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Signed-in-only surfaces and API routes have nothing worth
        // indexing and would otherwise waste crawl budget or, worse, get
        // treated as thin/duplicate content behind a sign-in wall.
        disallow: ["/api/", "/bookings", "/profile", "/destinations/*/book"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
