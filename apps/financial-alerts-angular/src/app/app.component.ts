import { Component } from "@angular/core";
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
export class AppComponent {
  filter: Filter = "all";
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
}
