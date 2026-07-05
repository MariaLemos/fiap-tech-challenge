import { SectionBox } from "@repo/design-system";
import { TransactionForm } from "../TransactionForm/TransactionForm";

export const NewTransaction = () => {
  return (
    <SectionBox
      title="Nova transação"
      variant="bg"
      className="flex flex-col flex-wrap gap-4 bg-accent new-transaction"
    >
      <TransactionForm />
    </SectionBox>
  );
};
