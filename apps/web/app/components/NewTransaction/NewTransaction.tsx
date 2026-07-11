import { SectionBox } from "@repo/design-system";
import { TransactionForm } from "../TransactionForm/TransactionForm";
import { useI18n } from "@repo/i18n/react";

type TransactionType = "deposit" | "transfer" | "withdrawal";

export const NewTransaction = ({
  initialValues,
  onSubmitCallback,
}: {
  initialValues?: {
    type?: TransactionType;
    amount?: number;
  };
  onSubmitCallback?: () => void;
}) => {
  const { t } = useI18n();
  return (
    <SectionBox
      title={t("transactions.new")}
      variant="bg"
      className="flex flex-col flex-wrap gap-4 bg-accent new-transaction"
    >
      <TransactionForm
        initialValues={initialValues}
        onSubmitCallback={onSubmitCallback}
      />
    </SectionBox>
  );
};

