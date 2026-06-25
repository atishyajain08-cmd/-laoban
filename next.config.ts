import type { NextConfig } from "next";

// Static export for GitHub Pages, served from https://<user>.github.io/-laoban/
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/-laoban",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "lzbdavmurwmrsbfhubtu.supabase.co" },
    ],
  },
};

export default nextConfig;
