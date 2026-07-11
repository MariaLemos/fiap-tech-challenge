import { DeleteTransactionPageClient } from "./DeleteTransactionPageClient";

export default async function DeleteTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <DeleteTransactionPageClient transactionId={id} />;
}


