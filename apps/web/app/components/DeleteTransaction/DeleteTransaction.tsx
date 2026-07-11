"use client";

import { DialogModal } from "@repo/design-system";
import { useRouter } from "next/navigation";
import { useUserInfo } from "../../hooks/UserInfo.provider";
import { useI18n } from "@repo/i18n/react";

export const DeleteTransaction = ({
  onClose,
  transactionId,
}: {
  onClose?: () => void;
  transactionId: string;
}) => {
  const router = useRouter();
  const { t } = useI18n();
  const handleClose = onClose || (() => router.back());
  const { deleteTransaction, isReady, transactions } = useUserInfo();
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

  const confirmDelete = () => {
    deleteTransaction(transactionId);
    handleClose();
  };

  return (
    <DialogModal
      cancelLabel={t("actions.cancel")}
      confirmLabel={t("actions.delete")}
      onCancel={handleClose}
      onConfirm={confirmDelete}
      text={t("transactions.deleteConfirmation", {
        description: transaction.description || transaction.type,
      })}
    />
  );
};

