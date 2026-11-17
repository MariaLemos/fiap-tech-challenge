import { describe, expect, it } from "vitest";
import { FinancialAlertsFacade } from "./financial-alerts.facade";

describe("FinancialAlertsFacade", () => {
  it("emits the initial alerts and all filter", () => {
    const facade = new FinancialAlertsFacade();
    const emissions: Array<{ filter: string; visible: number[] }> = [];
    const subscription = facade.vm$.subscribe((viewModel) => {
      emissions.push({
        filter: viewModel.filter,
        visible: viewModel.visibleAlerts.map((alert) => alert.id),
      });
    });

    expect(emissions).toEqual([{ filter: "all", visible: [1, 2, 3, 4] }]);
    subscription.unsubscribe();
  });

  it("derives unread and read filters reactively", () => {
    const facade = new FinancialAlertsFacade();
    const emissions: Array<{ filter: string; visible: number[] }> = [];
    const subscription = facade.vm$.subscribe((viewModel) => {
      emissions.push({
        filter: viewModel.filter,
        visible: viewModel.visibleAlerts.map((alert) => alert.id),
      });
    });

    facade.setFilter("unread");
    facade.setFilter("read");

    expect(emissions).toEqual([
      { filter: "all", visible: [1, 2, 3, 4] },
      { filter: "unread", visible: [1, 2, 4] },
      { filter: "read", visible: [3] },
    ]);
    subscription.unsubscribe();
  });

  it("marks an alert through an immutable update", () => {
    const facade = new FinancialAlertsFacade();
    const emissions: Array<{
      alerts: readonly { id: number; read: boolean }[];
      visible: number[];
    }> = [];
    const subscription = facade.vm$.subscribe((viewModel) => {
      emissions.push({
        alerts: viewModel.alerts,
        visible: viewModel.visibleAlerts.map((alert) => alert.id),
      });
    });

    facade.setFilter("unread");
    const before = emissions.at(-1)?.alerts;
    const originalAlert = before?.find((alert) => alert.id === 1);
    facade.markAsRead(1);
    const after = emissions.at(-1)?.alerts;

    expect(after).not.toBe(before);
    expect(after?.find((alert) => alert.id === 1)).not.toBe(originalAlert);
    expect(originalAlert?.read).toBe(false);
    expect(after?.find((alert) => alert.id === 1)?.read).toBe(true);
    expect(emissions.at(-1)?.visible).toEqual([2, 4]);
    subscription.unsubscribe();
  });

  it("does not emit when filter or read state is unchanged", () => {
    const facade = new FinancialAlertsFacade();
    let emissionCount = 0;
    const subscription = facade.vm$.subscribe(() => {
      emissionCount += 1;
    });

    facade.setFilter("all");
    facade.markAsRead(3);

    expect(emissionCount).toBe(1);
    subscription.unsubscribe();
  });
});
