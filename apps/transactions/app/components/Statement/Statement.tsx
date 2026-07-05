"use client";

import {
  SectionBox,
  List,
  Button,
  useModal,
  useDialogModal,
} from "@repo/design-system";
import { Transaction, useUserInfo } from "../../hooks/UserInfo.provider";
import { TransactionForm } from "../TransactionForm/TransactionForm";

export const Statement = ({
  showAddButton = false,
}: {
  showAddButton?: boolean;
}) => {
  const { transactions, deleteTransaction } = useUserInfo();
  const { openModal, closeModal } = useModal();
  const { openDialogModal } = useDialogModal({
    type: "confirmDelete",
    itemName: "transação",
  });
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
          onClick={() =>
            openModal(TransactionForm, { title: "Nova Transação" })
          }
        >
          Nova Transação
        </Button>
      )}
      <List<Transaction>
        className="w-full"
        data={transactions}
        onEditItem={(transaction) =>
          openModal(TransactionForm, {
            transaction,
            onSubmitCallback: closeModal,
            title: "Editar Transação",
          })
        }
        onDeleteItem={(transaction) =>
          openDialogModal({
            onConfirm: () => deleteTransaction(transaction.id),
          })
        }
      />
    </SectionBox>
  );
};
