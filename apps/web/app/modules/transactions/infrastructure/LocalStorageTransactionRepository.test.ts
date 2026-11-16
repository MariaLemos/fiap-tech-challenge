import {
  EncryptedLocalStorage,
  type EncryptionKeyProvider,
  type SecureStorageValue,
  type SecureStringStorage,
} from "@repo/utils/secure-storage";
import dayjs from "dayjs";
import { describe, expect, it } from "vitest";
import type { Transaction } from "../domain/Transaction";
import {
  getTransactionsStorageKey,
  LocalStorageTransactionRepository,
  TRANSACTIONS_LEGACY_STORAGE_KEY,
} from "./LocalStorageTransactionRepository";

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

class FailingOnceRemovalStorage extends MemoryStorage {
  private failNextRemoval = true;

  override removeItem(key: string): void {
    if (this.failNextRemoval) {
      this.failNextRemoval = false;
      throw new Error("cleanup unavailable");
    }

    super.removeItem(key);
  }
}

class ControllableSecureStorage implements SecureStringStorage {
  readonly writes: string[] = [];
  private releaseFirstWrite: (() => void) | undefined;
  private resolveFirstWriteStarted!: () => void;
  readonly firstWriteStarted = new Promise<void>((resolve) => {
    this.resolveFirstWriteStarted = resolve;
  });

  async read(): Promise<SecureStorageValue | null> {
    return null;
  }

  async write(_key: string, value: string): Promise<void> {
    this.writes.push(value);
    if (this.writes.length !== 1) return;

    this.resolveFirstWriteStarted();
    await new Promise<void>((resolve) => {
      this.releaseFirstWrite = resolve;
    });
  }

  async remove(): Promise<void> {}

  release(): void {
    this.releaseFirstWrite?.();
  }
}

const USER_ID = "user@example.com";
const STORAGE_KEY = getTransactionsStorageKey(USER_ID);

async function createKey(): Promise<CryptoKey> {
  const key = await globalThis.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
  if ("privateKey" in key) throw new Error("Expected a symmetric key.");
  return key;
}

function staticKeyProvider(key: CryptoKey): EncryptionKeyProvider {
  return {
    async getOrCreateKey() {
      return key;
    },
  };
}

async function createRepository(
  storage: MemoryStorage,
  key = createKey(),
): Promise<LocalStorageTransactionRepository> {
  const secureStorage = new EncryptedLocalStorage(
    storage,
    staticKeyProvider(await key),
  );

  return new LocalStorageTransactionRepository(secureStorage, STORAGE_KEY);
}

const buildTransaction = (amount = 125.5): Transaction => ({
  id: `transaction-${amount}`,
  amount,
  type: "withdrawal",
  description: "Mercado",
  category: "Alimentacao",
  date: dayjs("2026-07-10T12:00:00.000Z"),
  attachment: {
    name: "receipt.pdf",
    size: 128,
    type: "application/pdf",
  },
});

