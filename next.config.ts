import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  cacheComponents: true,
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thfmstpphfvwuikxmssr.supabase.co",
      }
    ]
  }
};

export default nextConfig;
