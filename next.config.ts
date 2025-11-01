import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [
    "@web3-university/uni-wallet-lib",
    "@web3-university/ui"
  ],
  experimental: {
    // 启用实验性的外部目录支持
    externalDir: true,
  },
};

export default nextConfig;
