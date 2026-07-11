"use client";

import { Navigation, ProgressBar, useIsMobile } from "@repo/design-system";
import { AllocationSection } from "./dashboard/AllocationSection";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardMetrics } from "./dashboard/DashboardMetrics";
import { GoalsOverviewSection } from "./dashboard/GoalsOverviewSection";
import { UnassignedInvestmentsSection } from "./dashboard/UnassignedInvestmentsSection";
import { useI18n } from "@repo/i18n/react";
import { useAppSelector } from "../store/hooks";
import {
  selectAllocationByAssetClass,
  selectGoalValuesMap,
  selectGoals,
  selectHydrated,
  selectInvestmentValuesMap,
  selectPortfolioTotal,
  selectUnassignedInvestments,
} from "../store/investments/investmentsSelectors";

const linkClass =
  "inline-flex h-10 items-center rounded-full border-2 border-primary bg-primary px-3 font-semibold text-white";

export function Dashboard() {
  const isMobile = useIsMobile();
  const { locale, t } = useI18n();
  const goals = useAppSelector(selectGoals);
  const totalCurrent = useAppSelector(selectPortfolioTotal);
  const allocation = useAppSelector(selectAllocationByAssetClass);
  const unassigned = useAppSelector(selectUnassignedInvestments);
  const goalValues = useAppSelector(selectGoalValuesMap);
  const investmentValues = useAppSelector(selectInvestmentValuesMap);
  const hydrated = useAppSelector(selectHydrated);

  if (!hydrated) return null;

  const totalPlanned = goals.reduce(
    (total, goal) => total + goal.targetAmount,
    0,
  );
  const goalCurrent = goals.reduce(
    (total, goal) => total + (goalValues[goal.id] ?? 0),
    0,
  );
  const onTrack = goals.filter(
    (goal) =>
      new Date(goal.targetDate) >= new Date() ||
      (goalValues[goal.id] ?? 0) >= goal.targetAmount,
  ).length;

  return (
    <main className="investments-page">
      {!isMobile && <Navigation />}
      <div className="dashboard-content">
        <DashboardHeader
          title={t("investments.dashboard.title")}
          subtitle={t("investments.dashboard.subtitle")}
          newGoalLabel={t("investments.goals.new")}
          linkClassName={linkClass}
        />

        <DashboardMetrics
          totalPlanned={totalPlanned}
          goalCurrent={goalCurrent}
          totalCurrent={totalCurrent}
          onTrack={onTrack}
          goalsCount={goals.length}
          locale={locale}
          progressLabel={t("investments.metrics.progress")}
          currentLabel={t("investments.metrics.current")}
          plannedLabel={t("investments.metrics.planned")}
          onTrackLabel={t("investments.metrics.onTrack")}
        />

        <ProgressBar
          value={totalPlanned ? (goalCurrent / totalPlanned) * 100 : 0}
          label={t("investments.metrics.overallProgress")}
        />

        <div className="dashboard-grid">
          <GoalsOverviewSection
            title={t("investments.goals.title")}
            emptyLabel={t("investments.goals.empty")}
            progressLabel={t("investments.goals.progress")}
            locale={locale}
            goals={goals}
            goalValues={goalValues}
          />
          <AllocationSection
            title={t("investments.allocation.title")}
            allocation={allocation}
          />
        </div>

        <UnassignedInvestmentsSection
          title={t("investments.unassigned")}
          newAssetLabel={t("investments.assets.new")}
          emptyLabel={t("investments.assets.emptyUnassigned")}
          locale={locale}
          linkClassName={linkClass}
          investments={unassigned}
          investmentValues={investmentValues}
        />
      </div>
    </main>
  );
}
