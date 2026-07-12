"use client";

import { SectionBox, List } from "@repo/design-system";
import { Transaction, useUserInfo } from "../../hooks/UserInfo.provider";
import { useI18n } from "@repo/i18n/react";

export const Statement = () => {
  const { transactions } = useUserInfo();
  const { t } = useI18n();

  return (
    <SectionBox
      title={t("common.statement")}
      className="statement h-[calc(100vh-6rem)] overflow-y-scroll gap-4"
      variant="colored"
    >
      {transactions.length ? (
        <List<Transaction> className="w-full" data={transactions} />
      ) : (
        <p role="status">{t("transactions.noResults")}</p>
      )}
    </SectionBox>
  );
};
