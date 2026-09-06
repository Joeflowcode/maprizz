import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: { root: __dirname },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/free-audit", destination: "/audit", permanent: true },
      { source: "/start", destination: "/audit", permanent: false },
      { source: "/start-plan", destination: "/subscribe", permanent: false },
      { source: "/services/:path+", destination: "/services", permanent: true },
      { source: "/pricing", destination: "/services", permanent: false },
    ];
  },
};

export default nextConfig;
