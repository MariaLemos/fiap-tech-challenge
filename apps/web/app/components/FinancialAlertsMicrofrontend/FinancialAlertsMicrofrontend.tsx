"use client";

import { useEffect, useRef, useState } from "react";
import { mountRootParcel, type LifeCycles, type Parcel } from "single-spa";
import styles from "./FinancialAlertsMicrofrontend.module.css";

type FinancialAlertsProps = {
  name: string;
  domElement: HTMLElement;
};

type FinancialAlertsModule = LifeCycles<FinancialAlertsProps>;

declare global {
  interface Window {
    financialAlertsAngular?: FinancialAlertsModule;
  }
}

const origin =
  process.env.NEXT_PUBLIC_FINANCIAL_ALERTS_ORIGIN ?? "http://localhost:4201";

function loadScript(source: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-financial-alerts-source="${source}"]`,
    );
    if (existing) {
      if (existing.dataset.loaded === "true") resolve();
      else existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = source;
    script.dataset.financialAlertsSource = source;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Could not load ${source}`));
    document.head.appendChild(script);
  });
}

export function FinancialAlertsMicrofrontend() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">(
    "loading",
  );

  useEffect(() => {
    const domElement = containerRef.current;
    if (!domElement) return;
    const mountElement: HTMLElement = domElement;

    let active = true;
    let parcel: Parcel | undefined;

    async function loadAngular(): Promise<FinancialAlertsModule> {
      await loadScript(`${origin}/runtime.js`);
      await loadScript(`${origin}/polyfills.js`);
      await loadScript(`${origin}/main.js`);
      const lifecycles = window.financialAlertsAngular;
      if (!lifecycles)
        throw new Error("Single SPA lifecycles were not exposed");
      return lifecycles;
    }

    async function mountAngularParcel() {
      try {
        parcel = mountRootParcel(loadAngular, {
          name: "financial-alerts-angular",
          domElement: mountElement,
        });
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
      if (parcel?.getStatus() === "MOUNTED") void parcel.unmount();
    };
  }, []);

  return (
    <section
      className={`financial-alerts-microfrontend ${styles.section}`}
      aria-labelledby="financial-alerts-heading"
    >
      <header className={styles.header}>
        <div>
          <h2 id="financial-alerts-heading">Centro de Alertas Financeiros</h2>
        </div>
        {status === "loading" && <span role="status">Carregando alertas…</span>}
      </header>
      {status === "unavailable" && (
        <p className={styles.fallback} role="status">
          Os alertas estão temporariamente indisponíveis. O restante do
          dashboard continua funcionando.
        </p>
      )}
      <div
        ref={containerRef}
        className={status === "ready" ? "" : styles.hidden}
      />
    </section>
  );
}
