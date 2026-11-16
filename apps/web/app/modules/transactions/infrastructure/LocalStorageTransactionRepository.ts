import {
  createEncryptedLocalStorage,
  type SecureStorageValue,
  type SecureStringStorage,
} from "@repo/utils/secure-storage";
import dayjs from "dayjs";
import type { TransactionRepository } from "../application/ports/TransactionRepository";
import type { Transaction } from "../domain/Transaction";

export const TRANSACTIONS_LEGACY_STORAGE_KEY = "transactions";
export const TRANSACTIONS_STORAGE_PREFIX = "transactions:v2";

type BrowserStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type SerializedTransaction = Omit<Transaction, "date"> & { date: string };
type StorageReadResult =
  | { status: "missing" }
  | { status: "unavailable" }
  | { status: "available"; value: SecureStorageValue };

export function getTransactionsStorageKey(userId: string): string {
  return `${TRANSACTIONS_STORAGE_PREFIX}:${encodeURIComponent(userId)}`;
}

export function createLocalStorageTransactionRepository(
  storage: BrowserStorage,
  userId: string,
): LocalStorageTransactionRepository {
  const storageKey = getTransactionsStorageKey(userId);

  return new LocalStorageTransactionRepository(
    createEncryptedLocalStorage(storage, storageKey),
    storageKey,
  );
}

export class LocalStorageTransactionRepository implements TransactionRepository {
  private lastSerialized = "";
  private pendingLegacyRemoval = false;
  private persistenceEnabled = true;
  private saveQueue = Promise.resolve();

  constructor(
    private readonly storage: SecureStringStorage,
    private readonly storageKey: string,
    private readonly legacyStorageKey = TRANSACTIONS_LEGACY_STORAGE_KEY,
  ) {}

  async load(): Promise<Transaction[] | null> {
    const scopedValue = await this.read(this.storageKey);
    if (scopedValue.status === "unavailable") {
      this.persistenceEnabled = false;
      return null;
    }

    if (scopedValue.status === "available") {
      const restored = await this.restoreAndNormalize(
        scopedValue.value.value,
        this.storageKey,
        scopedValue.value.encrypted,
      );
      if (restored) return restored;
    }

    const legacyValue = await this.read(this.legacyStorageKey);
    if (legacyValue.status === "unavailable") {
      this.persistenceEnabled = false;
      return null;
    }
    if (legacyValue.status === "missing") return null;

    const transactions = deserializeTransactions(legacyValue.value.value);
    if (!transactions) {
      await this.removeSafely(this.legacyStorageKey);
      return null;
    }

    const serialized = serializeTransactions(transactions);
    this.pendingLegacyRemoval = true;
    try {
      await this.storage.write(this.storageKey, serialized);
      this.lastSerialized = serialized;
      await this.removeMigratedLegacyState();
    } catch {
      // Hydrate valid legacy data and retry encryption on the next save.
    }

    return transactions;
  }

  save(transactions: Transaction[]): Promise<void> {
    if (!this.persistenceEnabled) return Promise.resolve();

    const serialized = serializeTransactions(transactions);

    this.saveQueue = this.saveQueue.then(async () => {
      if (serialized === this.lastSerialized) {
        await this.removeMigratedLegacyState();
        return;
      }

      try {
        await this.storage.write(this.storageKey, serialized);
        this.lastSerialized = serialized;
        await this.removeMigratedLegacyState();
      } catch {
        // Keep the UI usable. A later state update retries the encrypted write.
      }
    });

    return this.saveQueue;
  }

  private async restoreAndNormalize(
    value: string,
    sourceKey: string,
    encrypted: boolean,
  ): Promise<Transaction[] | null> {
    const transactions = deserializeTransactions(value);
    if (!transactions) {
      await this.removeSafely(sourceKey);
      return null;
    }

    const serialized = serializeTransactions(transactions);
    if (encrypted) {
      this.lastSerialized = serialized;
      this.pendingLegacyRemoval = true;
      await this.removeMigratedLegacyState();
      return transactions;
    }

    this.pendingLegacyRemoval = true;
    try {
      await this.storage.write(this.storageKey, serialized);
      this.lastSerialized = serialized;
      await this.removeMigratedLegacyState();
    } catch {
      // A subsequent save retries migration without persisting plaintext.
    }

    return transactions;
  }

  private async read(key: string): Promise<StorageReadResult> {
    try {
      const value = await this.storage.read(key);
      return value ? { status: "available", value } : { status: "missing" };
    } catch {
      return { status: "unavailable" };
    }
  }

  private async removeSafely(key: string): Promise<void> {
    try {
      await this.storage.remove(key);
    } catch {
      // Cleanup failure must not prevent the application from hydrating.
    }
  }

  private async removeMigratedLegacyState(): Promise<void> {
    if (!this.pendingLegacyRemoval) return;

    try {
      await this.storage.remove(this.legacyStorageKey);
      this.pendingLegacyRemoval = false;
    } catch {
      // Retry cleanup after the next successful or deduplicated save.
    }
  }
}

function serializeTransactions(transactions: Transaction[]): string {
  return JSON.stringify(
    transactions.map((transaction) => ({
      ...transaction,
      date: transaction.date.toISOString(),
    })),
  );
}

function deserializeTransactions(value: string): Transaction[] | null {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed) || !parsed.every(isSerializedTransaction)) {
      return null;
    }

    return parsed.map((transaction) => ({
      ...transaction,
      date: dayjs(transaction.date),
    }));
  } catch {
    return null;
  }
}

function isSerializedTransaction(
  value: unknown,
): value is SerializedTransaction {
  if (typeof value !== "object" || value === null) return false;

  const transaction = value as Record<string, unknown>;
  const type = transaction["type"];
  const status = transaction["status"];
  const attachment = transaction["attachment"];
  const date = transaction["date"];

  return (
    typeof transaction["id"] === "string" &&
    typeof transaction["amount"] === "number" &&
    Number.isFinite(transaction["amount"]) &&
    (type === "deposit" ||
      type === "transfer" ||
      type === "withdrawal" ||
      type === "expense") &&
    typeof date === "string" &&
    dayjs(date).isValid() &&
    (transaction["category"] === undefined ||
      typeof transaction["category"] === "string") &&
    (transaction["description"] === undefined ||
      typeof transaction["description"] === "string") &&
    (status === undefined ||
      status === "completed" ||
      status === "pending" ||
      status === "failed") &&
    (attachment === undefined ||
      attachment === null ||
      isSerializedAttachment(attachment))
  );
}

function isSerializedAttachment(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;

  const attachment = value as Record<string, unknown>;
  return (
    typeof attachment["name"] === "string" &&
    typeof attachment["size"] === "number" &&
    Number.isFinite(attachment["size"]) &&
    typeof attachment["type"] === "string"
  );
}
