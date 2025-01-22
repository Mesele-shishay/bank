import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true, // Not recommended for production
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
