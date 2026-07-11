"use client";

import { useEffect, useMemo, useState } from "react";
import type { Transaction } from "../../../hooks/UserInfo.provider";
import { initialStatementFilters } from "../Statement.constants";
import {
  filterTransactions,
  getTransactionCategories,
} from "../Statement.helpers";
import type { StatementFilterValues } from "../Statement.types";

const pageSize = 5;

const useTransactionFilters = (transactions: Transaction[]) => {
  const [filters, setFilters] = useState<StatementFilterValues>(
    initialStatementFilters,
  );

  const categories = useMemo(
    () => getTransactionCategories(transactions),
    [transactions],
  );

  const filteredTransactions = useMemo(
    () =>
      filterTransactions({
        transactions,
        filters,
      }),
    [filters, transactions],
  );

  return {
    filters,
    setFilters,
    categories,
    filteredTransactions,
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
    resetToken: `${filters.filters.description}|${filters.filters.type}|${filters.filters.category}`,
  });

  return {
    ...filters,
    ...pagination,
  };
};


