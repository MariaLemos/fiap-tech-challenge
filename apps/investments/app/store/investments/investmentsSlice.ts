import { createInvestmentsSlice } from "../../modules/investments/presentation/createInvestmentsSlice";
import { createMockInvestmentsState } from "../../modules/investments/infrastructure/createMockInvestmentsState";
import { systemInvestmentDependencies } from "../../modules/investments/infrastructure/investmentDependencies";

export type {
  GoalInput,
  InvestmentInput,
  InvestmentsState,
  PersistedInvestmentsState as HydratedPayload,
} from "../../modules/investments/domain/InvestmentPortfolio";

export const investmentsSlice = createInvestmentsSlice({
  initialState: createMockInvestmentsState(systemInvestmentDependencies.now),
  dependencies: systemInvestmentDependencies,
});

export const {
  stateHydrated,
  goalAdded,
  goalUpdated,
  goalRemoved,
  investmentAdded,
  investmentUpdated,
  investmentRemoved,
  contributionAdded,
} = investmentsSlice.actions;

export default investmentsSlice.reducer;
