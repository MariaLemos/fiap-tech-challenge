import { toPersistedInvestmentsState } from "../../modules/investments/application/investmentUseCases";
import { LocalStorageInvestmentsRepository } from "../../modules/investments/infrastructure/LocalStorageInvestmentsRepository";
import type { AppStore } from "../store";
import type { HydratedPayload } from "./investmentsSlice";

export function loadPersistedInvestmentsState(): HydratedPayload | null {
  return new LocalStorageInvestmentsRepository(localStorage).load();
}

export function startInvestmentsPersistence(store: AppStore) {
  const repository = new LocalStorageInvestmentsRepository(localStorage);

  return store.subscribe(() => {
    const state = store.getState().investments;
    if (!state.hydrated) return;

    repository.save(toPersistedInvestmentsState(state));
  });
}
