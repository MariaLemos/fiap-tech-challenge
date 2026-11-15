import type { Investment, InvestmentGoal } from "@repo/contracts";
import { describe, expect, it } from "vitest";
import {
  createGoalFormValues,
  createInvestmentFormValues,
  getEntityFormStatus,
  resolveDefaultGoalId,
  toGoalInput,
  toInvestmentInput,
} from "./investmentFormValues";

const goal: InvestmentGoal = {
  id: "goal-1",
  name: "Reserva",
  category: "Curto prazo",
  targetAmount: 10000,
  targetDate: "2027-12-31",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const investment: Investment = {
  id: "investment-1",
  goalId: "goal-1",
  name: "CDB",
  assetClass: "Renda fixa",
  initialAmount: 1000,
  returnRate: 10,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("investment form values", () => {
  it("blocks forms until hydration and distinguishes missing edit entities", () => {
    expect(getEntityFormStatus(false, "goal-1", goal)).toBe("loading");
    expect(getEntityFormStatus(true, "missing", undefined)).toBe("notFound");
    expect(getEntityFormStatus(true, "goal-1", goal)).toBe("ready");
    expect(getEntityFormStatus(true, undefined, undefined)).toBe("ready");
  });

  it("maps hydrated goals and converts their numeric input", () => {
    const values = createGoalFormValues(goal);

    expect(values).toEqual({
      name: "Reserva",
      category: "Curto prazo",
      targetAmount: 10000,
      targetDate: "2027-12-31",
      description: "",
    });
    expect(toGoalInput({ ...values, targetAmount: "12500" })).toEqual({
      ...values,
      targetAmount: 12500,
    });
  });

  it("uses a valid route goal only for creation and preserves unassigned edits", () => {
    expect(resolveDefaultGoalId([goal], "goal-1")).toBe("goal-1");
    expect(resolveDefaultGoalId([goal], "missing")).toBeUndefined();
    const defaultGoalId = resolveDefaultGoalId([goal], "goal-1");

    expect(createInvestmentFormValues(undefined, defaultGoalId).goalId).toBe(
      "goal-1",
    );
    expect(
      createInvestmentFormValues({ ...investment, goalId: null }, "goal-1")
        .goalId,
    ).toBe("");
  });

  it("maps hydrated investments and normalizes submitted numbers", () => {
    const values = createInvestmentFormValues(investment);

    expect(values).toEqual({
      goalId: "goal-1",
      name: "CDB",
      assetClass: "Renda fixa",
      initialAmount: 1000,
      returnRate: 10,
    });
    expect(
      toInvestmentInput({
        ...values,
        goalId: "",
        initialAmount: "1500",
        returnRate: "8.5",
      }),
    ).toEqual({
      goalId: null,
      name: "CDB",
      assetClass: "Renda fixa",
      initialAmount: 1500,
      returnRate: 8.5,
    });
  });
});
