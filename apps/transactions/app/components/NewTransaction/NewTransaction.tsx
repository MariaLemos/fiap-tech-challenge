import { SectionBox } from "@repo/design-system";
import { TransactionForm } from "../TransactionForm/TransactionForm";

type TransactionType = "deposit" | "transfer" | "withdrawal";

export const NewTransaction = ({
  initialValues,
}: {
  initialValues?: {
    type?: TransactionType;
    amount?: number;
  };
}) => {
  return (
    <SectionBox
      title="Nova transacao"
      variant="bg"
      className="flex flex-col flex-wrap gap-4 bg-accent new-transaction"
    >
      <TransactionForm initialValues={initialValues} />
    </SectionBox>
  );
};
