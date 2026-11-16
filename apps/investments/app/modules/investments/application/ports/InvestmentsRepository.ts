import type { PersistedInvestmentsState } from "../../domain/InvestmentPortfolio";

export interface InvestmentsRepository {
  load(): Promise<PersistedInvestmentsState | null>;
  save(state: PersistedInvestmentsState): Promise<void>;
}
