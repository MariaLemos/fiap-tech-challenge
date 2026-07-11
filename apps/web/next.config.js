/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/contracts", "@repo/design-system", "@repo/utils"],
};

export default nextConfig;
