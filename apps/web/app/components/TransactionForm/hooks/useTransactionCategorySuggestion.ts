import { useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import { getSuggestedCategory } from "../TransactionForm.helpers";
import type { TransactionFormData } from "../TransactionForm.types";

export const useTransactionCategorySuggestion = (
  formMethods: UseFormReturn<TransactionFormData>,
) => {
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
};


