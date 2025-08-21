import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow common remote hosts; adjust as needed in Admin usage
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "*.cloudfront.net" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
