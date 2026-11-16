"use client";

import type { Locale } from "@repo/i18n";
import { useI18n } from "@repo/i18n/react";
import { mountRootParcel, type Parcel } from "single-spa";
import { useEffect, useRef, useState } from "react";
import {
  loadFinancialAlertsModule,
  type FinancialAlertsProps,
} from "./financialAlertsLoader";
import styles from "./FinancialAlertsMicrofrontend.module.css";

const origin =
  process.env.NEXT_PUBLIC_FINANCIAL_ALERTS_ORIGIN ?? "http://localhost:4201";
const authPathPrefix = process.env.NEXT_PUBLIC_AUTH_PATH_PREFIX ?? "";

function resolveAuthOrigin() {
  if (authPathPrefix && typeof window !== "undefined") {
    return window.location.origin;
  }
  if (process.env.NEXT_PUBLIC_AUTH_ORIGIN) {
    return process.env.NEXT_PUBLIC_AUTH_ORIGIN;
  }
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:3002";
}

async function unmountParcelAfterMount(parcel: Parcel): Promise<void> {
  try {
    await parcel.mountPromise;
    if (parcel.getStatus() === "MOUNTED") {
      await parcel.unmount();
    }
  } catch {
    // A failed mount has no active parcel to tear down.
  }
}

export function FinancialAlertsMicrofrontend() {
  const { locale, t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const teardownRef = useRef<Promise<void>>(Promise.resolve());
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">(
    "loading",
  );

  useEffect(() => {
    const domElement = containerRef.current;
    if (!domElement) return;
    const mountElement: HTMLElement = domElement;
    const previousTeardown = teardownRef.current;

    let active = true;
    let parcel: Parcel | undefined;
    setStatus("loading");

    async function mountAngularParcel() {
      try {
        const [lifecycles] = await Promise.all([
          loadFinancialAlertsModule(origin),
          previousTeardown,
        ]);
        if (!active) return;

        const props: FinancialAlertsProps = {
          name: "financial-alerts-angular",
          domElement: mountElement,
          locale: locale as Locale,
          authOrigin: resolveAuthOrigin(),
          authPathPrefix,
          returnTo: window.location.href,
        };
        parcel = mountRootParcel(lifecycles, props);
        await parcel.mountPromise;
        if (active) setStatus("ready");
      } catch (error) {
        console.error("Financial alerts microfrontend is unavailable", error);
        if (active) setStatus("unavailable");
      }
    }

    void mountAngularParcel();
    return () => {
      active = false;
      teardownRef.current = parcel
        ? unmountParcelAfterMount(parcel)
        : previousTeardown;
    };
  }, [locale]);

  return (
    <section
      className={`financial-alerts-microfrontend ${styles.section}`}
      aria-labelledby="financial-alerts-heading"
    >
      <header className={styles.header}>
        <div>
          <h2 id="financial-alerts-heading">{t("alerts.heading")}</h2>
        </div>
        {status === "loading" && (
          <span role="status">{t("alerts.loading")}</span>
        )}
      </header>
      {status === "unavailable" && (
        <p className={styles.fallback} role="status">
          {t("alerts.unavailable")}
        </p>
      )}
      <div
        ref={containerRef}
        className={status === "ready" ? "" : styles.hidden}
      />
    </section>
  );
}
