import type {
  Contribution,
  Investment,
  InvestmentGoal,
} from "@repo/contracts";

export type InvestmentValuesMap = Record<string, number>;

export function calculateContributionTotals(
  contributions: Contribution[],
): InvestmentValuesMap {
  const totals: InvestmentValuesMap = {};

  for (const contribution of contributions) {
    totals[contribution.investmentId] =
      (totals[contribution.investmentId] ?? 0) + contribution.amount;
  }

  return totals;
}

export function calculateInvestmentValue(
  investment: Investment,
  contributionTotal = 0,
): number {
  return (
    (investment.initialAmount + contributionTotal) *
    (1 + investment.returnRate / 100)
  );
}

export function calculateInvestmentValues(
  investments: Investment[],
  contributionTotals: InvestmentValuesMap,
): InvestmentValuesMap {
  const values: InvestmentValuesMap = {};

  for (const investment of investments) {
    values[investment.id] = calculateInvestmentValue(
      investment,
      contributionTotals[investment.id] ?? 0,
    );
  }

  return values;
}

export function calculateInvestmentValueById(
  investments: Investment[],
  contributionTotals: InvestmentValuesMap,
  investmentId: string,
): number {
  const investment = investments.find((item) => item.id === investmentId);
  if (!investment) return 0;

  return calculateInvestmentValue(
    investment,
    contributionTotals[investment.id] ?? 0,
  );
}

export function calculateGoalValues(
  investments: Investment[],
  contributionTotals: InvestmentValuesMap,
): InvestmentValuesMap {
  const values: InvestmentValuesMap = {};

  for (const investment of investments) {
    if (!investment.goalId) continue;
    values[investment.goalId] =
      (values[investment.goalId] ?? 0) +
      calculateInvestmentValue(
        investment,
        contributionTotals[investment.id] ?? 0,
      );
  }

  return values;
}

export function calculateGoalProgress(
  goal: InvestmentGoal | undefined,
  currentValue: number,
): number {
  if (!goal || goal.targetAmount <= 0) return 0;
  return (currentValue / goal.targetAmount) * 100;
}

export function calculatePortfolioTotal(
  investments: Investment[],
  contributionTotals: InvestmentValuesMap,
): number {
  return investments.reduce(
    (total, investment) =>
      total +
      calculateInvestmentValue(
        investment,
        contributionTotals[investment.id] ?? 0,
      ),
    0,
  );
}

export function calculateAllocationByAssetClass(
  investments: Investment[],
  contributionTotals: InvestmentValuesMap,
): InvestmentValuesMap {
  const allocation: InvestmentValuesMap = {};

  for (const investment of investments) {
    allocation[investment.assetClass] =
      (allocation[investment.assetClass] ?? 0) +
      calculateInvestmentValue(
        investment,
        contributionTotals[investment.id] ?? 0,
      );
  }

  return allocation;
}

export function findRecentContributionsForGoal(
  contributions: Contribution[],
  investments: Investment[],
  goalId: string,
  limit = 5,
): Contribution[] {
  const investmentIds = new Set(
    investments
      .filter((investment) => investment.goalId === goalId)
      .map((investment) => investment.id),
  );

  return contributions
    .filter((contribution) => investmentIds.has(contribution.investmentId))
    .sort((first, second) => second.date.localeCompare(first.date))
    .slice(0, limit);
}

export type InvestmentsDashboardMetrics = {
  totalPlanned: number;
  goalCurrent: number;
  onTrack: number;
  overallProgress: number;
};

export function calculateDashboardMetrics(
  goals: InvestmentGoal[],
  goalValues: InvestmentValuesMap,
  currentDate: Date,
): InvestmentsDashboardMetrics {
  const totalPlanned = goals.reduce(
    (total, goal) => total + goal.targetAmount,
    0,
  );
  const goalCurrent = goals.reduce(
    (total, goal) => total + (goalValues[goal.id] ?? 0),
    0,
  );
  const onTrack = goals.filter(
    (goal) =>
      new Date(goal.targetDate) >= currentDate ||
      (goalValues[goal.id] ?? 0) >= goal.targetAmount,
  ).length;

  return {
    totalPlanned,
    goalCurrent,
    onTrack,
    overallProgress: totalPlanned ? (goalCurrent / totalPlanned) * 100 : 0,
  };
}
