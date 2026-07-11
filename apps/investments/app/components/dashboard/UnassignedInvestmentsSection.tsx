"use client";

import { SectionBox } from "@repo/design-system";
import { formatCurrency } from "@repo/i18n";
import type { Investment } from "@repo/contracts";
import Link from "next/link";

type UnassignedInvestmentsSectionProps = {
  title: string;
  newAssetLabel: string;
  emptyLabel: string;
  locale: "pt-BR" | "en-US";
  linkClassName: string;
  investments: Investment[];
  investmentValues: Record<string, number>;
};

export function UnassignedInvestmentsSection({
  title,
  newAssetLabel,
  emptyLabel,
  locale,
  linkClassName,
  investments,
  investmentValues,
}: UnassignedInvestmentsSectionProps) {
  return (
    <SectionBox
      title={title}
      headerAction={
        <Link className={linkClassName} href="/investments/investments/new">
          {newAssetLabel}
        </Link>
      }
    >
      <div className="grid gap-2">
        {investments.length ? (
          investments.map((investment) => (
            <div
              key={investment.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <strong>{investment.name}</strong>
                <p className="text-sm text-muted">{investment.assetClass}</p>
              </div>
              <span>
                {formatCurrency(investmentValues[investment.id] ?? 0, locale)}
              </span>
            </div>
          ))
        ) : (
          <p>{emptyLabel}</p>
        )}
      </div>
    </SectionBox>
  );
}
