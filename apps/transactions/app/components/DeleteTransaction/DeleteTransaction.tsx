"use client";

import { Button } from "@repo/design-system";
import { useRouter } from "next/navigation";
import { useUserInfo } from "../../hooks/UserInfo.provider";

export const DeleteTransaction = ({
  transactionId,
}: {
  transactionId: string;
}) => {
  const router = useRouter();
  const { deleteTransaction, transactions } = useUserInfo();
  const transaction = transactions.find(({ id }) => id === transactionId);

  if (!transaction) {
    return (
      <div className="rounded-lg border border-dashed border-primary p-6 text-center text-muted">
        Transacao nao encontrada.
      </div>
    );
  }

  const confirmDelete = () => {
    deleteTransaction(transactionId);
    router.back();
  };

  return (
    <div className="flex flex-col gap-4">
      <p>
        Tem certeza que deseja excluir a transacao{" "}
        <strong>{transaction.description || transaction.type}</strong>?
      </p>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="button" variant="primary" onClick={confirmDelete}>
          Excluir
        </Button>
      </div>
    </div>
  );
};
