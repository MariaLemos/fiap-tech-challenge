/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix:
    process.env.AUTH_ASSET_PREFIX === undefined
      ? ""
      : process.env.AUTH_ASSET_PREFIX,
  transpilePackages: ["@repo/auth", "@repo/design-system", "@repo/i18n"],
};

export default nextConfig;
