"use client";

import { Statement } from "../components/TransactionStatement/Statement";

export default function TransactionsPage() {
  return (
    <main className="transactions-page gap-4 py-4 h-[calc(100vh-4rem)]">
      <Statement showAddButton />
    </main>
  );
}

