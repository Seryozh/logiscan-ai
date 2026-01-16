import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: {
      // Allow photos up to 10 Megabytes
      bodySizeLimit: '10mb',
      // Keep your allowed origins from the previous step
      allowedOrigins: ["localhost:3000", "192.168.50.70:3000"],
    },
  },
};

export default nextConfig;
