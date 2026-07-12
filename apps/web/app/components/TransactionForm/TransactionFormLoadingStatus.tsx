"use client";

import { useI18n } from "@repo/i18n/react";

export function TransactionFormLoadingStatus() {
  const { t } = useI18n();

  return (
    <p role="status" aria-live="polite">
      {t("transactions.form.loading")}
    </p>
  );
}
