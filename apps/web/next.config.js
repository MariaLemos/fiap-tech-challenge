import process from "node:process";

/** @type {import('next').NextConfig} */
const transactionsZoneOrigin =
  process.env.TRANSACTIONS_ZONE_ORIGIN || "http://localhost:3001";

const nextConfig = {
  transpilePackages: ["@repo/design-system"],
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/transactions",
          destination: `${transactionsZoneOrigin}/transactions`,
        },
        {
          source: "/transactions/:path+",
          destination: `${transactionsZoneOrigin}/transactions/:path+`,
        },
        {
          source: "/transactions-static/:path+",
          destination: `${transactionsZoneOrigin}/transactions-static/:path+`,
        },
      ],
    };
  },
};

export default nextConfig;
