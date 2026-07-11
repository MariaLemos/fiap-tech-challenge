import { NgZone } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { NavigationStart, Router } from "@angular/router";
import { singleSpaAngular, getSingleSpaExtraProviders } from "single-spa-angular";
import { AppModule } from "./app/app.module";

const lifecycles = singleSpaAngular({
  bootstrapFunction: (singleSpaProps) =>
    platformBrowserDynamic(getSingleSpaExtraProviders()).bootstrapModule(AppModule),
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
  }
}

window.financialAlertsAngular = lifecycles;

if (window.__FINANCIAL_ALERTS_STANDALONE__) {
  platformBrowserDynamic().bootstrapModule(AppModule).catch(console.error);
}
