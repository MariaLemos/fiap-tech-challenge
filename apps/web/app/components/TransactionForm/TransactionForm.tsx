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
        className="grid grid-cols-2 gap-4 w-full items-end"
        onSubmit={formMethods.handleSubmit(onSubmit)}
      >
        <InputWrapper label="Data" name="date" type="date" className="w-full" />
        <InputWrapper
          label="Tipo"
          name="type"
          type="select"
          className="w-full"
          options={categories}
        />
        <InputWrapper
          label="Valor"
          name="amount"
          type="number"
          mask="money"
          className="w-full"
        />

        <Button type="submit" value="primary" className="">
          Concluir transacao
        </Button>
      </form>
    </FormProvider>
  );
};
