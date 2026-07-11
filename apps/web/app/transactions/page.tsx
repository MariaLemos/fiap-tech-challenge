"use client";

import { Navigation, useIsMobile } from "@repo/design-system";
import { Statement } from "../components/TransactionStatement/Statement";

export default function TransactionsPage() {
  const isMobile = useIsMobile();

  return (
    <main className="transactions-page gap-4 py-4 h-[calc(100vh-4rem)]">
      {!isMobile && <Navigation />}
      <Statement showAddButton />
    </main>
  );
}

