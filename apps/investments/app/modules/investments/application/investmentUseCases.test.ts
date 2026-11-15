import { describe, expect, it } from "vitest";
import type {
  GoalInput,
  InvestmentInput,
  InvestmentsState,
  PersistedInvestmentsState,
} from "../domain/InvestmentPortfolio";
import {
  addContribution,
  addGoal,
  addInvestment,
  hydrateInvestments,
  removeGoal,
  removeInvestment,
  toPersistedInvestmentsState,
  updateGoal,
  updateInvestment,
  type InvestmentDependencies,
} from "./investmentUseCases";

const timestamp = "2026-08-01T12:00:00.000Z";
const dependencies: InvestmentDependencies = {
  now: () => timestamp,
  createId: () => "generated-id",
};
const updatedTimestamp = "2026-09-01T12:00:00.000Z";
const updateDependencies: InvestmentDependencies = {
  now: () => updatedTimestamp,
  createId: () => "unused-id",
};

const goalInput: GoalInput = {
  name: "Casa",
  category: "Patrimonio",
  targetAmount: 200000,
  targetDate: "2030-12-31",
  description: "Entrada",
};

const investmentInput: InvestmentInput = {
  goalId: "goal-1",
  name: "Tesouro",
  assetClass: "Renda fixa",
  initialAmount: 1000,
  returnRate: 10,
};

const buildState = (): InvestmentsState => ({
  goals: [
    {
      id: "goal-1",
      ...goalInput,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ],
  investments: [
    {
      id: "investment-1",
      ...investmentInput,
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
  hydrated: false,
});

describe("investment use cases", () => {
  it("hydrates with persisted data or keeps the initial collections", () => {
    const initialState = buildState();
    const persistedState: PersistedInvestmentsState = {
      goals: [],
      investments: [],
      contributions: [],
    };

    expect(hydrateInvestments(initialState)).toEqual({
      ...initialState,
      hydrated: true,
    });
    expect(hydrateInvestments(initialState, persistedState)).toEqual({
      ...persistedState,
      hydrated: true,
    });
  });

  it("adds and updates a goal with injected identity and time", () => {
    const initialState = { ...buildState(), goals: [] };
    const added = addGoal(initialState, goalInput, dependencies);
    const updatedInput = { ...goalInput, name: "Casa atualizada" };
    const updated = updateGoal(
      added,
      "generated-id",
      updatedInput,
      updateDependencies,
    );

    expect(added.goals[0]).toEqual({
      id: "generated-id",
      ...goalInput,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    expect(updated.goals[0]).toEqual({
      id: "generated-id",
      ...updatedInput,
      createdAt: timestamp,
      updatedAt: updatedTimestamp,
    });
    expect(updateGoal(updated, "missing", goalInput, dependencies)).toBe(
      updated,
    );
  });

  it("removes a goal and unassigns its investments without deleting contributions", () => {
    const state = buildState();
    const unrelatedInvestment = {
      ...state.investments[0]!,
      id: "investment-2",
      goalId: null,
    };
    const stateWithUnrelatedData = {
      ...state,
      investments: [...state.investments, unrelatedInvestment],
    };
    const result = removeGoal(
      stateWithUnrelatedData,
      "goal-1",
      dependencies,
    );

    expect(result.goals).toEqual([]);
    expect(result.investments[0]).toMatchObject({
      id: "investment-1",
      goalId: null,
      updatedAt: timestamp,
    });
    expect(result.investments[1]).toEqual(unrelatedInvestment);
    expect(result.contributions).toEqual(stateWithUnrelatedData.contributions);
  });

  it("adds and updates an investment with injected identity and time", () => {
    const initialState = { ...buildState(), investments: [] };
    const added = addInvestment(initialState, investmentInput, dependencies);
    const updatedInput = { ...investmentInput, name: "Tesouro atualizado" };
    const updated = updateInvestment(
      added,
      "generated-id",
      updatedInput,
      updateDependencies,
    );

    expect(added.investments[0]).toEqual({
      id: "generated-id",
      ...investmentInput,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    expect(updated.investments[0]).toEqual({
      id: "generated-id",
      ...updatedInput,
      createdAt: timestamp,
      updatedAt: updatedTimestamp,
    });
    expect(
      updateInvestment(updated, "missing", investmentInput, dependencies),
    ).toBe(updated);
  });

  it("removes an investment and all of its contributions", () => {
    const state = buildState();
    const unrelatedInvestment = {
      ...state.investments[0]!,
      id: "investment-2",
    };
    const unrelatedContribution = {
      ...state.contributions[0]!,
      id: "contribution-2",
      investmentId: "investment-2",
    };
    const result = removeInvestment(
      {
        ...state,
        investments: [...state.investments, unrelatedInvestment],
        contributions: [...state.contributions, unrelatedContribution],
      },
      "investment-1",
    );

    expect(result.investments).toEqual([unrelatedInvestment]);
    expect(result.contributions).toEqual([unrelatedContribution]);
    expect(result.goals).toHaveLength(1);
  });

  it("adds a contribution and excludes hydration metadata from persistence", () => {
    const state = addContribution(
      buildState(),
      {
        investmentId: "investment-1",
        amount: 50,
        date: "2026-03-01",
      },
      dependencies,
    );

    expect(state.contributions.at(-1)).toEqual({
      id: "generated-id",
      investmentId: "investment-1",
      amount: 50,
      date: "2026-03-01",
    });
    expect(toPersistedInvestmentsState(state)).toEqual({
      goals: state.goals,
      investments: state.investments,
      contributions: state.contributions,
    });
    expect(toPersistedInvestmentsState(state)).not.toHaveProperty("hydrated");
  });
});
