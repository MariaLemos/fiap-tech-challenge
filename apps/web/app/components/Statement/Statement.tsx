"use client";

import { SectionBox, List, Button } from "@repo/design-system";
import { Transaction, useUserInfo } from "../../hooks/UserInfo.provider";

export const Statement = () => {
  const { transactions } = useUserInfo();
  return (
    <SectionBox
      title="Extrato"
      className="statement h-[calc(100vh-6rem)] overflow-overlay"
      variant="colored"
    >
      <Button variant="icon" className="mb-4">
        Button
      </Button>
      <List<Transaction> data={transactions} />
    </SectionBox>
  );
};
