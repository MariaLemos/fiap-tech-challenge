import dayjs from "dayjs";
import type { TranslationKey } from "@repo/i18n";

type Translate = (key: TranslationKey) => string;

export const getTransactionTypeOptions = (t: Translate) => [
  { label: t("transactions.type.deposit"), value: "deposit" },
  { label: t("transactions.type.transfer"), value: "transfer" },
  { label: t("transactions.type.withdrawal"), value: "withdrawal" },
];

export const getValidationRules = (t: Translate) => ({
  description: {
    required: t("transactions.validation.descriptionRequired"),
    minLength: {
      value: 3,
      message: t("transactions.validation.descriptionMin"),
    },
    validate: (value: string) =>
      value.trim().length >= 3 ||
      t("transactions.validation.descriptionMin"),
  },
  category: {
    required: t("transactions.validation.categoryRequired"),
    minLength: {
      value: 3,
      message: t("transactions.validation.categoryMin"),
    },
    validate: (value: string) =>
      value.trim().length >= 3 ||
      t("transactions.validation.categoryMin"),
  },
  amount: {
    required: t("transactions.validation.amountRequired"),
    validate: (value: number) => {
      const amount = Number(value);

      if (!Number.isFinite(amount)) return t("transactions.validation.amountInvalid");
      if (amount <= 0) return t("transactions.validation.amountPositive");
      if (amount > 1000000) return t("transactions.validation.amountMaximum");
      return true;
    },
  },
  type: {
    required: t("transactions.validation.typeRequired"),
    validate: (value: string) =>
      ["deposit", "transfer", "withdrawal"].includes(value) ||
      t("transactions.validation.typeInvalid"),
  },
  date: {
    required: t("transactions.validation.dateRequired"),
    validate: (value: string) => {
      if (!value) return t("transactions.validation.dateRequired");
      const date = dayjs(value);
      if (!date.isValid()) return t("transactions.validation.dateInvalid");
      if (date.isAfter(dayjs())) return t("transactions.validation.dateFuture");
      if (date.isBefore(dayjs().subtract(1, "year")))
        return t("transactions.validation.dateOld");
      return true;
    },
  },
});

