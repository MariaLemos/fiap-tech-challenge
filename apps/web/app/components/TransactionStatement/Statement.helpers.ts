import type { Transaction } from "../../hooks/UserInfo.provider";
import type {
  StatementFilterValues,
  TransactionTypeFilter,
} from "./Statement.types";

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
  filters,
}: {
  transactions: Transaction[];
  filters: StatementFilterValues;
}) => {
  const normalizedSearch = filters.description.trim().toLowerCase();
  const typeFilter = filters.type as TransactionTypeFilter;

  return transactions.filter((transaction) => {
    const matchesSearch =
      !normalizedSearch ||
      transaction.description?.toLowerCase().includes(normalizedSearch);
    const matchesType =
      typeFilter === "all" || transaction.type === typeFilter;
    const matchesCategory =
      filters.category === "all" || transaction.category === filters.category;

    return matchesSearch && matchesType && matchesCategory;
  });
};


