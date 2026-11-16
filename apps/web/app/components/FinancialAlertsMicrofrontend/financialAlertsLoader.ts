import type { Locale } from "@repo/i18n";
import type { LifeCycles } from "single-spa";

export type FinancialAlertsProps = {
  name: string;
  domElement: HTMLElement;
  locale: Locale;
  authOrigin: string;
  authPathPrefix?: string;
  returnTo: string;
};

export type FinancialAlertsModule = LifeCycles<FinancialAlertsProps>;

export const FINANCIAL_ALERTS_BUNDLE_NAMES = [
  "runtime.js",
  "polyfills.js",
  "main.js",
] as const;

type FinancialAlertsLoaderDependencies = {
  preloadScript: (source: string) => void;
  loadScript: (source: string) => Promise<void>;
  getLifecycles: () => FinancialAlertsModule | undefined;
};

declare global {
  interface Window {
    financialAlertsAngular?: FinancialAlertsModule;
  }
}

function normalizeOrigin(origin: string): string {
  return origin.replace(/\/+$/, "");
}

export function getFinancialAlertsBundleSources(origin: string): string[] {
  const normalizedOrigin = normalizeOrigin(origin);
  return FINANCIAL_ALERTS_BUNDLE_NAMES.map(
    (bundleName) => `${normalizedOrigin}/${bundleName}`,
  );
}

export function createFinancialAlertsLoader(
  dependencies: FinancialAlertsLoaderDependencies,
) {
  const loadPromises = new Map<string, Promise<FinancialAlertsModule>>();
  const preloadedOrigins = new Set<string>();

  const preload = (origin: string) => {
    const normalizedOrigin = normalizeOrigin(origin);
    if (preloadedOrigins.has(normalizedOrigin)) return;

    preloadedOrigins.add(normalizedOrigin);
    for (const source of getFinancialAlertsBundleSources(normalizedOrigin)) {
      try {
        dependencies.preloadScript(source);
      } catch {
        // Preload is an optimization; ordered script loading remains the fallback.
      }
    }
  };

  const load = (origin: string): Promise<FinancialAlertsModule> => {
    const normalizedOrigin = normalizeOrigin(origin);
    const cached = loadPromises.get(normalizedOrigin);
    if (cached) return cached;

    const exposedLifecycles = dependencies.getLifecycles();
    if (exposedLifecycles) {
      const resolved = Promise.resolve(exposedLifecycles);
      loadPromises.set(normalizedOrigin, resolved);
      return resolved;
    }

    preload(normalizedOrigin);
    const promise = (async () => {
      for (const source of getFinancialAlertsBundleSources(normalizedOrigin)) {
        await dependencies.loadScript(source);
      }

      const lifecycles = dependencies.getLifecycles();
      if (!lifecycles) {
        throw new Error("Single SPA lifecycles were not exposed");
      }

      return lifecycles;
    })();

    loadPromises.set(normalizedOrigin, promise);
    void promise.catch(() => {
      if (loadPromises.get(normalizedOrigin) === promise) {
        loadPromises.delete(normalizedOrigin);
      }
    });

    return promise;
  };

  return { load, preload };
}

const scriptLoadPromises = new Map<string, Promise<void>>();

function findScript(source: string): HTMLScriptElement | undefined {
  return Array.from(
    document.querySelectorAll<HTMLScriptElement>(
      "script[data-financial-alerts-source]",
    ),
  ).find((script) => script.dataset.financialAlertsSource === source);
}

function preloadDomScript(source: string): void {
  const exists = Array.from(
    document.querySelectorAll<HTMLLinkElement>(
      'link[rel="preload"][data-financial-alerts-source]',
    ),
  ).some((link) => link.dataset.financialAlertsSource === source);
  if (exists) return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "script";
  link.href = source;
  link.crossOrigin = "anonymous";
  link.dataset.financialAlertsSource = source;
  document.head.appendChild(link);
}

function loadDomScript(source: string): Promise<void> {
  const cached = scriptLoadPromises.get(source);
  if (cached) return cached;

  const promise = new Promise<void>((resolve, reject) => {
    const existing = findScript(source);
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
      } else {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener(
          "error",
          () => reject(new Error(`Could not load ${source}`)),
          { once: true },
        );
      }
      return;
    }

    const script = document.createElement("script");
    script.src = source;
    script.async = false;
    script.crossOrigin = "anonymous";
    script.dataset.financialAlertsSource = source;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => {
      script.remove();
      reject(new Error(`Could not load ${source}`));
    };
    document.head.appendChild(script);
  });

  scriptLoadPromises.set(source, promise);
  void promise.catch(() => {
    if (scriptLoadPromises.get(source) === promise) {
      scriptLoadPromises.delete(source);
    }
  });

  return promise;
}

const browserLoader = createFinancialAlertsLoader({
  preloadScript: preloadDomScript,
  loadScript: loadDomScript,
  getLifecycles: () => window.financialAlertsAngular,
});

export const preloadFinancialAlertsBundles = browserLoader.preload;
export const loadFinancialAlertsModule = browserLoader.load;
