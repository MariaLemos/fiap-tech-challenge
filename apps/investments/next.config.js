import { withMicrofrontends } from "@vercel/microfrontends/next/config";
import process from "node:process";

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix:
    process.env.INVESTMENTS_ASSET_PREFIX === undefined
      ? "/investments-static"
      : process.env.INVESTMENTS_ASSET_PREFIX,
  transpilePackages: ["@repo/auth", "@repo/contracts", "@repo/design-system", "@repo/i18n", "@repo/utils"],
};

export default withMicrofrontends(nextConfig);
