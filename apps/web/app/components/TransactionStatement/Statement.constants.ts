import type { FilterDefinition } from "../Filters/Filters.types";
import type {
  StatementFilterField,
  StatementFilterValues,
} from "./Statement.types";
import type { TranslationKey } from "@repo/i18n";

export const initialStatementFilters: StatementFilterValues = {
  description: "",
  type: "all",
  category: "all",
};

export const getStatementFilterDefinitions = (
  categories: string[],
  t: (key: TranslationKey) => string,
): FilterDefinition<StatementFilterField>[] => {
  const transactionTypeOptions = [
    { label: t("transactions.filters.allTypes"), value: "all" },
    { label: t("transactions.type.income"), value: "deposit" },
    { label: t("transactions.type.withdrawal"), value: "withdrawal" },
    { label: t("transactions.type.transfer"), value: "transfer" },
  ];
  const filters: FilterDefinition<StatementFilterField>[] = [
    {
      label: t("transactions.filters.search"),
      field: "description",
      type: "search",
      placeholder: t("transactions.filters.searchPlaceholder"),
      defaultValue: initialStatementFilters.description,
    },
    {
      label: t("common.type"),
      field: "type",
      type: "select",
      options: transactionTypeOptions,
      defaultValue: initialStatementFilters.type,
    },
  ];

  if (categories.length > 0) {
    filters.push({
      label: t("common.category"),
      field: "category",
      type: "select",
      options: [
        { label: t("transactions.filters.allCategories"), value: "all" },
        ...categories.map((category) => ({
          label: category,
          value: category,
        })),
      ],
      defaultValue: initialStatementFilters.category,
    });
  }

  return filters;
};

