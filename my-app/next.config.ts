import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.VERCEL_ENV === "production"
    ? "/projects/hotel-ai-assistant/demo"
    : "",
};

export default nextConfig;