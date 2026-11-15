import { createSelector } from "@reduxjs/toolkit";
import type { InvestmentsState } from "../domain/InvestmentPortfolio";
import {
  calculateAllocationByAssetClass,
  calculateContributionTotals,
  calculateGoalProgress,
  calculateGoalValues,
  calculateInvestmentValueById,
  calculateInvestmentValues,
  calculatePortfolioTotal,
  findRecentContributionsForGoal,
} from "../domain/investmentRules";

type InvestmentsRootState = { investments: InvestmentsState };

const selectDomain = (state: InvestmentsRootState) => state.investments;

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
  calculateContributionTotals,
);

export const selectInvestmentById = createSelector(
  [
    selectInvestments,
    (_state: InvestmentsRootState, investmentId: string) => investmentId,
  ],
  (investments, investmentId) =>
    investments.find((investment) => investment.id === investmentId),
);

export const selectGoalById = createSelector(
  [selectGoals, (_state: InvestmentsRootState, goalId: string) => goalId],
  (goals, goalId) => goals.find((goal) => goal.id === goalId),
);

export const selectInvestmentValuesMap = createSelector(
  [selectInvestments, selectContributionTotalsByInvestment],
  calculateInvestmentValues,
);

export const selectInvestmentValue = createSelector(
  [
    selectInvestments,
    selectContributionTotalsByInvestment,
    (_state: InvestmentsRootState, investmentId: string) => investmentId,
  ],
  calculateInvestmentValueById,
);

export const selectGoalValuesMap = createSelector(
  [selectInvestments, selectContributionTotalsByInvestment],
  calculateGoalValues,
);

export const selectGoalValue = createSelector(
  [
    selectGoalValuesMap,
    (_state: InvestmentsRootState, goalId: string) => goalId,
  ],
  (goalValues, goalId) => goalValues[goalId] ?? 0,
);

export const selectGoalProgress = createSelector(
  [selectGoalById, selectGoalValue],
  calculateGoalProgress,
);

export const selectPortfolioTotal = createSelector(
  [selectInvestments, selectContributionTotalsByInvestment],
  calculatePortfolioTotal,
);

export const selectAllocationByAssetClass = createSelector(
  [selectInvestments, selectContributionTotalsByInvestment],
  calculateAllocationByAssetClass,
);

export const selectUnassignedInvestments = createSelector(
  [selectInvestments],
  (investments) => investments.filter((investment) => !investment.goalId),
);

export const selectInvestmentsByGoalId = createSelector(
  [
    selectInvestments,
    (_state: InvestmentsRootState, goalId: string) => goalId,
  ],
  (investments, goalId) =>
    investments.filter((investment) => investment.goalId === goalId),
);

export const selectRecentContributionsForGoal = createSelector(
  [
    selectContributions,
    selectInvestments,
    (_state: InvestmentsRootState, goalId: string) => goalId,
    (
      _state: InvestmentsRootState,
      _goalId: string,
      limit = 5,
    ) => limit,
  ],
  findRecentContributionsForGoal,
);
