import {
  catchError,
  defer,
  from,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  type Observable,
} from "rxjs";

export type AuthSessionState =
  | { status: "loading"; loginUrl: string | null }
  | { status: "ready"; loginUrl: string | null }
  | { status: "redirecting"; loginUrl: string }
  | { status: "error"; loginUrl: string | null };

export type AuthSessionOptions = {
  authOrigin: string;
  authPathPrefix: string;
  returnTo: string;
  fetchSession?: typeof fetch;
  redirect?: (url: string) => void;
};

type SessionPayload = { authenticated?: boolean };

export function createAuthSession(
  options: AuthSessionOptions,
): Observable<AuthSessionState> {
  const authPathPrefix = normalizePathPrefix(options.authPathPrefix);
  const loginUrl = buildUrl(
    options.authOrigin,
    `${authPathPrefix}/login`,
    options.returnTo,
  );
  const sessionUrl = buildUrl(
    options.authOrigin,
    `${authPathPrefix}/api/session`,
  );

  if (!sessionUrl) {
    return from([
      { status: "loading", loginUrl } as AuthSessionState,
      { status: "error", loginUrl } as AuthSessionState,
    ]).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  const fetchSession =
    options.fetchSession ?? globalThis.fetch.bind(globalThis);
  const redirect =
    options.redirect ?? ((url: string) => globalThis.location.assign(url));

  return defer(() =>
    from(
      fetchSession(sessionUrl, {
        method: "GET",
        credentials: "include",
      }),
    ),
  ).pipe(
    switchMap((response) => {
      if (!response.ok) return of(false);

      return from(response.json() as Promise<SessionPayload>).pipe(
        map((session) => Boolean(session.authenticated)),
      );
    }),
    map((authenticated): AuthSessionState => {
      if (authenticated) return { status: "ready", loginUrl };
      if (!loginUrl) return { status: "error", loginUrl: null };

      redirect(loginUrl);
      return { status: "redirecting", loginUrl };
    }),
    catchError(() => of<AuthSessionState>({ status: "error", loginUrl })),
    startWith<AuthSessionState>({ status: "loading", loginUrl }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
}

function normalizePathPrefix(pathPrefix: string): string {
  const normalized = pathPrefix.trim();
  if (!normalized || normalized === "/") return "";

  const withLeadingSlash = normalized.startsWith("/")
    ? normalized
    : `/${normalized}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;
}

function buildUrl(
  origin: string,
  path: string,
  returnTo?: string,
): string | null {
  try {
    const url = new URL(path || "/", origin);
    if (returnTo !== undefined) {
      url.searchParams.set("returnTo", returnTo);
    }
    return url.toString();
  } catch {
    return null;
  }
}
