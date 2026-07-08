import { Button, InputWrapper } from "@repo/design-system";
import { useUserInfo } from "../../hooks/UserInfo.provider";
import type { Transaction } from "../../hooks/UserInfo.provider";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import {
  transactionTypeOptions,
  validationRules,
} from "./TransactionForm.config";
import { getSuggestedCategory } from "./TransactionForm.helpers";
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
  const { addTransaction, updateTransaction } = useUserInfo();

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
    reset,
  } = formMethods;
  const { getValues, setValue, watch } = formMethods;
  const description = watch("description");
  const type = watch("type");
  const lastSuggestedCategory = useRef("");

  useEffect(() => {
    const suggestedCategory = getSuggestedCategory({
      description: description || "",
      type,
    });

    if (!suggestedCategory) {
      return;
    }

    const currentCategory = getValues("category").trim();
    const shouldApplySuggestion =
      !currentCategory || currentCategory === lastSuggestedCategory.current;

    if (shouldApplySuggestion && currentCategory !== suggestedCategory) {
      setValue("category", suggestedCategory, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }

    lastSuggestedCategory.current = suggestedCategory;
  }, [description, getValues, setValue, type]);

  const onSubmit = async (data: TransactionFormData) => {
    try {
      const transactionData: Omit<Transaction, "id"> = {
        ...data,
        amount: Number(data.amount),
        date: dayjs(data.date),
      };

      if (transaction) {
        updateTransaction(transaction.id, transactionData);
      } else {
        addTransaction(transactionData);
      }

      if (!transaction) {
        reset({
          type: "deposit",
          amount: 0,
          description: "",
          category: "",
          date: dayjs().format("YYYY-MM-DD"),
        });
      }

      if (onSubmitCallback) {
        onSubmitCallback();
      }
    } catch (err) {
      console.error("Erro ao processar transacao:", err);
    }
  };

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
