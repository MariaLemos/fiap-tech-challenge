"use client";

import { Navigation, SectionBox, useIsMobile } from "@repo/design-system";
import { DeleteTransaction } from "../../../components/DeleteTransaction/DeleteTransaction";
import { useI18n } from "@repo/i18n/react";

export const DeleteTransactionPageClient = ({
  transactionId,
}: {
  transactionId: string;
}) => {
  const isMobile = useIsMobile();
  const { t } = useI18n();

  return (
    <main className="transactions-page gap-4 py-4 h-[calc(100vh-4rem)]">
      {!isMobile && <Navigation />}
      <SectionBox
        title={t("transactions.delete")}
        variant="colored"
        className="statement"
      >
        <DeleteTransaction transactionId={transactionId} />
      </SectionBox>
    </main>
  );
};

