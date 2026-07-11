/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/contracts", "@repo/design-system", "@repo/i18n", "@repo/utils"],
};

export default nextConfig;
