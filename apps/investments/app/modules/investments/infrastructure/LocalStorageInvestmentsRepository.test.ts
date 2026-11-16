import type {
  SecureStorageValue,
  SecureStringStorage,
} from "@repo/utils/secure-storage";
import { describe, expect, it } from "vitest";
import type { PersistedInvestmentsState } from "../domain/InvestmentPortfolio";
import {
  getInvestmentsStorageKey,
  LEGACY_INVESTMENTS_STORAGE_KEY,
  LocalStorageInvestmentsRepository,
} from "./LocalStorageInvestmentsRepository";

class MemorySecureStorage implements SecureStringStorage {
  protected readonly values = new Map<string, SecureStorageValue>();
  writes = 0;
  removals = 0;

  async read(key: string): Promise<SecureStorageValue | null> {
    return this.values.get(key) ?? null;
  }

  async write(key: string, value: string): Promise<void> {
    this.writes += 1;
    this.values.set(key, { value, encrypted: true });
  }

  async remove(key: string): Promise<void> {
    this.removals += 1;
    this.values.delete(key);
  }

  seed(key: string, value: string, encrypted = false): void {
    this.values.set(key, { value, encrypted });
  }

  get(key: string): SecureStorageValue | null {
    return this.values.get(key) ?? null;
  }
}

class FailingReadStorage extends MemorySecureStorage {
  override async read(): Promise<SecureStorageValue | null> {
    throw new Error("storage unavailable");
  }
}

class FailingOnceStorage extends MemorySecureStorage {
  attempts = 0;

  override async write(key: string, value: string): Promise<void> {
    this.attempts += 1;
    if (this.attempts === 1) {
      throw new Error("storage unavailable");
    }

    await super.write(key, value);
  }
}

class FailingOnceRemovalStorage extends MemorySecureStorage {
  removalAttempts = 0;

  override async remove(key: string): Promise<void> {
    this.removalAttempts += 1;
    if (this.removalAttempts === 1) {
      throw new Error("cleanup unavailable");
    }

    await super.remove(key);
  }
}

class DelayedFirstWriteStorage extends MemorySecureStorage {
  private releaseFirst!: () => void;
  private shouldDelay = true;
  readonly firstWriteStarted = new Promise<void>((resolve) => {
    this.releaseFirst = resolve;
  });

  release(): void {
    this.releaseFirst();
  }

  override async write(key: string, value: string): Promise<void> {
    if (this.shouldDelay) {
      this.shouldDelay = false;
      await this.firstWriteStarted;
    }

    await super.write(key, value);
  }
}

