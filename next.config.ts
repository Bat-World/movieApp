import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_TMDB_BASE_URL: process.env.NEXT_PUBLIC_TMDB_BASE_URL || "",
    NEXT_PUBLIC_TMDB_IMAGE_SERVICE_URL: process.env.NEXT_PUBLIC_TMDB_IMAGE_SERVICE_URL || "",
    NEXT_PUBLIC_TMDB_API_TOKEN: process.env.NEXT_PUBLIC_TMDB_API_TOKEN || "",
    NEXT_PUBLIC_TMDB_API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY || "",
  },
  images: {
    domains: [
      "images.unsplash.com",
      "via.placeholder.com",
      "picsum.photos",
      "image.tmdb.org",
      "loodibee.com",
      "citypng.com", 
    ],
  },
};

export default nextConfig;
