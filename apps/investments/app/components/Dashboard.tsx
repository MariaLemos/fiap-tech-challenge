"use client";

import {
  Navigation,
  PieChartComponent,
  ProgressBar,
  SectionBox,
  Typography,
  useIsMobile,
} from "@repo/design-system";
import { formatCurrency } from "@repo/i18n";
import { useI18n } from "@repo/i18n/react";
import Link from "next/link";
import { useInvestments } from "../hooks/Investments.provider";

const linkClass =
  "inline-flex h-10 items-center rounded-full border-2 border-primary bg-primary px-3 font-semibold text-white";

export function Dashboard() {
  const isMobile = useIsMobile();
  const { locale, t } = useI18n();
  const { goals, investments, getGoalValue, getInvestmentValue, isReady } =
    useInvestments();
  if (!isReady) return null;
  const totalPlanned = goals.reduce(
    (total, goal) => total + goal.targetAmount,
    0,
  );
  const totalCurrent = investments.reduce(
    (total, investment) => total + getInvestmentValue(investment),
    0,
  );
  const goalCurrent = goals.reduce(
    (total, goal) => total + getGoalValue(goal.id),
    0,
  );
  const onTrack = goals.filter(
    (goal) =>
      new Date(goal.targetDate) >= new Date() ||
      getGoalValue(goal.id) >= goal.targetAmount,
  ).length;
  const allocation = investments.reduce<Record<string, number>>(
    (result, investment) => ({
      ...result,
      [investment.assetClass]:
        (result[investment.assetClass] ?? 0) + getInvestmentValue(investment),
    }),
    {},
  );
  const unassigned = investments.filter((item) => !item.goalId);
  return (
    <main className="investments-page">
      {!isMobile && <Navigation />}
      <div className="dashboard-content">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Typography variant="h1">
              {t("investments.dashboard.title")}
            </Typography>
            <p className="text-muted">{t("investments.dashboard.subtitle")}</p>
          </div>
          <Link className={linkClass} href="/investments/goals/new">
            {t("investments.goals.new")}
          </Link>
        </header>
        <section className="metrics-grid">
          <Metric
            label={t("investments.metrics.progress")}
            value={`${totalPlanned ? Math.round((goalCurrent / totalPlanned) * 100) : 0}%`}
          />
          <Metric
            label={t("investments.metrics.current")}
            value={formatCurrency(totalCurrent, locale)}
          />
          <Metric
            label={t("investments.metrics.planned")}
            value={formatCurrency(totalPlanned, locale)}
          />
          <Metric
            label={t("investments.metrics.onTrack")}
            value={`${onTrack}/${goals.length}`}
          />
        </section>
        <ProgressBar
          value={totalPlanned ? (goalCurrent / totalPlanned) * 100 : 0}
          label={t("investments.metrics.overallProgress")}
        />
        <div className="dashboard-grid">
          <SectionBox
            title={t("investments.goals.title")}
            className="goals-section"
          >
            <div className="goals-grid">
              {goals.length ? (
                goals.map((goal) => {
                  const current = getGoalValue(goal.id);
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
                          goal.targetAmount
                            ? (current / goal.targetAmount) * 100
                            : 0
                        }
                        label={t("investments.goals.progress")}
                      />
                    </Link>
                  );
                })
              ) : (
                <p>{t("investments.goals.empty")}</p>
              )}
            </div>
          </SectionBox>
          <SectionBox title={t("investments.allocation.title")}>
            <PieChartComponent
              data={Object.entries(allocation).map(([name, value]) => ({
                name,
                value,
              }))}
            />
          </SectionBox>
        </div>
        <SectionBox
          title={t("investments.unassigned")}
          headerAction={
            <Link className={linkClass} href="/investments/investments/new">
              {t("investments.assets.new")}
            </Link>
          }
        >
          <div className="grid gap-2">
            {unassigned.length ? (
              unassigned.map((investment) => (
                <div
                  key={investment.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <strong>{investment.name}</strong>
                    <p className="text-sm text-muted">
                      {investment.assetClass}
                    </p>
                  </div>
                  <span>
                    {formatCurrency(getInvestmentValue(investment), locale)}
                  </span>
                </div>
              ))
            ) : (
              <p>{t("investments.assets.emptyUnassigned")}</p>
            )}
          </div>
        </SectionBox>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <SectionBox className="metric-card">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold text-primary">{value}</p>
    </SectionBox>
  );
}
