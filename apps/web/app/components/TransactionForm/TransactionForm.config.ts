import dayjs from "dayjs";

export const transactionTypeOptions = [
  { label: "Deposito", value: "deposit" },
  { label: "Transferencia", value: "transfer" },
  { label: "Retirada", value: "withdrawal" },
];

export const validationRules = {
  description: {
    required: "A descricao e obrigatoria",
    minLength: {
      value: 3,
      message: "A descricao deve ter pelo menos 3 caracteres",
    },
    validate: (value: string) =>
      value.trim().length >= 3 ||
      "Informe uma descricao com pelo menos 3 caracteres",
  },
  category: {
    required: "A categoria e obrigatoria",
    minLength: {
      value: 3,
      message: "A categoria deve ter pelo menos 3 caracteres",
    },
    validate: (value: string) =>
      value.trim().length >= 3 ||
      "Informe uma categoria com pelo menos 3 caracteres",
  },
  amount: {
    required: "O valor e obrigatorio",
    validate: (value: number) => {
      const amount = Number(value);

      if (!Number.isFinite(amount)) return "Digite um valor numerico valido";
      if (amount <= 0) return "O valor deve ser maior que zero";
      if (amount > 1000000) return "Valor maximo de R$ 1.000.000,00";
      return true;
    },
  },
  type: {
    required: "O tipo de transacao e obrigatorio",
    validate: (value: string) =>
      ["deposit", "transfer", "withdrawal"].includes(value) ||
      "Selecione um tipo de transacao valido",
  },
  date: {
    required: "A data e obrigatoria",
    validate: (value: string) => {
      if (!value) return "A data e obrigatoria";
      const date = dayjs(value);
      if (!date.isValid()) return "Data invalida";
      if (date.isAfter(dayjs())) return "A data nao pode ser futura";
      if (date.isBefore(dayjs().subtract(1, "year")))
        return "Data nao pode ser anterior a 1 ano";
      return true;
    },
  },
};


