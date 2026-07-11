function withTrailingSlash(value: string) {
  return value.endsWith("/") ? value : `${value}/`;
}

export function getDefaultReturnTo() {
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN?.trim();
  if (configuredOrigin) return withTrailingSlash(configuredOrigin);

  if (typeof window !== "undefined") {
    const referrer = document.referrer;
    if (referrer) {
      try {
        const referrerUrl = new URL(referrer);
        if (referrerUrl.origin !== window.location.origin) {
          return withTrailingSlash(referrerUrl.origin);
        }
      } catch {
        // Ignore invalid referrer and fall back to current origin.
      }
    }
    return withTrailingSlash(window.location.origin);
  }

  return "http://localhost:3000/";
}

export function normalizeReturnTo(value: string | null) {
  if (!value) return getDefaultReturnTo();

  try {
    const parsed = new URL(value);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return getDefaultReturnTo();
    }
    return parsed.toString();
  } catch {
    return getDefaultReturnTo();
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
      return defaultReturnTo;
    }

    if (!responseUrl) return parsedReturnTo.toString();

    const parsedResponseUrl = new URL(responseUrl, window.location.origin);
    const currentOrigin = window.location.origin;
    const isAuthSelfRedirect =
      parsedResponseUrl.origin === currentOrigin &&
      ["/", "/login"].includes(parsedResponseUrl.pathname);

    return isAuthSelfRedirect
      ? parsedReturnTo.toString()
      : parsedResponseUrl.toString();
  } catch {
    return defaultReturnTo;
  }
}
