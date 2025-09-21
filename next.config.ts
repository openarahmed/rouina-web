import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This wildcard allows all hostnames
      },
      {
        protocol: 'http',
        hostname: '**', // This is for non-HTTPS sources
      },
    ],
  },
  /* other config options can go here */
};

export default nextConfig;