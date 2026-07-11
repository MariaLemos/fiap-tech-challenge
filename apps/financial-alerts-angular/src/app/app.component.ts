import { Component, OnInit } from "@angular/core";
import {
  resolveLocale,
  translate,
  type Locale,
  type TranslationKey,
} from "@repo/i18n";

type Filter = "all" | "unread" | "read";
interface FinancialAlert {
  id: number;
  severity: "success" | "info" | "warning";
  title: TranslationKey;
  description: TranslationKey;
  action?: TranslationKey;
  read: boolean;
}

@Component({
  selector: "financial-alerts-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  filter: Filter = "all";
  ready = false;
  authError = false;
  loginUrl: string | null = null;
  readonly locale: Locale = resolveLocale(window.__APP_LOCALE__);
  readonly alerts: FinancialAlert[] = [
    { id: 1, severity: "warning", title: "alerts.item.food.title", description: "alerts.item.food.description", action: "alerts.item.food.action", read: false },
    { id: 2, severity: "success", title: "alerts.item.balance.title", description: "alerts.item.balance.description", read: false },
    { id: 3, severity: "info", title: "alerts.item.categories.title", description: "alerts.item.categories.description", read: true },
    { id: 4, severity: "warning", title: "alerts.item.expenses.title", description: "alerts.item.expenses.description", read: false },
  ];

  t(key: TranslationKey) { return translate(this.locale, key); }
  get visibleAlerts() { return this.alerts.filter((alert) => this.filter === "all" || (this.filter === "read" ? alert.read : !alert.read)); }
  setFilter(filter: Filter) { this.filter = filter; }
  markAsRead(alert: FinancialAlert) { alert.read = true; }

  private createLoginUrl(authOrigin: string, authPathPrefix: string, returnTo: string) {
    try {
      const loginPath = `${authPathPrefix}/login`;
      const loginUrl = new URL(loginPath, authOrigin);
      loginUrl.searchParams.set("returnTo", returnTo);
      return loginUrl.toString();
    } catch {
      return null;
    }
  }

  private redirectToLogin(loginUrl: string | null) {
    if (!loginUrl) {
      this.authError = true;
      return;
    }
    window.location.assign(loginUrl);
  }

  async ngOnInit() {
    const authOrigin = window.__AUTH_ORIGIN__ ?? "http://localhost:3002";
    const authPathPrefix = window.__AUTH_PATH_PREFIX__ ?? "";
    const returnTo = window.__AUTH_RETURN_TO__ ?? window.location.href;
    this.loginUrl = this.createLoginUrl(authOrigin, authPathPrefix, returnTo);

    try {
      const response = await fetch(`${authOrigin}${authPathPrefix}/api/session`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        this.redirectToLogin(this.loginUrl);
        return;
      }

      const session = (await response.json()) as { authenticated?: boolean };
      if (!session.authenticated) {
        this.redirectToLogin(this.loginUrl);
        return;
      }

      this.ready = true;
    } catch {
      this.authError = true;
    }
  }
}
