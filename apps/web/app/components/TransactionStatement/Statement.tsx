"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SectionBox, List, Button } from "@repo/design-system";
import { useUserInfo } from "../../hooks/UserInfo.provider";
import type { Transaction } from "../../hooks/UserInfo.provider";
import { DeleteTransaction } from "../DeleteTransaction/DeleteTransaction";
import { EditTransaction } from "../EditTransaction/EditTransaction";
import { Filters } from "../Filters/Filters";
import { PaginationNavigation } from "../PaginationNavigation/PaginationNavigation";
import { RouteModal } from "../RouteModal/RouteModal";
import { getStatementFilterDefinitions } from "./Statement.constants";
import { useStatementTransactions } from "./hooks/useStatementTransactions";
import type { StatementFilterField } from "./Statement.types";
import { useI18n } from "@repo/i18n/react";

type StatementModal =
  | { type: "edit"; transactionId: string }
  | { type: "delete"; transactionId: string };

export const Statement = ({
  showAddButton = false,
}: {
  showAddButton?: boolean;
}) => {
  const router = useRouter();
  const { t } = useI18n();
  const [modal, setModal] = useState<StatementModal | null>(null);
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
    () => getStatementFilterDefinitions(categories, t),
    [categories, t],
  );

  return (
    <>
      <SectionBox
        title={t("transactions.title")}
        headerAction={
          showAddButton && (
            <Button
              type="button"
              variant="primary"
              className=""
              onClick={() => router.push("/transactions/new")}
            >
              {t("transactions.new")}
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
          <div role="status" className="rounded-lg border border-dashed border-primary p-8 text-center text-muted">
            {t("transactions.noResults")}
          </div>
        ) : (
          <>
            <List<Transaction>
              className="w-full pt-4"
              data={paginatedTransactions}
              onEditItem={(transaction) =>
                setModal({ type: "edit", transactionId: transaction.id })
              }
              onDeleteItem={(transaction) =>
                setModal({ type: "delete", transactionId: transaction.id })
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

      {modal?.type === "edit" && (
        <RouteModal title={t("transactions.edit")} onClose={() => setModal(null)}>
          <EditTransaction
            transactionId={modal.transactionId}
            onSubmitCallback={() => setModal(null)}
          />
        </RouteModal>
      )}

      {modal?.type === "delete" && (
        <RouteModal title={t("transactions.delete")} onClose={() => setModal(null)}>
          <DeleteTransaction
            transactionId={modal.transactionId}
            onClose={() => setModal(null)}
          />
        </RouteModal>
      )}
    </>
  );
};

