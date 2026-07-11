"use client";

import { Button, InputWrapper, SectionBox } from "@repo/design-system";
import { FormProvider, useForm } from "react-hook-form";
import { useI18n } from "@repo/i18n/react";

type TransactionType = "deposit" | "transfer" | "withdrawal";

type QuickTransactionStartForm = {
  type: TransactionType;
  amount: string;
};

export const QuickTransactionStart = () => {
  const { t } = useI18n();
  const transactionTypes = [
    { label: t("transactions.type.deposit"), value: "deposit" },
    { label: t("transactions.type.transfer"), value: "transfer" },
    { label: t("transactions.type.withdrawal"), value: "withdrawal" },
  ] satisfies { label: string; value: TransactionType }[];
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
      title={t("transactions.new")}
      variant="bg"
      className="flex flex-col flex-wrap gap-4 bg-accent new-transaction"
    >
      <FormProvider {...formMethods}>
        <form
          className="grid grid-cols-1 gap-4 w-full items-end sm:grid-cols-2"
          onSubmit={formMethods.handleSubmit(handleSubmit)}
        >
          <InputWrapper
            label={t("common.type")}
            name="type"
            type="select"
            options={transactionTypes}
            className="w-full"
          />

          <InputWrapper
            label={t("common.value")}
            name="amount"
            type="number"
            mask="money"
            className="w-full"
            placeholder={t("transactions.form.amountPlaceholder")}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full sm:col-span-2"
          >
            {t("actions.continue")}
          </Button>
        </form>
      </FormProvider>
    </SectionBox>
  );
};
