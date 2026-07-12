import { withMicrofrontends } from "@vercel/microfrontends/next/config";
import process from "node:process";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/auth", "@repo/contracts", "@repo/design-system", "@repo/i18n", "@repo/utils"],
  async rewrites() {
    const investmentsOrigin =
      process.env.INVESTMENTS_ORIGIN ?? "http://localhost:3001";
    const authOrigin = process.env.AUTH_ORIGIN ?? "http://localhost:3002";

    return [
      {
        source: "/api/auth/:path*",
        destination: `${authOrigin}/api/auth/:path*`,
      },
      {
        source: "/api/session",
        destination: `${authOrigin}/api/session`,
      },
      {
        source: "/auth",
        destination: `${authOrigin}/`,
      },
      {
        source: "/auth/:path*",
        destination: `${authOrigin}/:path*`,
      },
      {
        source: "/investments-static/:path*",
        destination: `${investmentsOrigin}/investments-static/:path*`,
      },
      {
        source: "/investments/:path*",
        destination: `${investmentsOrigin}/investments/:path*`,
      },
      {
        source: "/investments",
        destination: `${investmentsOrigin}/investments`,
      },
    ];
  },
};

export default withMicrofrontends(nextConfig);
