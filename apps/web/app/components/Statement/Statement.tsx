"use client";

import {
  SectionBox,
  List,
  Button,
  useModal,
  DialogModal,
  useDialogModal,
} from "@repo/design-system";
import { Transaction, useUserInfo } from "../../hooks/UserInfo.provider";
import { TransactionForm } from "../TransactionForm/TransactionForm";
import { title } from "process";

export const Statement = () => {
  const { transactions, deleteTransaction } = useUserInfo();
  const { openModal, closeModal } = useModal();
  const { openDialogModal } = useDialogModal({
    type: "confirmDelete",
    itemName: "transação",
  });
  return (
    <SectionBox
      title="Extrato"
      className="statement h-[calc(100vh-6rem)] overflow-y-scroll"
      variant="colored"
    >
      <List<Transaction>
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
