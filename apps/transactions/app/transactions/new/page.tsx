import { Suspense } from "react";
import { NewTransactionPageClient } from "./NewTransactionPageClient";

export default function NewTransactionPage() {
  return (
    <Suspense fallback={null}>
      <NewTransactionPageClient />
    </Suspense>
  );
}
