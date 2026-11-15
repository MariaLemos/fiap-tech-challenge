import type { Transaction } from "../../domain/Transaction";

export interface TransactionRepository {
  load(): Transaction[] | null;
  save(transactions: Transaction[]): void;
}
