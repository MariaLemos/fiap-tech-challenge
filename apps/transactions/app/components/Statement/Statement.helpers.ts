import type { Transaction } from "../../hooks/UserInfo.provider";
import type { TransactionTypeFilter } from "./Statement.types";

export const getTransactionCategories = (transactions: Transaction[]) => {
  const categorySet = new Set(
    transactions
      .map((transaction) => transaction.category?.trim())
      .filter((category): category is string => Boolean(category)),
  );

  return Array.from(categorySet).sort((a, b) => a.localeCompare(b));
};

export const filterTransactions = ({
  transactions,
  search,
  typeFilter,
  categoryFilter,
}: {
  transactions: Transaction[];
  search: string;
  typeFilter: TransactionTypeFilter;
  categoryFilter: string;
}) => {
  const normalizedSearch = search.trim().toLowerCase();

  return transactions.filter((transaction) => {
    const matchesSearch =
      !normalizedSearch ||
      transaction.description?.toLowerCase().includes(normalizedSearch);
    const matchesType =
      typeFilter === "all" || transaction.type === typeFilter;
    const matchesCategory =
      categoryFilter === "all" || transaction.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });
};
