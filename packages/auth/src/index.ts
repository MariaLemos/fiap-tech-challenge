import { compare, hashSync } from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

type SessionResponse = {
  authenticated: boolean;
  user: SessionUser | null;
};

type RateLimitEntry = {
  attempts: number;
  resetAt: number;
};

type AuthBuilderOptions = {
  cookieDomain?: string;
  cookieName?: string;
};

const rateLimitStore = new Map<string, RateLimitEntry>();
let devPasswordHashCache: string | null = null;
let devFiapPasswordHashCache: string | null = null;

function getRateLimitWindowMs() {
  const minutes = Number(process.env.AUTH_RATE_LIMIT_WINDOW_MINUTES ?? "15");
  return Number.isFinite(minutes) && minutes > 0 ? minutes * 60 * 1000 : 15 * 60 * 1000;
}

function getRateLimitMaxAttempts() {
  const maxAttempts = Number(process.env.AUTH_RATE_LIMIT_MAX_ATTEMPTS ?? "5");
  return Number.isFinite(maxAttempts) && maxAttempts > 0 ? maxAttempts : 5;
}

function buildRateLimitKey(ip: string, email: string) {
  return `${ip.toLowerCase()}::${email.toLowerCase()}`;
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (!forwarded) return "unknown";
  return forwarded.split(",")[0]?.trim() || "unknown";
}

function enforceRateLimit(request: Request, email: string) {
  const now = Date.now();
  const key = buildRateLimitKey(getClientIp(request), email);
  const windowMs = getRateLimitWindowMs();
  const maxAttempts = getRateLimitMaxAttempts();

  const current = rateLimitStore.get(key);

  if (!current || now > current.resetAt) {
    rateLimitStore.set(key, { attempts: 1, resetAt: now + windowMs });
    return;
  }

  if (current.attempts >= maxAttempts) {
    throw new Error("Muitas tentativas de login. Tente novamente mais tarde.");
  }

  current.attempts += 1;
  rateLimitStore.set(key, current);
}

function clearRateLimit(request: Request, email: string) {
  const key = buildRateLimitKey(getClientIp(request), email);
  rateLimitStore.delete(key);
}

function parseMockUsersFromEnv(): AuthUser[] {
  const json = process.env.AUTH_MOCK_USERS_JSON;
  if (json) {
    const parsed = JSON.parse(json) as AuthUser[];
    return parsed;
  }

  const email = process.env.AUTH_MOCK_USER_EMAIL;
  const name = process.env.AUTH_MOCK_USER_NAME;
  const passwordHash = process.env.AUTH_MOCK_USER_PASSWORD_HASH;

  if (email && name && passwordHash) {
    return [
      {
        id: "1",
        email,
        name,
        passwordHash,
      },
    ];
  }

  if (process.env.NODE_ENV !== "production") {
    if (!devPasswordHashCache) {
      devPasswordHashCache = hashSync("290596", 10);
    }

    if (!devFiapPasswordHashCache) {
      devFiapPasswordHashCache = hashSync("fiap 123", 10);
    }

    return [
      {
        id: "dev-1",
        email: "mariaj.lemos@yahoo.com",
        name: "maria",
        passwordHash: devPasswordHashCache,
      },
      {
        id: "dev-2",
        email: "fiap@teste.com",
        name: "fiap",
        passwordHash: devFiapPasswordHashCache,
      },
    ];
  }

  throw new Error(
    "Configure AUTH_MOCK_USERS_JSON ou AUTH_MOCK_USER_EMAIL/AUTH_MOCK_USER_NAME/AUTH_MOCK_USER_PASSWORD_HASH.",
  );

}

function findUserByEmail(users: AuthUser[], email: string) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

function getAllowedRedirectOrigins() {
  const raw = process.env.AUTH_ALLOWED_ORIGINS ?? "";
  const configured = raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const defaults = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:4201",
    process.env.NEXT_PUBLIC_APP_ORIGIN,
    process.env.NEXT_PUBLIC_INVESTMENTS_ORIGIN,
    process.env.NEXT_PUBLIC_AUTH_ORIGIN,
    process.env.NEXT_PUBLIC_FINANCIAL_ALERTS_ORIGIN,
  ].filter((origin): origin is string => Boolean(origin?.trim()));

  const normalized = [...configured, ...defaults].map((origin) => {
    try {
      return new URL(origin).origin;
    } catch {
      return "";
    }
  });

  return Array.from(new Set(normalized.filter(Boolean)));
}

function resolveAuthSecret() {
  const envSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (envSecret?.trim()) return envSecret;

  if (process.env.NODE_ENV !== "production") {
    return "dev-auth-secret-change-me";
  }

  throw new Error("AUTH_SECRET não definido em produção.");
}

export function createAuthConfig(options?: AuthBuilderOptions): NextAuthConfig {
  const cookieDomain = options?.cookieDomain ?? process.env.AUTH_COOKIE_DOMAIN;
  const cookieName = options?.cookieName ?? process.env.AUTH_COOKIE_NAME ?? "authjs.session-token";

  return {
    secret: resolveAuthSecret(),
    trustHost: true,
    pages: {
      signIn: "/login",
    },
    session: {
      strategy: "jwt",
    },
    providers: [
      Credentials({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Senha", type: "password" },
        },
        authorize: async (credentials, request) => {
          const email = String(credentials?.email ?? "").trim().toLowerCase();
          const password = String(credentials?.password ?? "");

          if (!email || !password) return null;

          enforceRateLimit(request, email);
          const users = parseMockUsersFromEnv();
          const user = findUserByEmail(users, email);
          if (!user) return null;

          const validPassword = await compare(password, user.passwordHash);
          if (!validPassword) return null;

          clearRateLimit(request, email);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        },
      }),
    ],
    callbacks: {
      jwt({ token, user }) {
        if (user) {
          token["id"] = user.id;
          token.name = user.name;
          token.email = user.email;
        }
        return token;
      },
      session({ session, token }) {
        if (session.user) {
          session.user.id = String(token["id"] ?? "");
          session.user.name = String(token.name ?? "");
          session.user.email = String(token.email ?? "");
        }
        return session;
      },
      redirect({ url, baseUrl }) {
        if (url.startsWith("/")) return `${baseUrl}${url}`;

        const allowedOrigins = getAllowedRedirectOrigins();
        const candidate = new URL(url);
        if (allowedOrigins.includes(candidate.origin)) return url;

        return baseUrl;
      },
    },
    cookies: {
      sessionToken: {
        name: cookieName,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: process.env.NODE_ENV === "production",
          domain: cookieDomain,
        },
      },
    },
  };
}

export async function fetchCentralSession(input: {
  authOrigin: string;
  cookieHeader?: string;
}): Promise<SessionResponse> {
  const response = await fetch(`${input.authOrigin}/api/session`, {
    method: "GET",
    cache: "no-store",
    headers: input.cookieHeader
      ? {
          cookie: input.cookieHeader,
        }
      : undefined,
  });

  if (!response.ok) {
    return { authenticated: false, user: null };
  }

  return (await response.json()) as SessionResponse;
}

export function buildCookieHeader(
  cookieStore: { getAll: () => Array<{ name: string; value: string }> },
) {
  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
    };
  }

  interface User {
    id: string;
  }
}

