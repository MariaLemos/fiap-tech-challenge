import { NextResponse } from "next/server";
import { auth } from "../../../auth";

const allowedOrigins = new Set(
  [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3024",
    "http://localhost:4201",
    process.env.NEXT_PUBLIC_APP_ORIGIN,
    process.env.NEXT_PUBLIC_INVESTMENTS_ORIGIN,
    process.env.NEXT_PUBLIC_AUTH_ORIGIN,
  ].filter((value): value is string => Boolean(value)),
);

function createCorsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "cache-control": "no-store",
  };

  if (!origin || !allowedOrigins.has(origin)) {
    return headers;
  }

  headers["access-control-allow-origin"] = origin;
  headers["access-control-allow-credentials"] = "true";
  headers.vary = "Origin";

  return headers;
}

export async function GET(request: Request) {
  const session = await auth();
  const origin = request.headers.get("origin");

  return NextResponse.json(
    {
      authenticated: Boolean(session?.user),
      user: session?.user ?? null,
    },
    {
      headers: createCorsHeaders(origin),
    },
  );
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  const headers = createCorsHeaders(origin);

  return new NextResponse(null, {
    status: 204,
    headers: {
      ...headers,
      "access-control-allow-methods": "GET, OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
}
