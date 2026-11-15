import dayjs from "dayjs";
import { describe, expect, it } from "vitest";
import type { Transaction } from "../domain/Transaction";
import {
  LocalStorageTransactionRepository,
  TRANSACTIONS_STORAGE_KEY,
} from "./LocalStorageTransactionRepository";

class MemoryStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

const buildTransaction = (): Transaction => ({
  id: "transaction-1",
  amount: 125.5,
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
  it("returns null when there is no persisted state", () => {
    const repository = new LocalStorageTransactionRepository(
      new MemoryStorage(),
    );

    expect(repository.load()).toBeNull();
  });

  it("persists ISO dates and restores Dayjs values", () => {
    const storage = new MemoryStorage();
    const repository = new LocalStorageTransactionRepository(storage);
    const transaction = buildTransaction();

    repository.save([transaction]);

    const raw = storage.getItem(TRANSACTIONS_STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw ?? "[]")[0]).toMatchObject({
      id: transaction.id,
      date: "2026-07-10T12:00:00.000Z",
      attachment: transaction.attachment,
    });

    const restored = repository.load();
    expect(restored).toHaveLength(1);
    expect(dayjs.isDayjs(restored?.[0]?.date)).toBe(true);
    expect(restored?.[0]?.date.toISOString()).toBe("2026-07-10T12:00:00.000Z");
    expect(restored?.[0]?.attachment).toEqual(transaction.attachment);
  });

  it("returns null for invalid persisted JSON", () => {
    const storage = new MemoryStorage();
    storage.setItem(TRANSACTIONS_STORAGE_KEY, "invalid-json");
    const repository = new LocalStorageTransactionRepository(storage);

    expect(repository.load()).toBeNull();
  });
});
