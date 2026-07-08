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
import {
  transactionTypeOptions,
  useStatementTransactions,
} from "./hooks/useStatementTransactions";
import type { TransactionTypeFilter } from "./Statement.types";

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

      <div className="grid gap-3 md:grid-cols-[1fr_12rem_12rem_auto]">
        <label className="flex flex-col gap-1 text-sm font-semibold">
          Buscar por descricao
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Ex: mercado"
            className="h-10 rounded-lg border border-primary bg-foreground p-2 text-font"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-semibold">
          Tipo
          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value as TransactionTypeFilter)
            }
            className="h-10 rounded-lg border border-primary bg-foreground p-2 text-font"
          >
            {transactionTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {categories.length > 0 && (
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Categoria
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="h-10 rounded-lg border border-primary bg-foreground p-2 text-font"
            >
              <option value="all">Todas</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        )}

        {hasActiveFilters && (
          <Button
            type="button"
            variant="secondary"
            className="self-end"
            onClick={clearFilters}
          >
            Limpar
          </Button>
        )}
      </div>

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
