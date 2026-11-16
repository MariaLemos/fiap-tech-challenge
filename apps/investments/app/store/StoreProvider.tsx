"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import {
  createBrowserInvestmentsRepository,
  loadPersistedInvestmentsState,
  startInvestmentsPersistence,
} from "./investments/investmentsPersistence";
import { stateHydrated } from "./investments/investmentsSlice";
import { createAppStore, type AppStore } from "./store";

interface StoreProviderProps {
  children: React.ReactNode;
  userId: string | null;
}

export function StoreProvider({ children, userId }: StoreProviderProps) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createAppStore();
  }

  useEffect(() => {
    const store = storeRef.current;
    if (!store) return;

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    const hydrate = async () => {
      if (!userId) {
        if (!cancelled) {
          store.dispatch(stateHydrated());
        }
        return;
      }

      try {
        const repository = createBrowserInvestmentsRepository(userId);
        const persisted = await loadPersistedInvestmentsState(repository);
        if (cancelled) return;

        store.dispatch(stateHydrated(persisted ?? undefined));
        unsubscribe = startInvestmentsPersistence(store, repository);
      } catch {
        if (!cancelled) {
          store.dispatch(stateHydrated());
        }
      }
    };

    void hydrate();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [userId]);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
