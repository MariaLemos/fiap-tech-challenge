import { Suspense } from "react";
import { NewTransactionPageClient } from "./NewTransactionPageClient";

export default function NewTransactionPage() {
  return (
    <Suspense fallback={<p role="status" aria-live="polite">Carregando formulário de transação...</p>}>
      <NewTransactionPageClient />
    </Suspense>
  );
}


