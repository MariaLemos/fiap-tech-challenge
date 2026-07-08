import process from "node:process";

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix:
    process.env.TRANSACTIONS_ASSET_PREFIX === undefined
      ? "/transactions-static"
      : process.env.TRANSACTIONS_ASSET_PREFIX,
  transpilePackages: ["@repo/contracts", "@repo/design-system", "@repo/utils"],
};

export default nextConfig;
