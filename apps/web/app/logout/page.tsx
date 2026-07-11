import { redirect } from "next/navigation";

export default function LogoutRedirectPage() {
  const authOrigin =
    process.env.NEXT_PUBLIC_AUTH_ORIGIN ?? "http://localhost:3000";
  const returnTo =
    process.env.NEXT_PUBLIC_APP_ORIGIN ?? "http://localhost:3000/";
  const target = new URL("/auth/logout", authOrigin);
  target.searchParams.set("returnTo", returnTo);
  redirect(target.toString());
}
