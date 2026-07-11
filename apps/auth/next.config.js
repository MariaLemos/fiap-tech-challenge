/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/auth", "@repo/design-system", "@repo/i18n"],
};

export default nextConfig;
