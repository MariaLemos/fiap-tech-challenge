import { describe, expect, it } from "vitest";
import type { PersistedInvestmentsState } from "../domain/InvestmentPortfolio";
import {
  INVESTMENTS_STORAGE_KEY,
  LocalStorageInvestmentsRepository,
} from "./LocalStorageInvestmentsRepository";

class MemoryStorage {
  private readonly values = new Map<string, string>();
  writes = 0;
  removals = 0;

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.writes += 1;
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.removals += 1;
    this.values.delete(key);
  }
}

const persistedState: PersistedInvestmentsState = {
  goals: [
    {
      id: "goal-1",
      name: "Reserva",
      category: "Curto prazo",
      targetAmount: 10000,
      targetDate: "2027-12-31",
      description: "Reserva financeira",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ],
  investments: [
    {
      id: "investment-1",
      goalId: "goal-1",
      name: "CDB",
      assetClass: "Renda fixa",
      initialAmount: 1000,
      returnRate: 10,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ],
  contributions: [
    {
      id: "contribution-1",
      investmentId: "investment-1",
      amount: 100,
      date: "2026-02-01",
    },
  ],
};

describe("LocalStorageInvestmentsRepository", () => {
  it("returns null when no state is persisted", () => {
    const repository = new LocalStorageInvestmentsRepository(
      new MemoryStorage(),
    );

    expect(repository.load()).toBeNull();
  });

  it("round-trips the existing storage envelope", () => {
    const storage = new MemoryStorage();
    const repository = new LocalStorageInvestmentsRepository(storage);

    repository.save(persistedState);

    expect(JSON.parse(storage.getItem(INVESTMENTS_STORAGE_KEY) ?? "null")).toEqual(
      persistedState,
    );
    expect(repository.load()).toEqual(persistedState);
  });

  it("removes invalid JSON and invalid envelopes", () => {
    const invalidJsonStorage = new MemoryStorage();
    invalidJsonStorage.setItem(INVESTMENTS_STORAGE_KEY, "invalid-json");
    const invalidJsonRepository = new LocalStorageInvestmentsRepository(
      invalidJsonStorage,
    );

    expect(invalidJsonRepository.load()).toBeNull();
    expect(invalidJsonStorage.removals).toBe(1);

    const invalidEnvelopeStorage = new MemoryStorage();
    invalidEnvelopeStorage.setItem(
      INVESTMENTS_STORAGE_KEY,
      JSON.stringify({ goals: [] }),
    );
    const invalidEnvelopeRepository = new LocalStorageInvestmentsRepository(
      invalidEnvelopeStorage,
    );

    expect(invalidEnvelopeRepository.load()).toBeNull();
    expect(invalidEnvelopeStorage.removals).toBe(1);
  });

  it("does not write the same serialized state twice", () => {
    const storage = new MemoryStorage();
    const repository = new LocalStorageInvestmentsRepository(storage);

    repository.save(persistedState);
    repository.save({ ...persistedState });

    expect(storage.writes).toBe(1);
  });
});
