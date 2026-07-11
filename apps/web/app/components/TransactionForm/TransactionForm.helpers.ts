import dayjs from "dayjs";
import type { Transaction } from "../../hooks/UserInfo.provider";
import type { TransactionFormData } from "./TransactionForm.types";

export const getTransactionFormDefaultValues = ({
  transaction,
  initialValues,
}: {
  transaction?: Transaction;
  initialValues?: Partial<TransactionFormData>;
}): TransactionFormData => ({
  type: transaction?.type || initialValues?.type || "deposit",
  amount: transaction?.amount || initialValues?.amount || 0,
  description: transaction?.description || initialValues?.description || "",
  category: transaction?.category || initialValues?.category || "",
  date: transaction?.date
    ? dayjs(transaction.date).format("YYYY-MM-DD")
    : initialValues?.date || dayjs().format("YYYY-MM-DD"),
  attachment: transaction?.attachment || initialValues?.attachment || null,
});

export const formatFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

export const getAttachmentMetadata = (file: File) => ({
  name: file.name,
  size: file.size,
  type: file.type || "application/octet-stream",
});

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


