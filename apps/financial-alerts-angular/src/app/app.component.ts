import { ChangeDetectionStrategy, Component } from "@angular/core";
import {
  resolveLocale,
  translate,
  type Locale,
  type TranslationKey,
} from "@repo/i18n";
import { combineLatest, shareReplay, type Observable } from "rxjs";
import { createAuthSession, type AuthSessionState } from "./auth-session";
import {
  FinancialAlertsFacade,
  type FinancialAlertsFilter,
  type FinancialAlertsViewModel,
} from "./financial-alerts.facade";

type AppViewModel = {
  auth: AuthSessionState;
  alerts: FinancialAlertsViewModel;
};

@Component({
  selector: "financial-alerts-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly locale: Locale = resolveLocale(window.__APP_LOCALE__);
  readonly vm$: Observable<AppViewModel>;

  constructor(private readonly alertsFacade: FinancialAlertsFacade) {
    this.vm$ = combineLatest({
      auth: createAuthSession({
        authOrigin: window.__AUTH_ORIGIN__ ?? "http://localhost:3002",
        authPathPrefix: window.__AUTH_PATH_PREFIX__ ?? "",
        returnTo: window.__AUTH_RETURN_TO__ ?? window.location.href,
        fetchSession: window.fetch.bind(window),
        redirect: (url) => window.location.assign(url),
      }),
      alerts: this.alertsFacade.vm$,
    }).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  t(key: TranslationKey): string {
    return translate(this.locale, key);
  }

  setFilter(filter: FinancialAlertsFilter): void {
    this.alertsFacade.setFilter(filter);
  }

  markAsRead(alertId: number): void {
    this.alertsFacade.markAsRead(alertId);
  }
}
