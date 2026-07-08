"use client";

import { Navigation, SectionBox, useIsMobile } from "@repo/design-system";
import { DeleteTransaction } from "../../../components/DeleteTransaction/DeleteTransaction";

export const DeleteTransactionPageClient = ({
  transactionId,
}: {
  transactionId: string;
}) => {
  const isMobile = useIsMobile();

  return (
    <main className="transactions-page gap-4 py-4 h-[calc(100vh-4rem)]">
      {!isMobile && <Navigation />}
      <SectionBox
        title="Excluir Transacao"
        variant="colored"
        className="statement"
      >
        <DeleteTransaction transactionId={transactionId} />
      </SectionBox>
    </main>
  );
};
