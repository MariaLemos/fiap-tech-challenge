import type { TransactionFormData } from "./TransactionForm.types";

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const categorySuggestions = [
  {
    category: "Alimentacao",
    keywords: ["mercado", "supermercado"],
  },
  {
    category: "Transporte",
    keywords: ["uber", "99", "onibus"],
  },
  {
    category: "Receita",
    keywords: ["salario", "freela"],
  },
  {
    category: "Moradia",
    keywords: ["aluguel", "condominio"],
  },
];

export const getSuggestedCategory = ({
  description,
  type,
}: Pick<TransactionFormData, "description" | "type">) => {
  const normalizedDescription = normalizeText(description);
  const suggestion = categorySuggestions.find(({ keywords }) =>
    keywords.some((keyword) => normalizedDescription.includes(keyword)),
  );

  if (suggestion) {
    return suggestion.category;
  }

  if (type === "deposit") {
    return "Receita";
  }

  if (type === "transfer") {
    return "Transferencia";
  }

  return "";
};
