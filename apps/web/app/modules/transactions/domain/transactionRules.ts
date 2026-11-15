import dayjs from "dayjs";
import type {
  NewTransaction,
  Transaction,
  TransactionUpdate,
} from "./Transaction";

export function sanitizeNewTransaction(
  transaction: NewTransaction,
): NewTransaction {
  return {
    amount: Math.abs(Number(transaction.amount)) || 0,
    type: transaction.type,
    description: transaction.description?.trim() || "",
    category: transaction.category?.trim() || "",
    date: dayjs.isDayjs(transaction.date)
      ? transaction.date
      : dayjs(transaction.date),
    attachment: transaction.attachment ?? null,
  };
}

export function sanitizeTransactionUpdate(
  transaction: TransactionUpdate,
): TransactionUpdate {
  if (!transaction.amount) {
    return transaction;
  }

  return {
    ...transaction,
    amount: Math.abs(Number(transaction.amount)),
  };
}

export function sortTransactionsByDate(
  transactions: Transaction[],
): Transaction[] {
  return [...transactions].sort(
    (first, second) => second.date.valueOf() - first.date.valueOf(),
  );
}

export function calculateTransactionBalance(
  transactions: Transaction[],
): number {
  return transactions.reduce((total, transaction) => {
    return transaction.type === "deposit"
      ? total + Number(transaction.amount)
      : total - Number(transaction.amount);
  }, 0);
}
