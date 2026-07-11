import type { Transaction } from "@repo/contracts";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function calculateBalance<TDate>(transactions: Transaction<TDate>[]) {
  return transactions.reduce((total, transaction) => {
    if (transaction.status === "failed") return total;
    return transaction.type === "deposit"
      ? total + transaction.amount
      : total - transaction.amount;
  }, 0);
}

export function groupTransactionsByCategory<TDate>(
  transactions: Transaction<TDate>[],
) {
  return transactions.reduce<Record<string, number>>((groups, transaction) => {
    if (transaction.status === "failed") return groups;

    const category = transaction.category || "Sem categoria";

    return {
      ...groups,
      [category]: (groups[category] || 0) + transaction.amount,
    };
  }, {});
}
