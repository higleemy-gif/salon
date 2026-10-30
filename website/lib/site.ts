// Public site URL used for SEO metadata, sitemap and robots.txt.
// Set NEXT_PUBLIC_SITE_URL at build time (e.g. https://mirrorsbeautyparlour.com).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://mirrors-salon.example.com").replace(/\/+$/, "");
