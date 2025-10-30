import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google user content domain
      // Add other domains as needed
    ],
  },
};

export default nextConfig;
