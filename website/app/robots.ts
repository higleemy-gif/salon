import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // /admin is the billing dashboard and /api the backend; keep them out of search results.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
