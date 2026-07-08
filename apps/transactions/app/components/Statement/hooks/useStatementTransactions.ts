"use client";

import { useEffect, useMemo, useState } from "react";
import type { Transaction } from "../../../hooks/UserInfo.provider";
import {
  filterTransactions,
  getTransactionCategories,
} from "../Statement.helpers";
import type { TransactionTypeFilter } from "../Statement.types";

const pageSize = 5;

const useTransactionFilters = (transactions: Transaction[]) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = useMemo(
    () => getTransactionCategories(transactions),
    [transactions],
  );

  const filteredTransactions = useMemo(
    () =>
      filterTransactions({
        transactions,
        search,
        typeFilter,
        categoryFilter,
      }),
    [categoryFilter, search, transactions, typeFilter],
  );

  const hasActiveFilters =
    Boolean(search.trim()) || typeFilter !== "all" || categoryFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setCategoryFilter("all");
  };

  return {
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    categories,
    filteredTransactions,
    hasActiveFilters,
    clearFilters,
  };
};

const useStatementPagination = ({
  transactions,
  resetToken,
}: {
  transactions: Transaction[];
  resetToken: string;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(transactions.length / pageSize));

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;

    return transactions.slice(start, start + pageSize);
  }, [currentPage, transactions]);

  useEffect(() => {
    setCurrentPage(1);
  }, [resetToken]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const previousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const nextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };

  return {
    currentPage,
    totalPages,
    paginatedTransactions,
    previousPage,
    nextPage,
  };
};

export const useStatementTransactions = (transactions: Transaction[]) => {
  const filters = useTransactionFilters(transactions);
  const pagination = useStatementPagination({
    transactions: filters.filteredTransactions,
    resetToken: `${filters.search}|${filters.typeFilter}|${filters.categoryFilter}`,
  });

  return {
    ...filters,
    ...pagination,
  };
};
