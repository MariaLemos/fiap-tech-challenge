import { createEncryptedLocalStorage } from "@repo/utils/secure-storage";
import { toPersistedInvestmentsState } from "../../modules/investments/application/investmentUseCases";
import type { InvestmentsRepository } from "../../modules/investments/application/ports/InvestmentsRepository";
import {
  getInvestmentsStorageKey,
  LocalStorageInvestmentsRepository,
} from "../../modules/investments/infrastructure/LocalStorageInvestmentsRepository";
import type { AppStore } from "../store";
import type { HydratedPayload } from "./investmentsSlice";

const volatileRepository: InvestmentsRepository = {
  async load() {
    return null;
  },
  async save() {},
};

export function createBrowserInvestmentsRepository(
  userId: string,
): InvestmentsRepository {
  try {
    const storageKey = getInvestmentsStorageKey(userId);
    const secureStorage = createEncryptedLocalStorage(localStorage, storageKey);

    return new LocalStorageInvestmentsRepository(secureStorage, storageKey);
  } catch {
    return volatileRepository;
  }
}

export function loadPersistedInvestmentsState(
  repository: InvestmentsRepository,
): Promise<HydratedPayload | null> {
  return repository.load();
}

export function startInvestmentsPersistence(
  store: AppStore,
  repository: InvestmentsRepository,
) {
  const persistCurrentState = () => {
    const state = store.getState().investments;
    if (!state.hydrated) return;

    void repository.save(toPersistedInvestmentsState(state));
  };

  const unsubscribe = store.subscribe(persistCurrentState);
  persistCurrentState();
  return unsubscribe;
}
