import type { Investment, InvestmentGoal } from "@repo/contracts";
import type { GoalInput, InvestmentInput } from "../domain/InvestmentPortfolio";

export type GoalFormValues = {
  name: string;
  category: string;
  targetAmount: string | number;
  targetDate: string;
  description: string;
};

export type InvestmentFormValues = {
  goalId: string;
  name: string;
  assetClass: string;
  initialAmount: string | number;
  returnRate: string | number;
};

export type EntityFormStatus = "loading" | "notFound" | "ready";

export function getEntityFormStatus(
  hydrated: boolean,
  entityId: string | undefined,
  entity: unknown,
): EntityFormStatus {
  if (!hydrated) return "loading";
  if (entityId && !entity) return "notFound";
  return "ready";
}

export function createGoalFormValues(goal?: InvestmentGoal): GoalFormValues {
  return {
    name: goal?.name ?? "",
    category: goal?.category ?? "",
    targetAmount: goal?.targetAmount ?? "",
    targetDate: goal?.targetDate ?? "",
    description: goal?.description ?? "",
  };
}

export function toGoalInput(values: GoalFormValues): GoalInput {
  return {
    ...values,
    targetAmount: Number(values.targetAmount),
  };
}

export function createInvestmentFormValues(
  investment?: Investment,
  defaultGoalId?: string,
): InvestmentFormValues {
  return {
    goalId: investment ? (investment.goalId ?? "") : (defaultGoalId ?? ""),
    name: investment?.name ?? "",
    assetClass: investment?.assetClass ?? "",
    initialAmount: investment?.initialAmount ?? 0,
    returnRate: investment?.returnRate ?? 0,
  };
}

export function resolveDefaultGoalId(
  goals: Pick<InvestmentGoal, "id">[],
  defaultGoalId?: string,
): string | undefined {
  return defaultGoalId && goals.some((goal) => goal.id === defaultGoalId)
    ? defaultGoalId
    : undefined;
}

export function toInvestmentInput(
  values: InvestmentFormValues,
): InvestmentInput {
  return {
    goalId: values.goalId || null,
    name: values.name,
    assetClass: values.assetClass,
    initialAmount: Number(values.initialAmount),
    returnRate: Number(values.returnRate),
  };
}
