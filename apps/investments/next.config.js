import process from "node:process";

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix:
    process.env.INVESTMENTS_ASSET_PREFIX === undefined
      ? "/investments-static"
      : process.env.INVESTMENTS_ASSET_PREFIX,
  transpilePackages: ["@repo/contracts", "@repo/design-system", "@repo/i18n", "@repo/utils"],
};

export default nextConfig;
