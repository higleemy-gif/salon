/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export", // fully static build → works on Cloudflare Pages "Static HTML Export"
  images: {
    unoptimized: true, // required for static export (no Node runtime to optimize)
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" }
    ]
  }
};

export default nextConfig;
