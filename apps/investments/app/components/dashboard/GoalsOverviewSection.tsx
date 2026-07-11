"use client";

import { ProgressBar, SectionBox } from "@repo/design-system";
import { formatCurrency } from "@repo/i18n";
import type { InvestmentGoal } from "@repo/contracts";
import Link from "next/link";

type GoalsOverviewSectionProps = {
  title: string;
  emptyLabel: string;
  progressLabel: string;
  locale: "pt-BR" | "en-US";
  goals: InvestmentGoal[];
  goalValues: Record<string, number>;
};

export function GoalsOverviewSection({
  title,
  emptyLabel,
  progressLabel,
  locale,
  goals,
  goalValues,
}: GoalsOverviewSectionProps) {
  return (
    <SectionBox title={title} className="goals-section">
      <div className="goals-grid">
        {goals.length ? (
          goals.map((goal) => {
            const current = goalValues[goal.id] ?? 0;
            return (
              <Link
                href={`/investments/goals/${goal.id}`}
                key={goal.id}
                className="goal-card"
              >
                <div className="flex justify-between gap-2">
                  <strong>{goal.name}</strong>
                  <span className="text-sm text-muted">
                    {new Intl.DateTimeFormat(locale).format(
                      new Date(`${goal.targetDate}T00:00:00`),
                    )}
                  </span>
                </div>
                <p className="text-sm text-muted">{goal.category}</p>
                <p className="my-3 font-semibold">
                  {formatCurrency(current, locale)} /{" "}
                  {formatCurrency(goal.targetAmount, locale)}
                </p>
                <ProgressBar
                  value={
                    goal.targetAmount ? (current / goal.targetAmount) * 100 : 0
                  }
                  label={progressLabel}
                />
              </Link>
            );
          })
        ) : (
          <p>{emptyLabel}</p>
        )}
      </div>
    </SectionBox>
  );
}
