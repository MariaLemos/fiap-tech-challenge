import { redirect } from "next/navigation";

export default function LoginRedirectPage() {
  const deployedOrigin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;
  const authOrigin =
    process.env.NEXT_PUBLIC_AUTH_ORIGIN ??
    process.env.AUTH_ORIGIN ??
    deployedOrigin ??
    "http://localhost:3002";
  const target = new URL("/login", authOrigin);
  target.searchParams.set(
    "returnTo",
    process.env.NEXT_PUBLIC_APP_ORIGIN ??
      (deployedOrigin ? `${deployedOrigin}/` : "http://localhost:3000/"),
  );
  redirect(target.toString());
}
