import type { Transaction } from "../../domain/Transaction";

export interface TransactionRepository {
  load(): Promise<Transaction[] | null>;
  save(transactions: Transaction[]): Promise<void>;
}
