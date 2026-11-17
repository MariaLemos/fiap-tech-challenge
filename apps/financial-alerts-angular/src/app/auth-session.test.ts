import { filter, firstValueFrom, toArray } from "rxjs";
import { describe, expect, it, vi } from "vitest";
import { createAuthSession, type AuthSessionState } from "./auth-session";

function response(options: {
  ok?: boolean;
  authenticated?: boolean;
  jsonError?: Error;
}): Response {
  return {
    ok: options.ok ?? true,
    async json() {
      if (options.jsonError) throw options.jsonError;
      return { authenticated: options.authenticated };
    },
  } as Response;
}

function afterLoading(session$: ReturnType<typeof createAuthSession>) {
  return firstValueFrom(
    session$.pipe(filter((state) => state.status !== "loading")),
  );
}

describe("createAuthSession", () => {
  it("emits loading then ready for an authenticated session", async () => {
    const fetchSession = vi.fn(async () => response({ authenticated: true }));
    const redirect = vi.fn();
    const states = await firstValueFrom(
      createAuthSession({
        authOrigin: "https://auth.example.com",
        authPathPrefix: "/auth/",
        returnTo: "https://app.example.com/",
        fetchSession: fetchSession as typeof fetch,
        redirect,
      }).pipe(toArray()),
    );

    expect(states.map((state) => state.status)).toEqual(["loading", "ready"]);
    expect(fetchSession).toHaveBeenCalledWith(
      "https://auth.example.com/auth/api/session",
      { method: "GET", credentials: "include" },
    );
    expect(redirect).not.toHaveBeenCalled();
  });

  it("shares one request across subscribers", async () => {
    const fetchSession = vi.fn(async () => response({ authenticated: true }));
    const session$ = createAuthSession({
      authOrigin: "https://auth.example.com",
      authPathPrefix: "",
      returnTo: "https://app.example.com/",
      fetchSession: fetchSession as typeof fetch,
      redirect: vi.fn(),
    });

    const [first, second] = await Promise.all([
      afterLoading(session$),
      afterLoading(session$),
    ]);

    expect(first.status).toBe("ready");
    expect(second.status).toBe("ready");
    expect(fetchSession).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["non-2xx response", response({ ok: false })],
    ["unauthenticated payload", response({ authenticated: false })],
  ])("redirects once for %s", async (_label, fetchResponse) => {
    const redirect = vi.fn();
    const session$ = createAuthSession({
      authOrigin: "https://auth.example.com",
      authPathPrefix: "",
      returnTo: "https://app.example.com/dashboard",
      fetchSession: vi.fn(async () => fetchResponse) as typeof fetch,
      redirect,
    });

    const [first, second] = await Promise.all([
      afterLoading(session$),
      afterLoading(session$),
    ]);

    expect(first.status).toBe("redirecting");
    expect(second.status).toBe("redirecting");
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith(
      "https://auth.example.com/login?returnTo=https%3A%2F%2Fapp.example.com%2Fdashboard",
    );
  });

  it.each([
    ["network failure", new Error("offline"), undefined],
    ["invalid JSON", undefined, new Error("invalid json")],
  ])(
    "maps %s to an error without redirecting",
    async (_label, fetchError, jsonError) => {
      const redirect = vi.fn();
      const fetchSession = fetchError
        ? vi.fn(async () => Promise.reject(fetchError))
        : vi.fn(async () => response({ jsonError }));
      const state = await afterLoading(
        createAuthSession({
          authOrigin: "https://auth.example.com",
          authPathPrefix: "",
          returnTo: "https://app.example.com/",
          fetchSession: fetchSession as typeof fetch,
          redirect,
        }),
      );

      expect(state).toMatchObject<AuthSessionState>({
        status: "error",
        loginUrl:
          "https://auth.example.com/login?returnTo=https%3A%2F%2Fapp.example.com%2F",
      });
      expect(redirect).not.toHaveBeenCalled();
    },
  );

  it("fails without fetching when the auth origin is invalid", async () => {
    const fetchSession = vi.fn();
    const states = await firstValueFrom(
      createAuthSession({
        authOrigin: "not a valid origin",
        authPathPrefix: "",
        returnTo: "https://app.example.com/",
        fetchSession: fetchSession as typeof fetch,
        redirect: vi.fn(),
      }).pipe(toArray()),
    );

    expect(states.map((state) => state.status)).toEqual(["loading", "error"]);
    expect(fetchSession).not.toHaveBeenCalled();
  });

  it("does not redirect after the last subscriber leaves", async () => {
    let resolveResponse!: (value: Response) => void;
    const pendingResponse = new Promise<Response>((resolve) => {
      resolveResponse = resolve;
    });
    const redirect = vi.fn();
    const session$ = createAuthSession({
      authOrigin: "https://auth.example.com",
      authPathPrefix: "",
      returnTo: "https://app.example.com/",
      fetchSession: vi.fn(() => pendingResponse) as typeof fetch,
      redirect,
    });

    const subscription = session$.subscribe();
    subscription.unsubscribe();
    resolveResponse(response({ authenticated: false }));
    await pendingResponse;
    await Promise.resolve();

    expect(redirect).not.toHaveBeenCalled();
  });
});
