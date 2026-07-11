import { NgZone } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { NavigationStart, Router } from "@angular/router";
import { singleSpaAngular, getSingleSpaExtraProviders } from "single-spa-angular";
import { AppModule } from "./app/app.module";
import { resolveLocale, type Locale } from "@repo/i18n";

type FinancialAlertsProps = { locale?: Locale };

const lifecycles = singleSpaAngular({
  bootstrapFunction: (singleSpaProps: FinancialAlertsProps) => {
    window.__APP_LOCALE__ = resolveLocale(singleSpaProps.locale);
    return platformBrowserDynamic(getSingleSpaExtraProviders()).bootstrapModule(AppModule);
  },
  template: "<financial-alerts-root />",
  Router,
  NavigationStart,
  NgZone,
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;

declare global {
  interface Window {
    __FINANCIAL_ALERTS_STANDALONE__?: boolean;
    financialAlertsAngular?: typeof lifecycles;
    __APP_LOCALE__?: Locale;
  }
}

window.financialAlertsAngular = lifecycles;

if (window.__FINANCIAL_ALERTS_STANDALONE__) {
  window.__APP_LOCALE__ = resolveLocale(document.documentElement.lang);
  platformBrowserDynamic().bootstrapModule(AppModule).catch(console.error);
}
