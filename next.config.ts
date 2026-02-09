import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Ensure we are not using experimental features that might break build
  experimental: {
    turbo: {
      // Explicitly trying to disable or configure turbo if needed, 
      // but passing empty object or just omitting it is safer if we want to avoid "turbopack" issues.
      // For now, let's keep it clean.
    }
  }
};

export default nextConfig;
