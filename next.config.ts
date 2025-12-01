import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactCompiler: true,
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qjjarqeqcmhzqknguofp.supabase.co",
      },
    ],
  },
};

export default nextConfig;
