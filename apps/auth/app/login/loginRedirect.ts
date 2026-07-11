function withTrailingSlash(value: string) {
  return value.endsWith("/") ? value : `${value}/`;
}

function debugLog(event: string, details?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  console.info("[auth-login-debug]", event, details ?? {});
}

function parseOrigin(value?: string) {
  if (!value) return { ok: false, normalized: null as string | null };
  try {
    const parsed = new URL(value);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { ok: false, normalized: null as string | null };
    }
    return { ok: true, normalized: parsed.origin };
  } catch {
    return { ok: false, normalized: null as string | null };
  }
}

export function logRuntimeEnvHealth() {
  if (typeof window === "undefined") return;

  const appOriginRaw = process.env.NEXT_PUBLIC_APP_ORIGIN;
  const authOriginRaw = process.env.NEXT_PUBLIC_AUTH_ORIGIN;
  const appOrigin = parseOrigin(appOriginRaw);
  const authOrigin = parseOrigin(authOriginRaw);

  debugLog("env.health", {
    currentOrigin: window.location.origin,
    currentPathname: window.location.pathname,
    nextPublicAppOriginRaw: appOriginRaw ?? null,
    nextPublicAppOriginValid: appOrigin.ok,
    nextPublicAppOriginNormalized: appOrigin.normalized,
    nextPublicAuthOriginRaw: authOriginRaw ?? null,
    nextPublicAuthOriginValid: authOrigin.ok,
    nextPublicAuthOriginNormalized: authOrigin.normalized,
    hasReturnToParam: new URLSearchParams(window.location.search).has("returnTo"),
    referrer: document.referrer || null,
  });

  if (!appOrigin.ok) {
    debugLog("env.warning.missingOrInvalidNEXT_PUBLIC_APP_ORIGIN", {
      suggestion: "Configure NEXT_PUBLIC_APP_ORIGIN in auth project on Vercel.",
    });
  }

  if (!authOrigin.ok) {
    debugLog("env.warning.missingOrInvalidNEXT_PUBLIC_AUTH_ORIGIN", {
      suggestion: "Configure NEXT_PUBLIC_AUTH_ORIGIN in auth project on Vercel.",
    });
  }
}

function deriveWebOriginFromAuthOrigin(origin: string) {
  try {
    const parsed = new URL(origin);
    if (parsed.hostname.includes("-auth.")) {
      parsed.hostname = parsed.hostname.replace("-auth.", "-web.");
      debugLog("deriveWebOriginFromAuthOrigin.success", {
        authOrigin: origin,
        webOrigin: parsed.origin,
      });
      return parsed.origin;
    }
    debugLog("deriveWebOriginFromAuthOrigin.noMatch", { authOrigin: origin });
    return null;
  } catch {
    debugLog("deriveWebOriginFromAuthOrigin.invalidOrigin", { authOrigin: origin });
    return null;
  }
}

export function getDefaultReturnTo() {
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN?.trim();
  if (configuredOrigin) {
    const resolved = withTrailingSlash(configuredOrigin);
    debugLog("getDefaultReturnTo.fromEnv", {
      configuredOrigin,
      resolved,
    });
    return resolved;
  }

  if (typeof window !== "undefined") {
    const derivedWebOrigin = deriveWebOriginFromAuthOrigin(window.location.origin);
    if (derivedWebOrigin) {
      const resolved = withTrailingSlash(derivedWebOrigin);
      debugLog("getDefaultReturnTo.fromDerivedWebOrigin", {
        currentOrigin: window.location.origin,
        resolved,
      });
      return resolved;
    }

    const referrer = document.referrer;
    if (referrer) {
      try {
        const referrerUrl = new URL(referrer);
        if (referrerUrl.origin !== window.location.origin) {
          const resolved = withTrailingSlash(referrerUrl.origin);
          debugLog("getDefaultReturnTo.fromReferrer", {
            referrer,
            currentOrigin: window.location.origin,
            resolved,
          });
          return resolved;
        }
      } catch {
        // Ignore invalid referrer and fall back to current origin.
        debugLog("getDefaultReturnTo.invalidReferrer", { referrer });
      }
    }
    const resolved = withTrailingSlash(window.location.origin);
    debugLog("getDefaultReturnTo.fromCurrentOrigin", {
      currentOrigin: window.location.origin,
      resolved,
    });
    return resolved;
  }

  debugLog("getDefaultReturnTo.serverFallback", {
    fallback: "http://localhost:3000/",
  });
  return "http://localhost:3000/";
}

export function normalizeReturnTo(value: string | null) {
  if (!value) {
    const fallback = getDefaultReturnTo();
    debugLog("normalizeReturnTo.empty", { fallback });
    return fallback;
  }

  try {
    const parsed = new URL(value);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      const fallback = getDefaultReturnTo();
      debugLog("normalizeReturnTo.invalidProtocol", {
        input: value,
        protocol: parsed.protocol,
        fallback,
      });
      return fallback;
    }
    const normalized = parsed.toString();
    debugLog("normalizeReturnTo.ok", {
      input: value,
      normalized,
    });
    return normalized;
  } catch {
    const fallback = getDefaultReturnTo();
    debugLog("normalizeReturnTo.invalidUrl", {
      input: value,
      fallback,
    });
    return fallback;
  }
}

export function resolveRedirectDestination(
  returnTo: string,
  responseUrl?: string | null,
) {
  const defaultReturnTo = getDefaultReturnTo();
  try {
    const parsedReturnTo = new URL(returnTo);
    if (!["http:", "https:"].includes(parsedReturnTo.protocol)) {
      debugLog("resolveRedirectDestination.invalidReturnToProtocol", {
        returnTo,
        protocol: parsedReturnTo.protocol,
        fallback: defaultReturnTo,
      });
      return defaultReturnTo;
    }

    if (!responseUrl) {
      const isSelfLoginDestination =
        parsedReturnTo.origin === window.location.origin &&
        ["/", "/login"].includes(parsedReturnTo.pathname);
      const resolved = isSelfLoginDestination
        ? defaultReturnTo
        : parsedReturnTo.toString();
      debugLog("resolveRedirectDestination.noResponseUrl", {
        returnTo,
        isSelfLoginDestination,
        resolved,
      });
      return resolved;
    }

    const parsedResponseUrl = new URL(responseUrl, window.location.origin);
    const currentOrigin = window.location.origin;
    const isAuthSelfRedirect =
      parsedResponseUrl.origin === currentOrigin &&
      ["/", "/login"].includes(parsedResponseUrl.pathname);

    const resolved = isAuthSelfRedirect
      ? parsedReturnTo.toString()
      : parsedResponseUrl.toString();
    debugLog("resolveRedirectDestination.withResponseUrl", {
      returnTo,
      responseUrl,
      parsedResponseUrl: parsedResponseUrl.toString(),
      isAuthSelfRedirect,
      resolved,
    });
    return resolved;
  } catch {
    debugLog("resolveRedirectDestination.exception", {
      returnTo,
      responseUrl,
      fallback: defaultReturnTo,
    });
    return defaultReturnTo;
  }
}
