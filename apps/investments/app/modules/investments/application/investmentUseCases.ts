import type {
  ContributionInput,
  GoalInput,
  InvestmentInput,
  InvestmentsState,
  PersistedInvestmentsState,
} from "../domain/InvestmentPortfolio";

export type InvestmentDependencies = {
  now: () => string;
  createId: () => string;
};

export function hydrateInvestments(
  state: InvestmentsState,
  persistedState?: PersistedInvestmentsState,
): InvestmentsState {
  if (!persistedState) return { ...state, hydrated: true };

  return { ...state, ...persistedState, hydrated: true };
}

export function addGoal(
  state: InvestmentsState,
  input: GoalInput,
  dependencies: InvestmentDependencies,
): InvestmentsState {
  const timestamp = dependencies.now();

  return {
    ...state,
    goals: [
      ...state.goals,
      {
        id: dependencies.createId(),
        ...input,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
  };
}

export function updateGoal(
  state: InvestmentsState,
  id: string,
  input: GoalInput,
  dependencies: InvestmentDependencies,
): InvestmentsState {
  if (!state.goals.some((goal) => goal.id === id)) return state;
  const timestamp = dependencies.now();

  return {
    ...state,
    goals: state.goals.map((goal) =>
      goal.id === id ? { ...goal, ...input, updatedAt: timestamp } : goal,
    ),
  };
}

export function removeGoal(
  state: InvestmentsState,
  goalId: string,
  dependencies: InvestmentDependencies,
): InvestmentsState {
  const timestamp = dependencies.now();

  return {
    ...state,
    goals: state.goals.filter((goal) => goal.id !== goalId),
    investments: state.investments.map((investment) =>
      investment.goalId === goalId
        ? { ...investment, goalId: null, updatedAt: timestamp }
        : investment,
    ),
  };
}

export function addInvestment(
  state: InvestmentsState,
  input: InvestmentInput,
  dependencies: InvestmentDependencies,
): InvestmentsState {
  const timestamp = dependencies.now();

  return {
    ...state,
    investments: [
      ...state.investments,
      {
        id: dependencies.createId(),
        ...input,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
  };
}

export function updateInvestment(
  state: InvestmentsState,
  id: string,
  input: InvestmentInput,
  dependencies: InvestmentDependencies,
): InvestmentsState {
  if (!state.investments.some((investment) => investment.id === id)) {
    return state;
  }
  const timestamp = dependencies.now();

  return {
    ...state,
    investments: state.investments.map((investment) =>
      investment.id === id
        ? { ...investment, ...input, updatedAt: timestamp }
        : investment,
    ),
  };
}

export function removeInvestment(
  state: InvestmentsState,
  investmentId: string,
): InvestmentsState {
  return {
    ...state,
    investments: state.investments.filter(
      (investment) => investment.id !== investmentId,
    ),
    contributions: state.contributions.filter(
      (contribution) => contribution.investmentId !== investmentId,
    ),
  };
}

export function addContribution(
  state: InvestmentsState,
  input: ContributionInput,
  dependencies: InvestmentDependencies,
): InvestmentsState {
  return {
    ...state,
    contributions: [
      ...state.contributions,
      {
        id: dependencies.createId(),
        investmentId: input.investmentId,
        amount: input.amount,
        date: input.date,
      },
    ],
  };
}

export function toPersistedInvestmentsState(
  state: InvestmentsState,
): PersistedInvestmentsState {
  return {
    goals: state.goals,
    investments: state.investments,
    contributions: state.contributions,
  };
}
