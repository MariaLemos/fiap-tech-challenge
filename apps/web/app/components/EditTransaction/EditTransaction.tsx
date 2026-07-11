"use client";

import { useRouter } from "next/navigation";
import { useUserInfo } from "../../hooks/UserInfo.provider";
import { TransactionForm } from "../TransactionForm/TransactionForm";
import { useI18n } from "@repo/i18n/react";

export const EditTransaction = ({
  onSubmitCallback,
  transactionId,
}: {
  onSubmitCallback?: () => void;
  transactionId: string;
}) => {
  const router = useRouter();
  const { t } = useI18n();
  const { isReady, transactions } = useUserInfo();
  const transaction = transactions.find(({ id }) => id === transactionId);

  if (!isReady) {
    return null;
  }

  if (!transaction) {
    return (
      <div className="rounded-lg border border-dashed border-primary p-6 text-center text-muted">
        {t("transactions.notFound")}
      </div>
    );
  }

  return (
    <TransactionForm
      transaction={transaction}
      onSubmitCallback={onSubmitCallback || (() => router.back())}
    />
  );
};

