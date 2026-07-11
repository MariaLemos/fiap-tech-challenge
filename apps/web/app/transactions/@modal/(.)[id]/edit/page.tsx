import { EditTransaction } from "../../../../components/EditTransaction/EditTransaction";
import { RouteModal } from "../../../../components/RouteModal/RouteModal";

export default async function EditTransactionModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <RouteModal titleKey="transactions.edit">
      <EditTransaction transactionId={id} />
    </RouteModal>
  );
}

