import { redirect } from "next/navigation";

export default function LoginRedirectPage() {
  const authOrigin =
    process.env.NEXT_PUBLIC_AUTH_ORIGIN ?? "http://localhost:3000";
  const target = new URL("/auth/login", authOrigin);
  target.searchParams.set(
    "returnTo",
    process.env.NEXT_PUBLIC_APP_ORIGIN ?? "http://localhost:3000/",
  );
  redirect(target.toString());
}
