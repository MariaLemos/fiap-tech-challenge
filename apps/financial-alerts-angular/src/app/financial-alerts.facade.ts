import { Injectable } from "@angular/core";
import type { TranslationKey } from "@repo/i18n";
import {
  BehaviorSubject,
  combineLatest,
  map,
  shareReplay,
  type Observable,
} from "rxjs";

export type FinancialAlertsFilter = "all" | "unread" | "read";

export interface FinancialAlert {
  id: number;
  severity: "success" | "info" | "warning";
  title: TranslationKey;
  description: TranslationKey;
  action?: TranslationKey;
  read: boolean;
}

export interface FinancialAlertsViewModel {
  filter: FinancialAlertsFilter;
  alerts: readonly FinancialAlert[];
  visibleAlerts: readonly FinancialAlert[];
}

const INITIAL_ALERTS: readonly FinancialAlert[] = [
  {
    id: 1,
    severity: "warning",
    title: "alerts.item.food.title",
    description: "alerts.item.food.description",
    action: "alerts.item.food.action",
    read: false,
  },
  {
    id: 2,
    severity: "success",
    title: "alerts.item.balance.title",
    description: "alerts.item.balance.description",
    read: false,
  },
  {
    id: 3,
    severity: "info",
    title: "alerts.item.categories.title",
    description: "alerts.item.categories.description",
    read: true,
  },
  {
    id: 4,
    severity: "warning",
    title: "alerts.item.expenses.title",
    description: "alerts.item.expenses.description",
    read: false,
  },
];

@Injectable({ providedIn: "root" })
export class FinancialAlertsFacade {
  private readonly filterSubject = new BehaviorSubject<FinancialAlertsFilter>(
    "all",
  );
  private readonly alertsSubject = new BehaviorSubject<
    readonly FinancialAlert[]
  >(INITIAL_ALERTS);

  readonly vm$: Observable<FinancialAlertsViewModel> = combineLatest([
    this.filterSubject,
    this.alertsSubject,
  ]).pipe(
    map(([filter, alerts]) => ({
      filter,
      alerts,
      visibleAlerts: alerts.filter(
        (alert) =>
          filter === "all" || (filter === "read" ? alert.read : !alert.read),
      ),
    })),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  setFilter(filter: FinancialAlertsFilter): void {
    if (filter !== this.filterSubject.value) {
      this.filterSubject.next(filter);
    }
  }

  markAsRead(alertId: number): void {
    const alerts = this.alertsSubject.value;
    const target = alerts.find((alert) => alert.id === alertId);
    if (!target || target.read) return;

    this.alertsSubject.next(
      alerts.map((alert) =>
        alert.id === alertId ? { ...alert, read: true } : alert,
      ),
    );
  }
}
