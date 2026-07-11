import { redirect } from "next/navigation";

export default function LoginRedirectPage() {
  const authPathPrefix = process.env.NEXT_PUBLIC_AUTH_PATH_PREFIX ?? "";
  const normalizedAuthPathPrefix =
    authPathPrefix === "/"
      ? ""
      : authPathPrefix.endsWith("/")
        ? authPathPrefix.slice(0, -1)
        : authPathPrefix;
  const authOrigin =
    process.env.NEXT_PUBLIC_AUTH_ORIGIN ?? "http://localhost:3002";
  const target = new URL(`${normalizedAuthPathPrefix}/login`, authOrigin);
  target.searchParams.set(
    "returnTo",
    process.env.NEXT_PUBLIC_INVESTMENTS_ORIGIN ?? "http://localhost:3001/",
  );
  redirect(target.toString());
}
