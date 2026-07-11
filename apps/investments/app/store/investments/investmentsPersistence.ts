import type { AppStore } from "../store";
import type { HydratedPayload } from "./investmentsSlice";

const STORAGE_KEY = "investments:v2";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isHydratedPayload(value: unknown): value is HydratedPayload {
  if (!isObject(value)) return false;
  return (
    Array.isArray(value.goals) &&
    Array.isArray(value.investments) &&
    Array.isArray(value.contributions)
  );
}

export function loadPersistedInvestmentsState(): HydratedPayload | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isHydratedPayload(parsed)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function startInvestmentsPersistence(store: AppStore) {
  let lastSerialized = "";

  return store.subscribe(() => {
    const state = store.getState().investments;
    if (!state.hydrated) return;

    const persistableState: HydratedPayload = {
      goals: state.goals,
      investments: state.investments,
      contributions: state.contributions,
    };

    const serialized = JSON.stringify(persistableState);
    if (serialized === lastSerialized) return;

    lastSerialized = serialized;
    localStorage.setItem(STORAGE_KEY, serialized);
  });
}
