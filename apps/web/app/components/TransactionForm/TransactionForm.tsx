import { Button, InputWrapper } from "@repo/design-system";
import type { Transaction } from "../../hooks/UserInfo.provider";
import { FormProvider } from "react-hook-form";
import {
  transactionTypeOptions,
  validationRules,
} from "./TransactionForm.config";
import { TransactionAttachmentField } from "./TransactionAttachmentField";
import { useTransactionForm } from "./hooks/useTransactionForm";
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
  const {
    attachment,
    attachmentInputRef,
    attachmentSizeLabel,
    formMethods,
    handleAttachmentChange,
    handleAttachmentRemove,
    isSubmitDisabled,
    onSubmit,
    submitLabel,
  } = useTransactionForm({
    transaction,
    initialValues,
    onSubmitCallback,
  });

  return (
    <FormProvider {...formMethods}>
      <form
        className="grid grid-cols-2 gap-4 w-full items-start"
        onSubmit={onSubmit}
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

        <TransactionAttachmentField
          attachment={attachment}
          attachmentInputRef={attachmentInputRef}
          attachmentSizeLabel={attachmentSizeLabel}
          onAttachmentChange={handleAttachmentChange}
          onAttachmentRemove={handleAttachmentRemove}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full self-end"
          disabled={isSubmitDisabled}
        >
          {submitLabel}
        </Button>
      </form>
    </FormProvider>
  );
};


