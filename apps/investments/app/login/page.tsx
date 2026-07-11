import { redirect } from "next/navigation";

export default function LoginRedirectPage() {
  const authOrigin =
    process.env.NEXT_PUBLIC_AUTH_ORIGIN ?? "http://localhost:3002";
  const target = new URL("/login", authOrigin);
  target.searchParams.set(
    "returnTo",
    process.env.NEXT_PUBLIC_INVESTMENTS_ORIGIN ?? "http://localhost:3001/",
  );
  redirect(target.toString());
}
