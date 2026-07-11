import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const selectDomain = (state: RootState) => state.investments;

export const selectGoals = createSelector(
  [selectDomain],
  (domain) => domain.goals,
);

export const selectInvestments = createSelector(
  [selectDomain],
  (domain) => domain.investments,
);

export const selectContributions = createSelector(
  [selectDomain],
  (domain) => domain.contributions,
);

export const selectHydrated = createSelector(
  [selectDomain],
  (domain) => domain.hydrated,
);

const selectContributionTotalsByInvestment = createSelector(
  [selectContributions],
  (contributions) => {
    const totals: Record<string, number> = {};
    for (const item of contributions) {
      totals[item.investmentId] = (totals[item.investmentId] ?? 0) + item.amount;
    }
    return totals;
  },
);

export const selectInvestmentById = createSelector(
  [selectInvestments, (_state: RootState, investmentId: string) => investmentId],
  (investments, investmentId) =>
    investments.find((investment) => investment.id === investmentId),
);

export const selectGoalById = createSelector(
  [selectGoals, (_state: RootState, goalId: string) => goalId],
  (goals, goalId) => goals.find((goal) => goal.id === goalId),
);

export const selectInvestmentValue = createSelector(
  [
    selectInvestments,
    selectContributionTotalsByInvestment,
    (_state: RootState, investmentId: string) => investmentId,
  ],
  (investments, contributionTotals, investmentId) => {
    const investment = investments.find((item) => item.id === investmentId);
    if (!investment) return 0;
    const contributionTotal = contributionTotals[investment.id] ?? 0;
    return (investment.initialAmount + contributionTotal) * (1 + investment.returnRate / 100);
  },
);

export const selectInvestmentValuesMap = createSelector(
  [selectInvestments, selectContributionTotalsByInvestment],
  (investments, contributionTotals) => {
    const values: Record<string, number> = {};
    for (const investment of investments) {
      const contributionTotal = contributionTotals[investment.id] ?? 0;
      values[investment.id] =
        (investment.initialAmount + contributionTotal) *
        (1 + investment.returnRate / 100);
    }
    return values;
  },
);

export const selectGoalValue = createSelector(
  [
    selectInvestments,
    selectContributionTotalsByInvestment,
    (_state: RootState, goalId: string) => goalId,
  ],
  (investments, contributionTotals, goalId) => {
    return investments.reduce((total, investment) => {
      if (investment.goalId !== goalId) return total;
      const contributionTotal = contributionTotals[investment.id] ?? 0;
      const currentValue =
        (investment.initialAmount + contributionTotal) *
        (1 + investment.returnRate / 100);
      return total + currentValue;
    }, 0);
  },
);

export const selectGoalValuesMap = createSelector(
  [selectInvestments, selectContributionTotalsByInvestment],
  (investments, contributionTotals) => {
    const totalsByGoal: Record<string, number> = {};
    for (const investment of investments) {
      if (!investment.goalId) continue;
      const contributionTotal = contributionTotals[investment.id] ?? 0;
      const currentValue =
        (investment.initialAmount + contributionTotal) *
        (1 + investment.returnRate / 100);
      totalsByGoal[investment.goalId] = (totalsByGoal[investment.goalId] ?? 0) + currentValue;
    }
    return totalsByGoal;
  },
);

export const selectGoalProgress = createSelector(
  [
    selectGoalById,
    (_state: RootState, goalId: string) => goalId,
    (state: RootState, goalId: string) => selectGoalValue(state, goalId),
  ],
  (goal, _goalId, currentValue) => {
    if (!goal || goal.targetAmount <= 0) return 0;
    return (currentValue / goal.targetAmount) * 100;
  },
);

export const selectPortfolioTotal = createSelector(
  [selectInvestments, selectContributionTotalsByInvestment],
  (investments, contributionTotals) => {
    return investments.reduce((total, investment) => {
      const contributionTotal = contributionTotals[investment.id] ?? 0;
      return (
        total +
        (investment.initialAmount + contributionTotal) *
          (1 + investment.returnRate / 100)
      );
    }, 0);
  },
);

export const selectAllocationByAssetClass = createSelector(
  [selectInvestments, selectContributionTotalsByInvestment],
  (investments, contributionTotals) => {
    const allocation: Record<string, number> = {};
    for (const investment of investments) {
      const contributionTotal = contributionTotals[investment.id] ?? 0;
      const currentValue =
        (investment.initialAmount + contributionTotal) *
        (1 + investment.returnRate / 100);
      allocation[investment.assetClass] =
        (allocation[investment.assetClass] ?? 0) + currentValue;
    }
    return allocation;
  },
);

export const selectUnassignedInvestments = createSelector(
  [selectInvestments],
  (investments) => investments.filter((investment) => !investment.goalId),
);

export const selectInvestmentsByGoalId = createSelector(
  [selectInvestments, (_state: RootState, goalId: string) => goalId],
  (investments, goalId) =>
    investments.filter((investment) => investment.goalId === goalId),
);

export const selectRecentContributionsForGoal = createSelector(
  [
    selectContributions,
    selectInvestmentsByGoalId,
    (_state: RootState, _goalId: string, limit = 5) => limit,
  ],
  (contributions, investmentsForGoal, limit) => {
    const assetIds = new Set(investmentsForGoal.map((item) => item.id));
    return contributions
      .filter((item) => assetIds.has(item.investmentId))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, limit);
  },
);
