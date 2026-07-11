import { withMicrofrontends } from "@vercel/microfrontends/next/config";
import process from "node:process";

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix:
    process.env.INVESTMENTS_ASSET_PREFIX === undefined
      ? "/investments-static"
      : process.env.INVESTMENTS_ASSET_PREFIX,
  transpilePackages: ["@repo/auth", "@repo/contracts", "@repo/design-system", "@repo/i18n", "@repo/utils"],
  async rewrites() {
    const authOrigin = process.env.AUTH_ORIGIN ?? "http://localhost:3002";

    return [
      {
        source: "/auth-static/:path*",
        destination: `${authOrigin}/auth-static/:path*`,
      },
      {
        source: "/auth/:path*",
        destination: `${authOrigin}/:path*`,
      },
    ];
  },
};

export default withMicrofrontends(nextConfig);
