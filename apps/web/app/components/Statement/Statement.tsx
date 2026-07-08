"use client";

import { SectionBox, List } from "@repo/design-system";
import { Transaction, useUserInfo } from "../../hooks/UserInfo.provider";

export const Statement = () => {
  const { transactions } = useUserInfo();

  return (
    <SectionBox
      title="Extrato"
      className="statement h-[calc(100vh-6rem)] overflow-y-scroll gap-4"
      variant="colored"
    >
      <List<Transaction> className="w-full" data={transactions} />
    </SectionBox>
  );
};
