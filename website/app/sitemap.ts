import type { MetadataRoute } from "next";
import { SITE_URL as BASE } from "@/lib/site";

const ROUTES = ["", "/services", "/academy", "/branches", "/gallery", "/about", "/contact", "/book"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${BASE}${r}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.7
  }));
}
