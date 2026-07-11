"use client";

import { Button, Navigation, ProgressBar, SectionBox, Typography, useIsMobile } from "@repo/design-system";
import { formatCurrency } from "@repo/i18n";
import { useI18n } from "@repo/i18n/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useInvestments } from "../hooks/Investments.provider";
import { ContributionModal } from "./ContributionModal";

const linkClass = "inline-flex h-10 items-center rounded-full border-2 border-primary px-3 font-semibold text-primary";

export function GoalDetails({ goalId }: { goalId: string }) {
  const isMobile = useIsMobile(); const { locale, t } = useI18n(); const router = useRouter(); const [contributionFor, setContributionFor] = useState<string | null>(null);
  const { goals, investments, contributions, getGoalValue, getInvestmentValue, deleteGoal, deleteInvestment, isReady } = useInvestments();
  const goal = goals.find((item) => item.id === goalId); if (!isReady) return null; if (!goal) return <main className="p-4">{t("investments.goals.notFound")}</main>;
  const assets = investments.filter((item) => item.goalId === goalId); const current = getGoalValue(goalId); const assetIds = new Set(assets.map((item) => item.id)); const history = contributions.filter((item) => assetIds.has(item.investmentId)).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  return <main className="investments-page">{!isMobile && <Navigation />}<div className="dashboard-content">
    <header className="flex flex-wrap items-center justify-between gap-3"><div><Typography variant="h1">{goal.name}</Typography><p className="text-muted">{goal.description}</p></div><div className="flex flex-wrap gap-2"><Link className={linkClass} href={`/investments/goals/${goal.id}/edit`}>{t("common.edit")}</Link><Button variant="secondary" onClick={() => { if (window.confirm(t("investments.goals.deleteConfirmation"))) { deleteGoal(goal.id); router.push("/investments"); } }}>{t("common.delete")}</Button></div></header>
    <SectionBox><div className="mb-4 flex flex-wrap justify-between gap-3"><div><p className="text-muted">{t("investments.metrics.current")}</p><strong className="text-2xl text-primary">{formatCurrency(current, locale)}</strong></div><div><p className="text-muted">{t("investments.goals.targetAmount")}</p><strong>{formatCurrency(goal.targetAmount, locale)}</strong></div><div><p className="text-muted">{t("investments.goals.targetDate")}</p><strong>{new Intl.DateTimeFormat(locale).format(new Date(`${goal.targetDate}T00:00:00`))}</strong></div></div><ProgressBar value={goal.targetAmount ? current / goal.targetAmount * 100 : 0} label={t("investments.goals.progress")} /></SectionBox>
    <SectionBox title={t("investments.assets.title")} headerAction={<Link className={linkClass} href={`/investments/goals/${goal.id}/investments/new`}>{t("investments.assets.new")}</Link>}><div className="grid gap-3">{assets.length ? assets.map((asset) => <article className="asset-row" key={asset.id}><div><strong>{asset.name}</strong><p className="text-sm text-muted">{asset.assetClass} · {asset.returnRate.toFixed(2)}%</p></div><strong>{formatCurrency(getInvestmentValue(asset), locale)}</strong><div className="flex flex-wrap gap-2"><Button onClick={() => setContributionFor(asset.id)}>{t("investments.contributions.new")}</Button><Link className={linkClass} href={`/investments/investments/${asset.id}/edit`}>{t("common.edit")}</Link><Button variant="secondary" onClick={() => deleteInvestment(asset.id)}>{t("common.delete")}</Button></div></article>) : <p>{t("investments.assets.empty")}</p>}</div></SectionBox>
    <SectionBox title={t("investments.contributions.recent")}><div className="grid gap-2">{history.length ? history.map((item) => { const asset = investments.find((investment) => investment.id === item.investmentId); return <div key={item.id} className="flex justify-between border-b py-2"><span>{asset?.name}</span><span>{new Intl.DateTimeFormat(locale).format(new Date(`${item.date}T00:00:00`))} · {formatCurrency(item.amount, locale)}</span></div>; }) : <p>{t("investments.contributions.empty")}</p>}</div></SectionBox>
    {contributionFor && <ContributionModal investmentId={contributionFor} onClose={() => setContributionFor(null)} />}
  </div></main>;
}
