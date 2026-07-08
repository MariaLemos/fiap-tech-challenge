"use client";

import { DialogModal } from "@repo/design-system";
import { useRouter } from "next/navigation";
import { useUserInfo } from "../../hooks/UserInfo.provider";

export const DeleteTransaction = ({
  transactionId,
}: {
  transactionId: string;
}) => {
  const router = useRouter();
  const { deleteTransaction, isReady, transactions } = useUserInfo();
  const transaction = transactions.find(({ id }) => id === transactionId);

  if (!isReady) {
    return null;
  }

  if (!transaction) {
    return (
      <div className="rounded-lg border border-dashed border-primary p-6 text-center text-muted">
        Transacao não encontrada.
      </div>
    );
  }

  const confirmDelete = () => {
    deleteTransaction(transactionId);
    router.back();
  };

  return (
    <DialogModal
      cancelLabel="Cancelar"
      confirmLabel="Excluir"
      onCancel={() => router.back()}
      onConfirm={confirmDelete}
      text={`Tem certeza que deseja excluir a transacao ${
        transaction.description || transaction.type
      }?`}
    />
  );
};
