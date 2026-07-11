import { useCallback, useEffect, useMemo, useRef, type ChangeEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { Transaction } from "../../../hooks/UserInfo.provider";
import {
  formatFileSize,
  getAttachmentMetadata,
  getTransactionFormDefaultValues,
} from "../TransactionForm.helpers";
import type { TransactionFormData } from "../TransactionForm.types";
import { useTransactionCategorySuggestion } from "./useTransactionCategorySuggestion";
import { useTransactionFormSubmit } from "./useTransactionFormSubmit";

export const useTransactionForm = ({
  transaction,
  initialValues,
  onSubmitCallback,
}: {
  transaction?: Transaction;
  initialValues?: Partial<TransactionFormData>;
  onSubmitCallback?: () => void;
}) => {
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);
  const defaultValues = useMemo(
    () => getTransactionFormDefaultValues({ transaction, initialValues }),
    [initialValues, transaction],
  );
  const formMethods = useForm<TransactionFormData>({
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
    control,
    setValue,
  } = formMethods;
  const attachment = useWatch({ control, name: "attachment" });
  const onSubmit = useTransactionFormSubmit({
    formMethods,
    onSubmitCallback,
    transaction,
  });

  useTransactionCategorySuggestion(formMethods);

  useEffect(() => {
    if (!attachment && attachmentInputRef.current) {
      attachmentInputRef.current.value = "";
    }
  }, [attachment]);

  const handleAttachmentChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      setValue("attachment", getAttachmentMetadata(file), {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const handleAttachmentRemove = useCallback(() => {
    setValue("attachment", null, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = "";
    }
  }, [setValue]);

  const attachmentSizeLabel = useMemo(
    () => (attachment ? formatFileSize(attachment.size) : ""),
    [attachment],
  );

  const submitLabel = useMemo(() => {
    if (isSubmitting) {
      return "Processando...";
    }

    return transaction ? "Atualizar" : "Adicionar";
  }, [isSubmitting, transaction]);

  const submitHandler = useMemo(
    () => handleSubmit(onSubmit),
    [handleSubmit, onSubmit],
  );

  return {
    attachment,
    attachmentInputRef,
    attachmentSizeLabel,
    formMethods,
    handleAttachmentChange,
    handleAttachmentRemove,
    isSubmitDisabled: isSubmitting || !isValid,
    onSubmit: submitHandler,
    submitLabel,
  };
};


