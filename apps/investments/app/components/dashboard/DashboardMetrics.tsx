"use client";

import { formatCurrency } from "@repo/i18n";
import { MetricCard } from "./MetricCard";

type DashboardMetricsProps = {
  totalPlanned: number;
  goalCurrent: number;
  totalCurrent: number;
  onTrack: number;
  goalsCount: number;
  locale: "pt-BR" | "en-US";
  progressLabel: string;
  currentLabel: string;
  plannedLabel: string;
  onTrackLabel: string;
};

export function DashboardMetrics({
  totalPlanned,
  goalCurrent,
  totalCurrent,
  onTrack,
  goalsCount,
  locale,
  progressLabel,
  currentLabel,
  plannedLabel,
  onTrackLabel,
}: DashboardMetricsProps) {
  const progress = totalPlanned
    ? Math.round((goalCurrent / totalPlanned) * 100)
    : 0;

  return (
    <section className="metrics-grid">
      <MetricCard label={progressLabel} value={`${progress}%`} />
      <MetricCard
        label={currentLabel}
        value={formatCurrency(totalCurrent, locale)}
      />
      <MetricCard
        label={plannedLabel}
        value={formatCurrency(totalPlanned, locale)}
      />
      <MetricCard label={onTrackLabel} value={`${onTrack}/${goalsCount}`} />
    </section>
  );
}
