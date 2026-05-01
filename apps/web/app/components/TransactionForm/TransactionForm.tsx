import { Button, InputWrapper, SectionBox, Select } from "@repo/design-system";
import { Transaction, useUserInfo } from "../../hooks/UserInfo.provider";
import { FormProvider, useForm } from "react-hook-form";
const categories = [
  { label: "Deposito", value: "deposit" },
  { label: "Transferencia", value: "transfer" },
  { label: "Retirada", value: "withdrawal" },
];

export const TransactionForm = ({
  transaction,
  onSubmitCallback,
}: {
  transaction?: Transaction;
  onSubmitCallback?: () => void;
}) => {
  const { addTransaction, updateTransaction } = useUserInfo();
  const formMethods = useForm<Transaction>({
    defaultValues: {
      type: transaction?.type || "deposit",
      amount: transaction?.amount || 0,
    },
    mode: "onChange",
  });
  const onSubmit = (data: Transaction) => {
    if (transaction) {
      updateTransaction(transaction.id, { ...transaction, ...data });
    } else {
      addTransaction(data);
    }
    if (onSubmitCallback) {
      onSubmitCallback();
    }
  };
  return (
    <FormProvider {...formMethods}>
      <form
        className="flex flex-wrap gap-4"
        onSubmit={formMethods.handleSubmit(onSubmit)}
      >
        <InputWrapper
          label="Tipo"
          name="type"
          type="select"
          options={categories}
        />
        <InputWrapper label="Valor" name="amount" type="number" mask="money" />

        <Button type="submit" className="">
          Concluir transacao
        </Button>
      </form>
    </FormProvider>
  );
};
