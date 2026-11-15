import { afterEach, describe, expect, it, vi } from "vitest";
import { createAppStore } from "../store";
import {
  goalAdded,
  stateHydrated,
} from "./investmentsSlice";
import { startInvestmentsPersistence } from "./investmentsPersistence";

class MemoryStorage {
  private readonly values = new Map<string, string>();
  writes = 0;

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.writes += 1;
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("investments persistence facade", () => {
  it("waits for hydration, deduplicates writes and respects unsubscribe", () => {
    const storage = new MemoryStorage();
    vi.stubGlobal("localStorage", storage);
    const store = createAppStore();
    const unsubscribe = startInvestmentsPersistence(store);
    const input = {
      name: "Reserva",
      category: "Curto prazo",
      targetAmount: 10000,
      targetDate: "2027-12-31",
    };

    store.dispatch(goalAdded(input));
    expect(storage.writes).toBe(0);

    store.dispatch(stateHydrated());
    expect(storage.writes).toBe(1);

    store.dispatch(stateHydrated());
    expect(storage.writes).toBe(1);

    unsubscribe();
    store.dispatch(goalAdded(input));
    expect(storage.writes).toBe(1);
  });
});
