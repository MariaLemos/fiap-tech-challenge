"use client";

import { Button, InputWrapper, SectionBox } from "@repo/design-system";
import { FormProvider, useForm } from "react-hook-form";

type TransactionType = "deposit" | "transfer" | "withdrawal";

type QuickTransactionStartForm = {
  type: TransactionType;
  amount: string;
};

const transactionTypes = [
  { label: "Deposito", value: "deposit" },
  { label: "Transferencia", value: "transfer" },
  { label: "Retirada", value: "withdrawal" },
] satisfies { label: string; value: TransactionType }[];

export const QuickTransactionStart = () => {
  const formMethods = useForm<QuickTransactionStartForm>({
    defaultValues: {
      type: "deposit",
      amount: "",
    },
  });

  const handleSubmit = ({ type, amount }: QuickTransactionStartForm) => {
    const params = new URLSearchParams({ type });

    if (amount.trim()) {
      params.set("amount", amount);
    }

    window.location.assign(`/transactions/new?${params.toString()}`);
  };

  return (
    <SectionBox
      title="Nova transacao"
      variant="bg"
      className="flex flex-col flex-wrap gap-4 bg-accent new-transaction"
    >
      <FormProvider {...formMethods}>
        <form
          className="grid grid-cols-1 gap-4 w-full items-end sm:grid-cols-2"
          onSubmit={formMethods.handleSubmit(handleSubmit)}
        >
          <InputWrapper
            label="Tipo"
            name="type"
            type="select"
            options={transactionTypes}
            className="w-full"
          />

          <InputWrapper
            label="Valor"
            name="amount"
            type="number"
            mask="money"
            className="w-full"
            placeholder="R$ 0,00"
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full sm:col-span-2"
          >
            Continuar
          </Button>
        </form>
      </FormProvider>
    </SectionBox>
  );
};
