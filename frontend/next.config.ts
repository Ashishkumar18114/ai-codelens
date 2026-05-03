import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ['react','react-dom'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};
export default nextConfig;
