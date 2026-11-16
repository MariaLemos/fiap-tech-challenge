import { describe, expect, it, vi } from "vitest";
import type { FinancialAlertsModule } from "./financialAlertsLoader";
import {
  createFinancialAlertsLoader,
  getFinancialAlertsBundleSources,
} from "./financialAlertsLoader";

const lifecycles = {} as FinancialAlertsModule;

describe("financial alerts loader", () => {
  it("builds a stable manifest for origins with or without a trailing slash", () => {
    const expected = [
      "https://alerts.example/runtime.js",
      "https://alerts.example/polyfills.js",
      "https://alerts.example/main.js",
    ];

    expect(getFinancialAlertsBundleSources("https://alerts.example")).toEqual(
      expected,
    );
    expect(
      getFinancialAlertsBundleSources("https://alerts.example///"),
    ).toEqual(expected);
  });

  it("preloads every bundle once before executing scripts in dependency order", async () => {
    const events: string[] = [];
    let exposed = false;
    const loader = createFinancialAlertsLoader({
      preloadScript: (source) => events.push(`preload:${source}`),
      loadScript: async (source) => {
        events.push(`load:${source}`);
        if (source.endsWith("/main.js")) exposed = true;
      },
      getLifecycles: () => (exposed ? lifecycles : undefined),
    });

    loader.preload("https://alerts.example/");
    loader.preload("https://alerts.example");
    await expect(loader.load("https://alerts.example")).resolves.toBe(
      lifecycles,
    );

    expect(events).toEqual([
      "preload:https://alerts.example/runtime.js",
      "preload:https://alerts.example/polyfills.js",
      "preload:https://alerts.example/main.js",
      "load:https://alerts.example/runtime.js",
      "load:https://alerts.example/polyfills.js",
      "load:https://alerts.example/main.js",
    ]);
  });

  it("shares one promise across concurrent loads and later remounts", async () => {
    let exposed = false;
    const loadScript = vi.fn(async (source: string) => {
      if (source.endsWith("/main.js")) exposed = true;
    });
    const loader = createFinancialAlertsLoader({
      preloadScript: vi.fn(),
      loadScript,
      getLifecycles: () => (exposed ? lifecycles : undefined),
    });

    const first = loader.load("https://alerts.example");
    const concurrent = loader.load("https://alerts.example/");

    expect(concurrent).toBe(first);
    await expect(first).resolves.toBe(lifecycles);
    expect(loader.load("https://alerts.example")).toBe(first);
    expect(loadScript).toHaveBeenCalledTimes(3);
  });

  it("evicts a rejected promise so a later load can retry", async () => {
    let exposed = false;
    let runtimeAttempts = 0;
    const loadScript = vi.fn(async (source: string) => {
      if (source.endsWith("/runtime.js") && runtimeAttempts++ === 0) {
        throw new Error("network error");
      }
      if (source.endsWith("/main.js")) exposed = true;
    });
    const loader = createFinancialAlertsLoader({
      preloadScript: vi.fn(),
      loadScript,
      getLifecycles: () => (exposed ? lifecycles : undefined),
    });

    await expect(loader.load("https://alerts.example")).rejects.toThrow(
      "network error",
    );
    await expect(loader.load("https://alerts.example")).resolves.toBe(
      lifecycles,
    );
    expect(loadScript).toHaveBeenCalledTimes(4);
  });

  it("fails explicitly when the scripts do not expose Single SPA lifecycles", async () => {
    const loader = createFinancialAlertsLoader({
      preloadScript: vi.fn(),
      loadScript: vi.fn(async () => undefined),
      getLifecycles: () => undefined,
    });

    await expect(loader.load("https://alerts.example")).rejects.toThrow(
      "Single SPA lifecycles were not exposed",
    );
  });
});
