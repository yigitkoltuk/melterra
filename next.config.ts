import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // compiler: {
  //   removeConsole: true,
  // },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
