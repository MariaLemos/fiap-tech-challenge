import type {
  NewTransaction,
  Transaction,
  TransactionUpdate,
} from "../domain/Transaction";
import {
  sanitizeNewTransaction,
  sanitizeTransactionUpdate,
  sortTransactionsByDate,
} from "../domain/transactionRules";

export type TransactionIdGenerator = () => string;

export function createTransaction(
  input: NewTransaction,
  generateId: TransactionIdGenerator,
): Transaction {
  return {
    ...sanitizeNewTransaction(input),
    id: generateId(),
  };
}

export function hydrateTransactions(
  transactions: Transaction[],
): Transaction[] {
  return sortTransactionsByDate(transactions);
}

export function addTransactionToList(
  transactions: Transaction[],
  transaction: Transaction,
): Transaction[] {
  return sortTransactionsByDate([...transactions, transaction]);
}

export function updateTransactionInList(
  transactions: Transaction[],
  id: string,
  update: TransactionUpdate,
): Transaction[] {
  const sanitizedUpdate = sanitizeTransactionUpdate(update);

  return transactions.map((transaction) =>
    transaction.id === id
      ? { ...transaction, ...sanitizedUpdate }
      : transaction,
  );
}

export function deleteTransactionFromList(
  transactions: Transaction[],
  id: string,
): Transaction[] {
  return transactions.filter((transaction) => transaction.id !== id);
}
