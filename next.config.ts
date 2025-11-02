import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
	transpilePackages: ["@web3-university/uni-wallet-lib", "@web3-university/ui"],
	experimental: {
		externalDir: true,
	},
};

export default withNextIntl(nextConfig);
