import { Suspense } from "react";
import { NewTransactionPageClient } from "./NewTransactionPageClient";
import { TransactionFormLoadingStatus } from "../../components/TransactionForm/TransactionFormLoadingStatus";

export default function NewTransactionPage() {
  return (
    <Suspense fallback={<TransactionFormLoadingStatus />}>
      <NewTransactionPageClient />
    </Suspense>
  );
}


