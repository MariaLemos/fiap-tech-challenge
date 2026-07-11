import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

function resolveJwtSecret() {
  const envSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (envSecret?.trim()) return envSecret;

  if (process.env.NODE_ENV !== "production") {
    return "dev-auth-secret-change-me";
  }

  throw new Error("AUTH_SECRET não definido em produção.");
}

function buildLoginRedirect(request: NextRequest) {
  const authOrigin =
    process.env.NEXT_PUBLIC_AUTH_ORIGIN ?? "http://localhost:3002";
  const authPathPrefix = process.env.NEXT_PUBLIC_AUTH_PATH_PREFIX ?? "";
  const normalizedAuthPathPrefix =
    authPathPrefix === "/"
      ? ""
      : authPathPrefix.endsWith("/")
        ? authPathPrefix.slice(0, -1)
        : authPathPrefix;
  const loginUrl = new URL(
    `${normalizedAuthPathPrefix}/login`,
    authOrigin,
  );
  loginUrl.searchParams.set("returnTo", request.url);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/login" ||
    pathname === "/logout" ||
    pathname === "/auth" ||
    pathname.startsWith("/auth/")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: resolveJwtSecret(),
  });

  if (!token) {
    return buildLoginRedirect(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
