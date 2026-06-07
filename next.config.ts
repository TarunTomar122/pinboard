import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/pinboard",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
