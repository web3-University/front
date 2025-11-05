import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  transpilePackages: ["@web3-university/uni-wallet-lib", "@web3-university/ui"],
  experimental: {
    externalDir: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": path.resolve(
        __dirname,
        "src/shims/asyncStorage.ts",
      ),
      "pino-pretty": path.resolve(__dirname, "src/shims/empty.ts"),
    };
    return config;
  },
};

export default withNextIntl(nextConfig);
