"use client";

import { Navigation, SectionBox, useIsMobile } from "@repo/design-system";
import { EditTransaction } from "../../../components/EditTransaction/EditTransaction";

export const EditTransactionPageClient = ({
  transactionId,
}: {
  transactionId: string;
}) => {
  const isMobile = useIsMobile();

  return (
    <main className="transactions-page gap-4 py-4 h-[calc(100vh-4rem)]">
      {!isMobile && <Navigation />}
      <SectionBox
        title="Editar Transacao"
        variant="colored"
        className="statement"
      >
        <EditTransaction transactionId={transactionId} />
      </SectionBox>
    </main>
  );
};