const storageKey = getInvestmentsStorageKey("user/1");

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
  it("builds a user-scoped storage key", () => {
    expect(storageKey).toBe("investments:v3:user%2F1");
  });

  it("returns null when no state is persisted", async () => {
    const repository = new LocalStorageInvestmentsRepository(
      new MemorySecureStorage(),
      storageKey,
    );

    await expect(repository.load()).resolves.toBeNull();
  });

  it("contains secure storage read failures", async () => {
    const storage = new FailingReadStorage();
    const repository = new LocalStorageInvestmentsRepository(
      storage,
      storageKey,
    );

    await expect(repository.load()).resolves.toBeNull();
    await repository.save(persistedState);
    expect(storage.writes).toBe(0);
  });

  it("round-trips the validated state", async () => {
    const storage = new MemorySecureStorage();
    const repository = new LocalStorageInvestmentsRepository(
      storage,
      storageKey,
    );

    await repository.save(persistedState);

    expect(storage.get(storageKey)?.encrypted).toBe(true);
    await expect(repository.load()).resolves.toEqual(persistedState);
  });

  it("encrypts valid legacy state before removing the plaintext", async () => {
    const storage = new MemorySecureStorage();
    storage.seed(
      LEGACY_INVESTMENTS_STORAGE_KEY,
      JSON.stringify(persistedState),
    );
    const repository = new LocalStorageInvestmentsRepository(
      storage,
      storageKey,
    );

    await expect(repository.load()).resolves.toEqual(persistedState);
    expect(storage.get(storageKey)).toEqual({
      value: JSON.stringify(persistedState),
      encrypted: true,
    });
    expect(storage.get(LEGACY_INVESTMENTS_STORAGE_KEY)).toBeNull();
    expect(storage.removals).toBe(1);
  });

  it("removes leftover legacy plaintext after loading a valid scoped state", async () => {
    const storage = new MemorySecureStorage();
    storage.seed(storageKey, JSON.stringify(persistedState), true);
    storage.seed(
      LEGACY_INVESTMENTS_STORAGE_KEY,
      JSON.stringify(persistedState),
    );
    const repository = new LocalStorageInvestmentsRepository(
      storage,
      storageKey,
    );

    await expect(repository.load()).resolves.toEqual(persistedState);
    expect(storage.get(LEGACY_INVESTMENTS_STORAGE_KEY)).toBeNull();
  });

  it("falls back to valid legacy state after removing invalid scoped data", async () => {
    const storage = new MemorySecureStorage();
    storage.seed(storageKey, "invalid-json", true);
    storage.seed(
      LEGACY_INVESTMENTS_STORAGE_KEY,
      JSON.stringify(persistedState),
    );
    const repository = new LocalStorageInvestmentsRepository(
      storage,
      storageKey,
    );

    await expect(repository.load()).resolves.toEqual(persistedState);
    expect(storage.get(storageKey)).toEqual({
      value: JSON.stringify(persistedState),
      encrypted: true,
    });
    expect(storage.get(LEGACY_INVESTMENTS_STORAGE_KEY)).toBeNull();
  });

  it("keeps valid legacy data when encryption fails so a save can retry", async () => {
    const storage = new FailingOnceStorage();
    storage.seed(
      LEGACY_INVESTMENTS_STORAGE_KEY,
      JSON.stringify(persistedState),
    );
    const repository = new LocalStorageInvestmentsRepository(
      storage,
      storageKey,
    );

    await expect(repository.load()).resolves.toEqual(persistedState);
    expect(storage.get(LEGACY_INVESTMENTS_STORAGE_KEY)).not.toBeNull();

    await repository.save(persistedState);
    expect(storage.get(storageKey)?.encrypted).toBe(true);
    expect(storage.get(LEGACY_INVESTMENTS_STORAGE_KEY)).toBeNull();
  });

  it("retries legacy cleanup after a successful migration", async () => {
    const storage = new FailingOnceRemovalStorage();
    storage.seed(
      LEGACY_INVESTMENTS_STORAGE_KEY,
      JSON.stringify(persistedState),
    );
    const repository = new LocalStorageInvestmentsRepository(
      storage,
      storageKey,
    );

    await expect(repository.load()).resolves.toEqual(persistedState);
    expect(storage.get(LEGACY_INVESTMENTS_STORAGE_KEY)).not.toBeNull();

    await repository.save(persistedState);
    expect(storage.get(LEGACY_INVESTMENTS_STORAGE_KEY)).toBeNull();
    expect(storage.removalAttempts).toBe(2);
  });

  it("removes invalid legacy data", async () => {
    const storage = new MemorySecureStorage();
    storage.seed(LEGACY_INVESTMENTS_STORAGE_KEY, "invalid-json");
    const repository = new LocalStorageInvestmentsRepository(
      storage,
      storageKey,
    );

    await expect(repository.load()).resolves.toBeNull();
    expect(storage.get(LEGACY_INVESTMENTS_STORAGE_KEY)).toBeNull();
  });

  it("normalizes and rewrites a persisted encrypted state", async () => {
    const storage = new MemorySecureStorage();
    storage.seed(
      storageKey,
      JSON.stringify({ ...persistedState, futureProperty: true }),
      true,
    );
    const repository = new LocalStorageInvestmentsRepository(
      storage,
      storageKey,
    );

    await expect(repository.load()).resolves.toEqual(persistedState);
    expect(storage.writes).toBe(1);
    expect(JSON.parse(storage.get(storageKey)?.value ?? "null")).toEqual(
      persistedState,
    );

    await repository.save(persistedState);
    expect(storage.writes).toBe(1);
  });

  it("does not write the same serialized state twice", async () => {
    const storage = new MemorySecureStorage();
    const repository = new LocalStorageInvestmentsRepository(
      storage,
      storageKey,
    );

    await repository.save(persistedState);
    await repository.save({ ...persistedState });

    expect(storage.writes).toBe(1);
  });

  it("retries a failed save", async () => {
    const storage = new FailingOnceStorage();
    const repository = new LocalStorageInvestmentsRepository(
      storage,
      storageKey,
    );

    await repository.save(persistedState);
    await repository.save(persistedState);

    expect(storage.attempts).toBe(2);
    expect(storage.writes).toBe(1);
  });

  it("serializes concurrent saves so the newest state wins", async () => {
    const storage = new DelayedFirstWriteStorage();
    const repository = new LocalStorageInvestmentsRepository(
      storage,
      storageKey,
    );
    const newestState: PersistedInvestmentsState = {
      ...persistedState,
      goals: [{ ...persistedState.goals[0]!, targetAmount: 20000 }],
    };

    const firstSave = repository.save(persistedState);
    const secondSave = repository.save(newestState);
    storage.release();
    await Promise.all([firstSave, secondSave]);

    expect(JSON.parse(storage.get(storageKey)?.value ?? "null")).toEqual(
      newestState,
    );
    expect(storage.writes).toBe(2);
  });
});
