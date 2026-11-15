import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  addContribution,
  addGoal,
  addInvestment,
  hydrateInvestments,
  removeGoal,
  removeInvestment,
  updateGoal,
  updateInvestment,
  type InvestmentDependencies,
} from "../application/investmentUseCases";
import type {
  ContributionInput,
  GoalInput,
  InvestmentInput,
  InvestmentsState,
  PersistedInvestmentsState,
} from "../domain/InvestmentPortfolio";

type CreateInvestmentsSliceOptions = {
  initialState: InvestmentsState;
  dependencies: InvestmentDependencies;
};

export function createInvestmentsSlice({
  initialState,
  dependencies,
}: CreateInvestmentsSliceOptions) {
  return createSlice({
    name: "investments",
    initialState,
    reducers: {
      stateHydrated: {
        prepare(payload?: PersistedInvestmentsState) {
          return { payload };
        },
        reducer(
          state,
          action: PayloadAction<PersistedInvestmentsState | undefined>,
        ) {
          return hydrateInvestments(state, action.payload);
        },
      },
      goalAdded(state, action: PayloadAction<GoalInput>) {
        return addGoal(state, action.payload, dependencies);
      },
      goalUpdated(
        state,
        action: PayloadAction<{ id: string; input: GoalInput }>,
      ) {
        return updateGoal(
          state,
          action.payload.id,
          action.payload.input,
          dependencies,
        );
      },
      goalRemoved(state, action: PayloadAction<string>) {
        return removeGoal(state, action.payload, dependencies);
      },
      investmentAdded(state, action: PayloadAction<InvestmentInput>) {
        return addInvestment(state, action.payload, dependencies);
      },
      investmentUpdated(
        state,
        action: PayloadAction<{ id: string; input: InvestmentInput }>,
      ) {
        return updateInvestment(
          state,
          action.payload.id,
          action.payload.input,
          dependencies,
        );
      },
      investmentRemoved(state, action: PayloadAction<string>) {
        return removeInvestment(state, action.payload);
      },
      contributionAdded(state, action: PayloadAction<ContributionInput>) {
        return addContribution(state, action.payload, dependencies);
      },
    },
  });
}
