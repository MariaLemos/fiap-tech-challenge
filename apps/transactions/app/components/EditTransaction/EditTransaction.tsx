"use client";

import { useRouter } from "next/navigation";
import { useUserInfo } from "../../hooks/UserInfo.provider";
import { TransactionForm } from "../TransactionForm/TransactionForm";

export const EditTransaction = ({ transactionId }: { transactionId: string }) => {
  const router = useRouter();
  const { isReady, transactions } = useUserInfo();
  const transaction = transactions.find(({ id }) => id === transactionId);

  if (!isReady) {
    return null;
  }

  if (!transaction) {
    return (
      <div className="rounded-lg border border-dashed border-primary p-6 text-center text-muted">
        Transacao nao encontrada.
      </div>
    );
  }

  return (
    <TransactionForm
      transaction={transaction}
      onSubmitCallback={() => router.back()}
    />
  );
};
