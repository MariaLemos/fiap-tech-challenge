"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SectionBox, List, Button } from "@repo/design-system";
import { useUserInfo } from "../../hooks/UserInfo.provider";
import type { Transaction } from "../../hooks/UserInfo.provider";
import { Filters } from "../Filters/Filters";
import { PaginationNavigation } from "../PaginationNavigation/PaginationNavigation";
import { getStatementFilterDefinitions } from "./Statement.constants";
import { useStatementTransactions } from "./hooks/useStatementTransactions";
import type { StatementFilterField } from "./Statement.types";

export const Statement = ({
  showAddButton = false,
}: {
  showAddButton?: boolean;
}) => {
  const router = useRouter();
  const { transactions } = useUserInfo();
  const {
    filters,
    setFilters,
    categories,
    filteredTransactions,
    paginatedTransactions,
    currentPage,
    totalPages,
    previousPage,
    nextPage,
  } = useStatementTransactions(transactions);
  const filterDefinitions = useMemo(
    () => getStatementFilterDefinitions(categories),
    [categories],
  );

  useEffect(() => {
    router.prefetch("/transactions/new");

    paginatedTransactions.forEach((transaction) => {
      router.prefetch(`/transactions/${transaction.id}/edit`);
      router.prefetch(`/transactions/${transaction.id}/delete`);
    });
  }, [paginatedTransactions, router]);

  return (
    <SectionBox
      title="Transacoes"
      headerAction={
        showAddButton && (
          <Button
            variant="primary"
            className=""
            onClick={() => router.push("/transactions/new")}
          >
            Nova Transacao
          </Button>
        )
      }
      className="statement h-[calc(100vh-6rem)] overflow-y-scroll gap-4"
      variant="colored"
    >
      <Filters<StatementFilterField>
        definitions={filterDefinitions}
        values={filters}
        onChangeFilters={setFilters}
      />

      {filteredTransactions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-primary p-8 text-center text-muted">
          Nenhum resultado encontrado.
        </div>
      ) : (
        <>
          <List<Transaction>
            className="w-full pt-4"
            data={paginatedTransactions}
            onEditItem={(transaction) =>
              router.push(`/transactions/${transaction.id}/edit`)
            }
            onDeleteItem={(transaction) =>
              router.push(`/transactions/${transaction.id}/delete`)
            }
          />

          <PaginationNavigation
            currentPage={currentPage}
            totalPages={totalPages}
            onPreviousPage={previousPage}
            onNextPage={nextPage}
          />
        </>
      )}
    </SectionBox>
  );
};
