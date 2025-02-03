import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    TMDB_BASE_URL: process.env.NEXT_PUBLIC_TMDB_BASE_URL || "",
    TMDB_IMAGE_SERVICE_URL: process.env.NEXT_PUBLIC_TMDB_IMAGE_SERVICE_URL || "",
    TMDB_API_TOKEN: process.env.NEXT_PUBLIC_TMDB_API_TOKEN || "",
  },
  images: {
    domains: [
      "images.unsplash.com",
      "via.placeholder.com",
      "picsum.photos",
      "image.tmdb.org",
    ],
  },
};

export default nextConfig;
