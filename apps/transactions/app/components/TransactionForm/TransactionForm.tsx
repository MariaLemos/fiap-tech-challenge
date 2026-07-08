import { Button, InputWrapper } from "@repo/design-system";
import type { Transaction } from "../../hooks/UserInfo.provider";
import { FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";
import {
  transactionTypeOptions,
  validationRules,
} from "./TransactionForm.config";
import { useTransactionCategorySuggestion } from "./hooks/useTransactionCategorySuggestion";
import { useTransactionFormSubmit } from "./hooks/useTransactionFormSubmit";
import type { TransactionFormData } from "./TransactionForm.types";

export const TransactionForm = ({
  transaction,
  initialValues,
  onSubmitCallback,
}: {
  transaction?: Transaction;
  initialValues?: Partial<TransactionFormData>;
  onSubmitCallback?: () => void;
}) => {
  const formMethods = useForm<TransactionFormData>({
    defaultValues: {
      type: transaction?.type || initialValues?.type || "deposit",
      amount: transaction?.amount || initialValues?.amount || 0,
      description: transaction?.description || initialValues?.description || "",
      category: transaction?.category || initialValues?.category || "",
      date:
        dayjs(transaction?.date).format("YYYY-MM-DD") ||
        initialValues?.date ||
        dayjs().format("YYYY-MM-DD"),
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = formMethods;
  useTransactionCategorySuggestion(formMethods);
  const onSubmit = useTransactionFormSubmit({
    formMethods,
    onSubmitCallback,
    transaction,
  });

  return (
    <FormProvider {...formMethods}>
      <form
        className="grid grid-cols-2 gap-4 w-full items-start"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <InputWrapper
          label="Data"
          name="date"
          type="date"
          className="w-full"
          required
          rules={validationRules.date}
        />

        <InputWrapper
          label="Descricao"
          name="description"
          type="text"
          className="w-full"
          required
          rules={validationRules.description}
          placeholder="Ex: Salario"
        />

        <InputWrapper
          label="Tipo"
          name="type"
          type="select"
          className="w-full"
          options={transactionTypeOptions}
          required
          rules={validationRules.type}
        />

        <InputWrapper
          label="Categoria"
          name="category"
          type="text"
          className="w-full"
          required
          rules={validationRules.category}
          placeholder="Ex: Alimentacao"
        />

        <InputWrapper
          label="Valor"
          name="amount"
          type="number"
          mask="money"
          className="w-full"
          required
          rules={validationRules.amount}
          placeholder="R$ 0,00"
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full self-end"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting
            ? "Processando..."
            : transaction
              ? "Atualizar"
              : "Adicionar"}
        </Button>
      </form>
    </FormProvider>
  );
};
