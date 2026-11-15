import type { Contribution, Investment, InvestmentGoal } from "@repo/contracts";
import type { PersistedInvestmentsState } from "../domain/InvestmentPortfolio";

export type ParsedPersistedInvestmentsState = {
  state: PersistedInvestmentsState;
  normalized: boolean;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isBusinessDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.valueOf()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function isTimestamp(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T/.test(value) &&
    isBusinessDate(value.slice(0, 10)) &&
    !Number.isNaN(Date.parse(value))
  );
}

function parseGoal(value: unknown): InvestmentGoal | null {
  if (
    !isObject(value) ||
    !isNonEmptyString(value.id) ||
    !isNonEmptyString(value.name) ||
    !isNonEmptyString(value.category) ||
    !isFiniteNumber(value.targetAmount) ||
    value.targetAmount <= 0 ||
    !isBusinessDate(value.targetDate) ||
    (value.description !== undefined &&
      typeof value.description !== "string") ||
    !isTimestamp(value.createdAt) ||
    !isTimestamp(value.updatedAt)
  ) {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
    category: value.category,
    targetAmount: value.targetAmount,
    targetDate: value.targetDate,
    ...(value.description === undefined
      ? {}
      : { description: value.description }),
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}

function parseInvestment(value: unknown): Investment | null {
  if (
    !isObject(value) ||
    !isNonEmptyString(value.id) ||
    (value.goalId !== null && !isNonEmptyString(value.goalId)) ||
    !isNonEmptyString(value.name) ||
    !isNonEmptyString(value.assetClass) ||
    !isFiniteNumber(value.initialAmount) ||
    value.initialAmount < 0 ||
    !isFiniteNumber(value.returnRate) ||
    !isTimestamp(value.createdAt) ||
    !isTimestamp(value.updatedAt)
  ) {
    return null;
  }

  return {
    id: value.id,
    goalId: value.goalId,
    name: value.name,
    assetClass: value.assetClass,
    initialAmount: value.initialAmount,
    returnRate: value.returnRate,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}

function parseContribution(value: unknown): Contribution | null {
  if (
    !isObject(value) ||
    !isNonEmptyString(value.id) ||
    !isNonEmptyString(value.investmentId) ||
    !isFiniteNumber(value.amount) ||
    value.amount <= 0 ||
    !isBusinessDate(value.date)
  ) {
    return null;
  }

  return {
    id: value.id,
    investmentId: value.investmentId,
    amount: value.amount,
    date: value.date,
  };
}

function keepFirstById<T extends { id: string }>(items: T[]): T[] {
  const ids = new Set<string>();

  return items.filter((item) => {
    if (ids.has(item.id)) return false;
    ids.add(item.id);
    return true;
  });
}

function wasNormalized(
  source: unknown,
  state: PersistedInvestmentsState,
): boolean {
  try {
    return JSON.stringify(source) !== JSON.stringify(state);
  } catch {
    return true;
  }
}

export function parsePersistedInvestmentsState(
  value: unknown,
): ParsedPersistedInvestmentsState | null {
  if (
    !isObject(value) ||
    !Array.isArray(value.goals) ||
    !Array.isArray(value.investments) ||
    !Array.isArray(value.contributions)
  ) {
    return null;
  }

  const parsedGoals = value.goals.map(parseGoal);
  const parsedInvestments = value.investments.map(parseInvestment);
  const parsedContributions = value.contributions.map(parseContribution);

  if (
    parsedGoals.some((goal) => goal === null) ||
    parsedInvestments.some((investment) => investment === null) ||
    parsedContributions.some((contribution) => contribution === null)
  ) {
    return null;
  }

  const goals = keepFirstById(parsedGoals as InvestmentGoal[]);
  const goalIds = new Set(goals.map((goal) => goal.id));
  const investments = keepFirstById(parsedInvestments as Investment[]).map(
    (investment) =>
      investment.goalId && !goalIds.has(investment.goalId)
        ? { ...investment, goalId: null }
        : investment,
  );
  const investmentIds = new Set(investments.map((investment) => investment.id));
  const contributions = keepFirstById(
    parsedContributions as Contribution[],
  ).filter((contribution) => investmentIds.has(contribution.investmentId));
  const state = { goals, investments, contributions };

  return {
    state,
    normalized: wasNormalized(value, state),
  };
}
