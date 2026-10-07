import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.coingecko.com" },
      { protocol: "https", hostname: "coin-images.coingecko.com" },
    ],
  },
  async redirects() {
    return [{ source: "/faq", destination: "/#faq", permanent: false }];
  },
};

export default nextConfig;
