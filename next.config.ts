import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ✅ Skip ESLint checks during builds on Vercel
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
