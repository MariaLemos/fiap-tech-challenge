import { DeleteTransaction } from "../../../../components/DeleteTransaction/DeleteTransaction";
import { RouteModal } from "../../../../components/RouteModal/RouteModal";

export default async function DeleteTransactionModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <RouteModal titleKey="transactions.delete">
      <DeleteTransaction transactionId={id} />
    </RouteModal>
  );
}

