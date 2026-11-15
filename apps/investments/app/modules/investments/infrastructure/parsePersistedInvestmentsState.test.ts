import type { PersistedInvestmentsState } from "../domain/InvestmentPortfolio";
import { describe, expect, it } from "vitest";
import { parsePersistedInvestmentsState } from "./parsePersistedInvestmentsState";

const createState = (): PersistedInvestmentsState => ({
  goals: [
    {
      id: "goal-1",
      name: "Reserva",
      category: "Curto prazo",
      targetAmount: 10000,
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
      initialAmount: 1000,
      returnRate: 10,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ],
  contributions: [
    {
      id: "contribution-1",
      investmentId: "investment-1",
      amount: 100,
      date: "2026-02-01",
    },
  ],
});

describe("parsePersistedInvestmentsState", () => {
  it("accepts a complete valid state with an optional description", () => {
    const state = createState();

    expect(parsePersistedInvestmentsState(state)).toEqual({
      state,
      normalized: false,
    });
  });

  it.each([
    ["goal", { ...createState(), goals: [null] }],
    ["investment", { ...createState(), investments: [{}] }],
    ["contribution", { ...createState(), contributions: ["invalid"] }],
    [
      "non-finite amount",
      {
        ...createState(),
        goals: [{ ...createState().goals[0]!, targetAmount: Number.NaN }],
      },
    ],
    [
      "invalid date",
      {
        ...createState(),
        contributions: [
          { ...createState().contributions[0]!, date: "2026-02-30" },
        ],
      },
    ],
    [
      "invalid timestamp date",
      {
        ...createState(),
        goals: [
          {
            ...createState().goals[0]!,
            createdAt: "2026-02-30T00:00:00.000Z",
          },
        ],
      },
    ],
    [
      "non-positive target",
      {
        ...createState(),
        goals: [{ ...createState().goals[0]!, targetAmount: 0 }],
      },
    ],
    [
      "negative initial investment",
      {
        ...createState(),
        investments: [{ ...createState().investments[0]!, initialAmount: -1 }],
      },
    ],
    [
      "non-finite return rate",
      {
        ...createState(),
        investments: [
          { ...createState().investments[0]!, returnRate: Infinity },
        ],
      },
    ],
    [
      "non-positive contribution",
      {
        ...createState(),
        contributions: [{ ...createState().contributions[0]!, amount: 0 }],
      },
    ],
    [
      "empty relationship id",
      {
        ...createState(),
        investments: [{ ...createState().investments[0]!, goalId: "" }],
      },
    ],
    ["incomplete envelope", { goals: [] }],
  ])("rejects an invalid %s", (_label, state) => {
    expect(parsePersistedInvestmentsState(state)).toBeNull();
  });

  it("keeps first ids and repairs orphaned relationships", () => {
    const state = createState();
    const duplicateGoal = { ...state.goals[0]!, name: "Duplicada" };
    const orphanedInvestment = {
      ...state.investments[0]!,
      goalId: "missing-goal",
    };
    const duplicateInvestment = {
      ...state.investments[0]!,
      name: "Duplicado",
    };
    const duplicateContribution = {
      ...state.contributions[0]!,
      amount: 999,
    };
    const orphanedContribution = {
      ...state.contributions[0]!,
      id: "orphaned-contribution",
      investmentId: "missing-investment",
    };

    const result = parsePersistedInvestmentsState({
      goals: [...state.goals, duplicateGoal],
      investments: [orphanedInvestment, duplicateInvestment],
      contributions: [
        ...state.contributions,
        duplicateContribution,
        orphanedContribution,
      ],
      futureProperty: true,
    });

    expect(result).toEqual({
      state: {
        goals: state.goals,
        investments: [{ ...orphanedInvestment, goalId: null }],
        contributions: state.contributions,
      },
      normalized: true,
    });
  });
});
