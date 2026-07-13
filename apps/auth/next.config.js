import process from "node:process";

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix:
    process.env.AUTH_ASSET_PREFIX === undefined
      ? "/auth-static"
      : process.env.AUTH_ASSET_PREFIX,
  transpilePackages: ["@repo/auth", "@repo/design-system", "@repo/i18n"],
};

export default nextConfig;
