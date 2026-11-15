import type {
  Contribution,
  Investment,
  InvestmentGoal,
} from "@repo/contracts";
import { describe, expect, it } from "vitest";
import {
  calculateAllocationByAssetClass,
  calculateContributionTotals,
  calculateDashboardMetrics,
  calculateGoalProgress,
  calculateGoalValues,
  calculateInvestmentValue,
  calculateInvestmentValueById,
  calculateInvestmentValues,
  calculatePortfolioTotal,
  findRecentContributionsForGoal,
} from "./investmentRules";

const goals: InvestmentGoal[] = [
  {
    id: "goal-main",
    name: "Meta principal",
    category: "Longo prazo",
    targetAmount: 200,
    targetDate: "2030-12-31",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

const investments: Investment[] = [
  {
    id: "investment-a",
    goalId: "goal-main",
    name: "Ativo A",
    assetClass: "Renda fixa",
    initialAmount: 100,
    returnRate: 10,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "investment-b",
    goalId: "goal-main",
    name: "Ativo B",
    assetClass: "Renda fixa",
    initialAmount: 50,
    returnRate: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "investment-c",
    goalId: null,
    name: "Ativo C",
    assetClass: "Criptoativos",
    initialAmount: 40,
    returnRate: -50,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

const contributions: Contribution[] = [
  {
    id: "contribution-a-old",
    investmentId: "investment-a",
    amount: 30,
    date: "2026-01-10",
  },
  {
    id: "contribution-b",
    investmentId: "investment-b",
    amount: 5,
    date: "2026-03-10",
  },
  {
    id: "contribution-a-new",
    investmentId: "investment-a",
    amount: 20,
    date: "2026-02-10",
  },
  {
    id: "contribution-c",
    investmentId: "investment-c",
    amount: 10,
    date: "2026-04-10",
  },
  {
    id: "orphan",
    investmentId: "missing-investment",
    amount: 999,
    date: "2026-05-10",
  },
];

describe("investment rules", () => {
  it("applies the current return formula after summing contributions", () => {
    const contributionTotals = calculateContributionTotals(contributions);
    const investmentValues = calculateInvestmentValues(
      investments,
      contributionTotals,
    );

    expect(contributionTotals).toMatchObject({
      "investment-a": 50,
      "investment-b": 5,
      "investment-c": 10,
      "missing-investment": 999,
    });
    expect(calculateInvestmentValue(investments[0]!, 50)).toBe(165);
    expect(investmentValues).toEqual({
      "investment-a": 165,
      "investment-b": 55,
      "investment-c": 25,
    });
  });

  it("aggregates values by goal, portfolio and asset class", () => {
    const contributionTotals = calculateContributionTotals(contributions);

    expect(calculateGoalValues(investments, contributionTotals)).toEqual({
      "goal-main": 220,
    });
    expect(calculatePortfolioTotal(investments, contributionTotals)).toBe(245);
    expect(
      calculateAllocationByAssetClass(investments, contributionTotals),
    ).toEqual({
      "Renda fixa": 220,
      Criptoativos: 25,
    });
  });

  it("preserves aggregate behavior when persisted investments repeat an id", () => {
    const duplicatedInvestments = [
      { ...investments[0]!, id: "duplicated", initialAmount: 100 },
      { ...investments[1]!, id: "duplicated", initialAmount: 50 },
    ];
    const contributionTotals = { duplicated: 10 };

    expect(
      calculateInvestmentValueById(
        duplicatedInvestments,
        contributionTotals,
        "duplicated",
      ),
    ).toBeCloseTo(121);
    expect(
      calculateGoalValues(duplicatedInvestments, contributionTotals)[
        "goal-main"
      ],
    ).toBeCloseTo(181);
    expect(
      calculatePortfolioTotal(duplicatedInvestments, contributionTotals),
    ).toBeCloseTo(181);
    expect(
      calculateAllocationByAssetClass(
        duplicatedInvestments,
        contributionTotals,
      )["Renda fixa"],
    ).toBeCloseTo(181);
  });

  it("keeps progress above 100 percent and handles invalid targets", () => {
    expect(calculateGoalProgress(goals[0], 220)).toBeCloseTo(110);
    expect(calculateGoalProgress(undefined, 220)).toBe(0);
    expect(
      calculateGoalProgress({ ...goals[0]!, targetAmount: 0 }, 220),
    ).toBe(0);
  });

  it("returns recent goal contributions without mutating the source", () => {
    const originalOrder = contributions.map((contribution) => contribution.id);

    const recent = findRecentContributionsForGoal(
      contributions,
      investments,
      "goal-main",
      2,
    );

    expect(recent.map((contribution) => contribution.id)).toEqual([
      "contribution-b",
      "contribution-a-new",
    ]);
    expect(contributions.map((contribution) => contribution.id)).toEqual(
      originalOrder,
    );
  });

  it("calculates dashboard totals and the existing on-track rule", () => {
    const dashboardGoals: InvestmentGoal[] = [
      { ...goals[0]!, id: "fulfilled", targetDate: "2025-12-31" },
      {
        ...goals[0]!,
        id: "overdue",
        targetAmount: 100,
        targetDate: "2025-12-31",
      },
      {
        ...goals[0]!,
        id: "future",
        targetAmount: 300,
        targetDate: "2030-12-31",
      },
    ];

    expect(
      calculateDashboardMetrics(
        dashboardGoals,
        { fulfilled: 220, overdue: 20, future: 60 },
        new Date("2026-06-01T00:00:00.000Z"),
      ),
    ).toEqual({
      totalPlanned: 600,
      goalCurrent: 300,
      onTrack: 2,
      overallProgress: 50,
    });
  });
});
