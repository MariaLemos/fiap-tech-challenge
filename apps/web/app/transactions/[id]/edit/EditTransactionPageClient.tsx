"use client";

import { SectionBox } from "@repo/design-system";
import { EditTransaction } from "../../../components/EditTransaction/EditTransaction";
import { useI18n } from "@repo/i18n/react";

export const EditTransactionPageClient = ({
  transactionId,
}: {
  transactionId: string;
}) => {
  const { t } = useI18n();

  return (
    <main className="transactions-page gap-4 py-4 h-[calc(100vh-4rem)]">
      <SectionBox
        title={t("transactions.edit")}
        variant="colored"
        className="statement"
      >
        <EditTransaction transactionId={transactionId} />
      </SectionBox>
    </main>
  );
};

