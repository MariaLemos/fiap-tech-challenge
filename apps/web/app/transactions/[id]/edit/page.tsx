import { EditTransactionPageClient } from "./EditTransactionPageClient";

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditTransactionPageClient transactionId={id} />;
}


