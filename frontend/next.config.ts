import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.88.123", "localhost", "127.0.0.1"],
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
