import { Button, InputWrapper, SectionBox, Select } from "@repo/design-system";
import { Transaction, useUserInfo } from "../../hooks/UserInfo.provider";
import { FormProvider, useForm } from "react-hook-form";
const categories = [
  { label: "Deposito", value: "deposit" },
  { label: "Transferencia", value: "transfer" },
  { label: "Retirada", value: "withdrawal" },
];

export const NewTransaction = () => {
  const { addTransaction } = useUserInfo();
  const formMethods = useForm<Transaction>({
    defaultValues: {
      type: "deposit",
      amount: 0,
    },
    mode: "onChange",
  });
  return (
    <SectionBox
      title="Nova transação"
      variant="bg"
      className="flex flex-wrap gap-4 bg-accent new-transaction"
    >
      <FormProvider {...formMethods}>
        <form
          className="flex flex-wrap gap-4"
          onSubmit={formMethods.handleSubmit(addTransaction)}
        >
          <InputWrapper
            label="Tipo"
            name="type"
            type="select"
            options={categories}
          />
          <InputWrapper
            label="Valor"
            name="amount"
            type="number"
            mask="money"
          />

          <Button type="submit" className="">
            Concluir transacao
          </Button>
        </form>
      </FormProvider>
    </SectionBox>
  );
};
