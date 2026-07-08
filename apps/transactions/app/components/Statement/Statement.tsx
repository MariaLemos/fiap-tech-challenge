"use client";

import {
  SectionBox,
  List,
  Button,
  useModal,
  useDialogModal,
} from "@repo/design-system";
import { useUserInfo } from "../../hooks/UserInfo.provider";
import type { Transaction } from "../../hooks/UserInfo.provider";
import { TransactionForm } from "../TransactionForm/TransactionForm";
import { StatementFilters } from "./components/StatementFilters";
import { useStatementTransactions } from "./hooks/useStatementTransactions";

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
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    categories,
    filteredTransactions,
    paginatedTransactions,
    currentPage,
    totalPages,
    hasActiveFilters,
    clearFilters,
    previousPage,
    nextPage,
  } = useStatementTransactions(transactions);

  return (
    <SectionBox
      title="Extrato"
      className="statement h-[calc(100vh-6rem)] overflow-y-scroll gap-4"
      variant="colored"
    >
      {showAddButton && (
        <Button
          variant="primary"
          className=""
          onClick={() => openModal(TransactionForm, { title: "Nova Transacao" })}
        >
          Nova Transacao
        </Button>
      )}

      <StatementFilters
        search={search}
        typeFilter={typeFilter}
        categoryFilter={categoryFilter}
        categories={categories}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onTypeFilterChange={setTypeFilter}
        onCategoryFilterChange={setCategoryFilter}
        onClearFilters={clearFilters}
      />

      {filteredTransactions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-primary p-8 text-center text-muted">
          Nenhum resultado encontrado.
        </div>
      ) : (
        <>
          <List<Transaction>
            className="w-full"
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

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-muted">
              Pagina {currentPage} de {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                disabled={currentPage === 1}
                onClick={previousPage}
              >
                Anterior
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={currentPage === totalPages}
                onClick={nextPage}
              >
                Proxima
              </Button>
            </div>
          </div>
        </>
      )}
    </SectionBox>
  );
};
