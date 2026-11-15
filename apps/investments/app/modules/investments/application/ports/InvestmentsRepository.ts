import type { PersistedInvestmentsState } from "../../domain/InvestmentPortfolio";

export interface InvestmentsRepository {
  load(): PersistedInvestmentsState | null;
  save(state: PersistedInvestmentsState): void;
}
