import { redirect } from "next/navigation";

export default function LogoutRedirectPage() {
  const deployedOrigin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;
  const authPathPrefix = process.env.NEXT_PUBLIC_AUTH_PATH_PREFIX ?? "";
  const normalizedAuthPathPrefix =
    authPathPrefix === "/"
      ? ""
      : authPathPrefix.endsWith("/")
        ? authPathPrefix.slice(0, -1)
        : authPathPrefix;
  const authOrigin =
    process.env.NEXT_PUBLIC_AUTH_ORIGIN ??
    process.env.AUTH_ORIGIN ??
    deployedOrigin ??
    "http://localhost:3002";
  const returnTo =
    process.env.NEXT_PUBLIC_APP_ORIGIN ??
    (deployedOrigin ? `${deployedOrigin}/` : "http://localhost:3000/");
  const target = new URL(`${normalizedAuthPathPrefix}/logout`, authOrigin);
  target.searchParams.set("returnTo", returnTo);
  redirect(target.toString());
}
