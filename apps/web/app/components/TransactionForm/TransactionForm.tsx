import { Button, InputWrapper } from "@repo/design-system";
import type { Transaction } from "../../hooks/UserInfo.provider";
import { FormProvider } from "react-hook-form";
import {
  getTransactionTypeOptions,
  getValidationRules,
} from "./TransactionForm.config";
import { TransactionAttachmentField } from "./TransactionAttachmentField";
import { useTransactionForm } from "./hooks/useTransactionForm";
import type { TransactionFormData } from "./TransactionForm.types";
import { useI18n } from "@repo/i18n/react";

export const TransactionForm = ({
  transaction,
  initialValues,
  onSubmitCallback,
}: {
  transaction?: Transaction;
  initialValues?: Partial<TransactionFormData>;
  onSubmitCallback?: () => void;
}) => {
  const { t } = useI18n();
  const transactionTypeOptions = getTransactionTypeOptions(t);
  const validationRules = getValidationRules(t);
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
          label={t("common.date")}
          name="date"
          type="date"
          className="w-full"
          required
          rules={validationRules.date}
        />

        <InputWrapper
          label={t("common.description")}
          name="description"
          type="text"
          className="w-full"
          required
          rules={validationRules.description}
          placeholder={t("transactions.form.descriptionPlaceholder")}
        />

        <InputWrapper
          label={t("common.type")}
          name="type"
          type="select"
          className="w-full"
          options={transactionTypeOptions}
          required
          rules={validationRules.type}
        />

        <InputWrapper
          label={t("common.category")}
          name="category"
          type="text"
          className="w-full"
          required
          rules={validationRules.category}
          placeholder={t("transactions.form.categoryPlaceholder")}
        />

        <InputWrapper
          label={t("common.value")}
          name="amount"
          type="number"
          mask="money"
          className="w-full"
          required
          rules={validationRules.amount}
          placeholder={t("transactions.form.amountPlaceholder")}
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

