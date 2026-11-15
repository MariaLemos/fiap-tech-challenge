import type {
  Contribution,
  Investment,
  InvestmentGoal,
} from "@repo/contracts";

export type InvestmentsState = {
  goals: InvestmentGoal[];
  investments: Investment[];
  contributions: Contribution[];
  hydrated: boolean;
};

export type GoalInput = Pick<
  InvestmentGoal,
  "name" | "category" | "targetAmount" | "targetDate" | "description"
>;

export type InvestmentInput = Pick<
  Investment,
  "goalId" | "name" | "assetClass" | "initialAmount" | "returnRate"
>;

export type ContributionInput = Pick<
  Contribution,
  "investmentId" | "amount" | "date"
>;

export type PersistedInvestmentsState = Pick<
  InvestmentsState,
  "goals" | "investments" | "contributions"
>;
