import type { FilterDefinition } from "../Filters/Filters.types";
import type {
  StatementFilterField,
  StatementFilterValues,
} from "./Statement.types";

export const initialStatementFilters: StatementFilterValues = {
  description: "",
  type: "all",
  category: "all",
};

const transactionTypeOptions = [
  { label: "Todos os tipos", value: "all" },
  { label: "Entrada", value: "deposit" },
  { label: "Saida", value: "withdrawal" },
  { label: "Transferencia", value: "transfer" },
] satisfies FilterDefinition<StatementFilterField>["options"];

export const getStatementFilterDefinitions = (
  categories: string[],
): FilterDefinition<StatementFilterField>[] => {
  const filters: FilterDefinition<StatementFilterField>[] = [
    {
      label: "Buscar por descricao",
      field: "description",
      type: "search",
      placeholder: "Ex: mercado",
      defaultValue: initialStatementFilters.description,
    },
    {
      label: "Tipo",
      field: "type",
      type: "select",
      options: transactionTypeOptions,
      defaultValue: initialStatementFilters.type,
    },
  ];

  if (categories.length > 0) {
    filters.push({
      label: "Categoria",
      field: "category",
      type: "select",
      options: [
        { label: "Todas", value: "all" },
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
