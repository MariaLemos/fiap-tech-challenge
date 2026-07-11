"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import {
  loadPersistedInvestmentsState,
  startInvestmentsPersistence,
} from "./investments/investmentsPersistence";
import { stateHydrated } from "./investments/investmentsSlice";
import { createAppStore, type AppStore } from "./store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createAppStore();
  }

  useEffect(() => {
    const store = storeRef.current;
    if (!store) return;

    const persisted = loadPersistedInvestmentsState();
    store.dispatch(stateHydrated(persisted ?? undefined));

    const unsubscribe = startInvestmentsPersistence(store);
    return unsubscribe;
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
