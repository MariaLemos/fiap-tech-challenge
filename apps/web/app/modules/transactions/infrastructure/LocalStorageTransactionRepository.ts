import dayjs from "dayjs";
import type { TransactionRepository } from "../application/ports/TransactionRepository";
import type { Transaction } from "../domain/Transaction";

export const TRANSACTIONS_STORAGE_KEY = "transactions";

type TransactionStorage = Pick<Storage, "getItem" | "setItem">;
type SerializedTransaction = Omit<Transaction, "date"> & { date: string };

export class LocalStorageTransactionRepository implements TransactionRepository {
  constructor(
    private readonly storage: TransactionStorage,
    private readonly storageKey = TRANSACTIONS_STORAGE_KEY,
  ) {}

  load(): Transaction[] | null {
    const value = this.storage.getItem(this.storageKey);
    if (!value) {
      return null;
    }

    try {
      const transactions = JSON.parse(value) as SerializedTransaction[];

      return transactions.map((transaction) => ({
        ...transaction,
        date: dayjs(transaction.date),
      }));
    } catch {
      return null;
    }
  }

  save(transactions: Transaction[]): void {
    const serialized = JSON.stringify(
      transactions.map((transaction) => ({
        ...transaction,
        date: transaction.date.toISOString(),
      })),
    );

    this.storage.setItem(this.storageKey, serialized);
  }
}
