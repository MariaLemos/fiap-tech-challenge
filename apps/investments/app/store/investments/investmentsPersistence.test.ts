import { describe, expect, it } from "vitest";
import type { InvestmentsRepository } from "../../modules/investments/application/ports/InvestmentsRepository";
import type { PersistedInvestmentsState } from "../../modules/investments/domain/InvestmentPortfolio";
import { createAppStore } from "../store";
import { goalAdded, stateHydrated } from "./investmentsSlice";
import {
  loadPersistedInvestmentsState,
  startInvestmentsPersistence,
} from "./investmentsPersistence";

class RecordingRepository implements InvestmentsRepository {
  readonly saves: PersistedInvestmentsState[] = [];

  constructor(
    private readonly persisted: PersistedInvestmentsState | null = null,
  ) {}

  async load(): Promise<PersistedInvestmentsState | null> {
    return this.persisted;
  }

  async save(state: PersistedInvestmentsState): Promise<void> {
    this.saves.push(state);
  }
}

describe("investments persistence facade", () => {
  it("delegates asynchronous hydration to the repository", async () => {
    const repository = new RecordingRepository({
      goals: [],
      investments: [],
      contributions: [],
    });

    await expect(loadPersistedInvestmentsState(repository)).resolves.toEqual({
      goals: [],
      investments: [],
      contributions: [],
    });
  });

  it("waits for hydration and respects unsubscribe", async () => {
    const repository = new RecordingRepository();
    const store = createAppStore();
    const unsubscribe = startInvestmentsPersistence(store, repository);
    const input = {
      name: "Reserva",
      category: "Curto prazo",
      targetAmount: 10000,
      targetDate: "2027-12-31",
    };

    store.dispatch(goalAdded(input));
    expect(repository.saves).toHaveLength(0);

    store.dispatch(stateHydrated());
    expect(repository.saves).toHaveLength(1);

    unsubscribe();
    store.dispatch(goalAdded({ ...input, name: "Viagem" }));
    expect(repository.saves).toHaveLength(1);
  });

  it("persists immediately when the store is already hydrated", () => {
    const repository = new RecordingRepository();
    const store = createAppStore();
    store.dispatch(stateHydrated());

    const unsubscribe = startInvestmentsPersistence(store, repository);

    expect(repository.saves).toHaveLength(1);
    unsubscribe();
  });
});