describe("LocalStorageTransactionRepository", () => {
  it("returns null when there is no persisted state", async () => {
    const repository = await createRepository(new MemoryStorage());

    await expect(repository.load()).resolves.toBeNull();
  });

  it("persists encrypted data and restores Dayjs values", async () => {
    const storage = new MemoryStorage();
    const repository = await createRepository(storage);
    const transaction = buildTransaction();

    await repository.save([transaction]);

    const raw = storage.getItem(STORAGE_KEY);
    expect(raw).not.toContain("Mercado");
    expect(raw).not.toContain("receipt.pdf");
    expect(JSON.parse(raw ?? "null")).toMatchObject({
      marker: "fiap-secure-storage",
      algorithm: "AES-GCM",
    });

    const restored = await repository.load();
    expect(restored).toHaveLength(1);
    expect(dayjs.isDayjs(restored?.[0]?.date)).toBe(true);
    expect(restored?.[0]?.date.toISOString()).toBe("2026-07-10T12:00:00.000Z");
    expect(restored?.[0]?.attachment).toEqual(transaction.attachment);
  });

  it("migrates valid legacy plaintext before removing it", async () => {
    const storage = new MemoryStorage();
    const transaction = buildTransaction();
    storage.setItem(
      TRANSACTIONS_LEGACY_STORAGE_KEY,
      JSON.stringify([
        { ...transaction, date: transaction.date.toISOString() },
      ]),
    );
    const repository = await createRepository(storage);

    const restored = await repository.load();

    expect(restored?.[0]?.description).toBe("Mercado");
    expect(storage.getItem(TRANSACTIONS_LEGACY_STORAGE_KEY)).toBeNull();
    expect(storage.getItem(STORAGE_KEY)).not.toContain("Mercado");
  });

  it("removes invalid legacy JSON", async () => {
    const storage = new MemoryStorage();
    storage.setItem(TRANSACTIONS_LEGACY_STORAGE_KEY, "invalid-json");
    const repository = await createRepository(storage);

    await expect(repository.load()).resolves.toBeNull();
    expect(storage.getItem(TRANSACTIONS_LEGACY_STORAGE_KEY)).toBeNull();
  });

  it("retries legacy cleanup after encrypted migration", async () => {
    const storage = new FailingOnceRemovalStorage();
    const transaction = buildTransaction();
    storage.setItem(
      TRANSACTIONS_LEGACY_STORAGE_KEY,
      JSON.stringify([
        { ...transaction, date: transaction.date.toISOString() },
      ]),
    );
    const repository = await createRepository(storage);

    await expect(repository.load()).resolves.toHaveLength(1);
    expect(storage.getItem(STORAGE_KEY)).not.toBeNull();
    expect(storage.getItem(TRANSACTIONS_LEGACY_STORAGE_KEY)).not.toBeNull();

    await repository.save([transaction]);
    expect(storage.getItem(TRANSACTIONS_LEGACY_STORAGE_KEY)).toBeNull();
  });

  it("falls back to valid legacy data after removing an invalid scoped value", async () => {
    const storage = new MemoryStorage();
    const transaction = buildTransaction();
    storage.setItem(STORAGE_KEY, "invalid-json");
    storage.setItem(
      TRANSACTIONS_LEGACY_STORAGE_KEY,
      JSON.stringify([
        { ...transaction, date: transaction.date.toISOString() },
      ]),
    );
    const repository = await createRepository(storage);

    await expect(repository.load()).resolves.toHaveLength(1);
    expect(storage.getItem(STORAGE_KEY)).not.toContain("Mercado");
    expect(storage.getItem(TRANSACTIONS_LEGACY_STORAGE_KEY)).toBeNull();
  });

  it("contains key loss and retries a failed encrypted write", async () => {
    const storage = new FailingOnceStorage();
    const firstKey = await createKey();
    const repository = await createRepository(
      storage,
      Promise.resolve(firstKey),
    );

    await repository.save([buildTransaction()]);
    expect(storage.getItem(STORAGE_KEY)).toBeNull();

    await repository.save([buildTransaction()]);
    expect(storage.getItem(STORAGE_KEY)).not.toBeNull();

    const repositoryWithLostKey = await createRepository(storage);
    await expect(repositoryWithLostKey.load()).resolves.toBeNull();

    const ciphertextBeforeSave = storage.getItem(STORAGE_KEY);
    await repositoryWithLostKey.save([buildTransaction(999)]);
    expect(storage.getItem(STORAGE_KEY)).toBe(ciphertextBeforeSave);
  });

  it("serializes concurrent saves in state order", async () => {
    const storage = new ControllableSecureStorage();
    const repository = new LocalStorageTransactionRepository(
      storage,
      STORAGE_KEY,
    );

    const firstSave = repository.save([buildTransaction(100)]);
    await storage.firstWriteStarted;
    const secondSave = repository.save([buildTransaction(200)]);
    storage.release();
    await Promise.all([firstSave, secondSave]);

    expect(storage.writes).toHaveLength(2);
    expect(JSON.parse(storage.writes[0] ?? "[]")[0].amount).toBe(100);
    expect(JSON.parse(storage.writes[1] ?? "[]")[0].amount).toBe(200);
  });
});
