import { redirect } from "next/navigation";

export default function LogoutRedirectPage() {
  const authPathPrefix = process.env.NEXT_PUBLIC_AUTH_PATH_PREFIX ?? "";
  const normalizedAuthPathPrefix =
    authPathPrefix === "/"
      ? ""
      : authPathPrefix.endsWith("/")
        ? authPathPrefix.slice(0, -1)
        : authPathPrefix;
  const authOrigin =
    process.env.NEXT_PUBLIC_AUTH_ORIGIN ?? "http://localhost:3002";
  const returnTo =
    process.env.NEXT_PUBLIC_INVESTMENTS_ORIGIN ?? "http://localhost:3001/";
  const target = new URL(`${normalizedAuthPathPrefix}/logout`, authOrigin);
  target.searchParams.set("returnTo", returnTo);
  redirect(target.toString());
}
