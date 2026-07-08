"use client";

import { useMemo } from "react";
import {
  SectionBox,
  List,
  Button,
  useModal,
  useDialogModal,
} from "@repo/design-system";
import { useUserInfo } from "../../hooks/UserInfo.provider";
import type { Transaction } from "../../hooks/UserInfo.provider";
import { Filters } from "../Filters/Filters";
import { PaginationNavigation } from "../PaginationNavigation/PaginationNavigation";
import { TransactionForm } from "../TransactionForm/TransactionForm";
import { getStatementFilterDefinitions } from "./Statement.constants";
import { useStatementTransactions } from "./hooks/useStatementTransactions";
import type { StatementFilterField } from "./Statement.types";

export const Statement = ({
  showAddButton = false,
}: {
  showAddButton?: boolean;
}) => {
  const { transactions, deleteTransaction } = useUserInfo();
  const { openModal, closeModal } = useModal();
  const { openDialogModal } = useDialogModal({
    type: "confirmDelete",
    itemName: "transacao",
  });
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

  return (
    <SectionBox
      title="Transacoes"
      headerAction={
        showAddButton && (
          <Button
            variant="primary"
            className=""
            onClick={() =>
              openModal(TransactionForm, { title: "Nova Transacao" })
            }
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
              openModal(TransactionForm, {
                transaction,
                onSubmitCallback: closeModal,
                title: "Editar Transacao",
              })
            }
            onDeleteItem={(transaction) =>
              openDialogModal({
                onConfirm: () => deleteTransaction(transaction.id),
              })
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
