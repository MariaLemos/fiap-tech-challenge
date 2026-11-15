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

class FailingOnceStorage extends MemoryStorage {
  private failNextWrite = true;

  override setItem(key: string, value: string): void {
    if (this.failNextWrite) {
      this.failNextWrite = false;
      throw new Error("storage unavailable");
    }
    super.setItem(key, value);
  }
}

class FailingCleanupStorage extends MemoryStorage {
  override removeItem(): void {
    throw new Error("cleanup unavailable");
  }
}

class FailingReadStorage extends MemoryStorage {
  override getItem(): string | null {
    throw new Error("read unavailable");
  }
}

class ControllableWriteStorage extends MemoryStorage {
  private shouldFail = false;

  failNextWrite(): void {
    this.shouldFail = true;
  }

  override setItem(key: string, value: string): void {
    if (this.shouldFail) {
      this.shouldFail = false;
      throw new Error("write unavailable");
    }
    super.setItem(key, value);
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

  it("contains storage read failures", () => {
    const repository = new LocalStorageInvestmentsRepository(
      new FailingReadStorage(),
    );

    expect(() => repository.load()).not.toThrow();
    expect(repository.load()).toBeNull();
  });

  it("round-trips the existing storage envelope", () => {
    const storage = new MemoryStorage();
    const repository = new LocalStorageInvestmentsRepository(storage);

    repository.save(persistedState);

    expect(
      JSON.parse(storage.getItem(INVESTMENTS_STORAGE_KEY) ?? "null"),
    ).toEqual(persistedState);
    expect(repository.load()).toEqual(persistedState);
    expect(storage.writes).toBe(1);
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
      JSON.stringify({
        goals: [null],
        investments: [],
        contributions: [],
      }),
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

  it("rewrites a normalized state during load", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      INVESTMENTS_STORAGE_KEY,
      JSON.stringify({ ...persistedState, futureProperty: true }),
    );
    const repository = new LocalStorageInvestmentsRepository(storage);

    expect(repository.load()).toEqual(persistedState);
    expect(storage.writes).toBe(2);
    repository.save(persistedState);
    expect(storage.writes).toBe(2);
    expect(
      JSON.parse(storage.getItem(INVESTMENTS_STORAGE_KEY) ?? "null"),
    ).toEqual(persistedState);
  });

  it("hydrates normalized data even when its immediate rewrite fails", () => {
    const storage = new ControllableWriteStorage();
    storage.setItem(
      INVESTMENTS_STORAGE_KEY,
      JSON.stringify({ ...persistedState, futureProperty: true }),
    );
    storage.failNextWrite();
    const repository = new LocalStorageInvestmentsRepository(storage);

    expect(repository.load()).toEqual(persistedState);
    expect(storage.writes).toBe(1);

    repository.save(persistedState);
    expect(storage.writes).toBe(2);
  });

  it("contains storage errors and retries a failed save", () => {
    const failingWriteStorage = new FailingOnceStorage();
    const repository = new LocalStorageInvestmentsRepository(
      failingWriteStorage,
    );

    expect(() => repository.save(persistedState)).not.toThrow();
    expect(failingWriteStorage.writes).toBe(0);
    expect(() => repository.save(persistedState)).not.toThrow();
    expect(failingWriteStorage.writes).toBe(1);

    const failingCleanupStorage = new FailingCleanupStorage();
    failingCleanupStorage.setItem(INVESTMENTS_STORAGE_KEY, "invalid-json");
    const cleanupRepository = new LocalStorageInvestmentsRepository(
      failingCleanupStorage,
    );

    expect(() => cleanupRepository.load()).not.toThrow();
    expect(cleanupRepository.load()).toBeNull();
  });
});
