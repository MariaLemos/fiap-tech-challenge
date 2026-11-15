import { describe, expect, it } from "vitest";
import type { RootState } from "../store";
import {
  selectGoalProgress,
  selectInvestmentValue,
  selectRecentContributionsForGoal,
} from "./investmentsSelectors";

const state = {
  investments: {
    goals: [
      {
        id: "goal-1",
        name: "Reserva",
        category: "Curto prazo",
        targetAmount: 200,
        targetDate: "2027-12-31",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ],
    investments: [
      {
        id: "investment-1",
        goalId: "goal-1",
        name: "CDB",
        assetClass: "Renda fixa",
        initialAmount: 100,
        returnRate: 10,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ],
    contributions: [
      {
        id: "older",
        investmentId: "investment-1",
        amount: 20,
        date: "2026-01-10",
      },
      {
        id: "newer",
        investmentId: "investment-1",
        amount: 30,
        date: "2026-02-10",
      },
    ],
    hydrated: true,
  },
} as RootState;

describe("legacy investments selectors facade", () => {
  it("preserves parameterized selector signatures", () => {
    expect(selectInvestmentValue(state, "investment-1")).toBe(165);
    expect(selectGoalProgress(state, "goal-1")).toBeCloseTo(82.5);
    expect(
      selectRecentContributionsForGoal(state, "goal-1", 1).map(
        (contribution) => contribution.id,
      ),
    ).toEqual(["newer"]);
  });
});
