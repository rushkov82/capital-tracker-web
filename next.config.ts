import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.241", "192.168.1.244", "192.168.1.114"],
  devIndicators: false,
};

export default nextConfig;