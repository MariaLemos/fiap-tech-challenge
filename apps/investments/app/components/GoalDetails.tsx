"use client";

import {
  Button,
  ProgressBar,
  SectionBox,
  Typography,
} from "@repo/design-system";
import { formatCurrency } from "@repo/i18n";
import { useI18n } from "@repo/i18n/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectGoalById,
  selectGoalValue,
  selectHydrated,
  selectInvestmentValuesMap,
  selectInvestments,
  selectInvestmentsByGoalId,
  selectRecentContributionsForGoal,
} from "../store/investments/investmentsSelectors";
import {
  goalRemoved,
  investmentRemoved,
} from "../store/investments/investmentsSlice";
import { ContributionModal } from "./ContributionModal";

const linkClass =
  "inline-flex h-10 items-center rounded-full border-2 border-primary px-3 font-semibold text-primary";

export function GoalDetails({ goalId }: { goalId: string }) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [contributionFor, setContributionFor] = useState<string | null>(null);

  const hydrated = useAppSelector(selectHydrated);
  const goal = useAppSelector((state) => selectGoalById(state, goalId));
  const assets = useAppSelector((state) =>
    selectInvestmentsByGoalId(state, goalId),
  );
  const current = useAppSelector((state) => selectGoalValue(state, goalId));
  const history = useAppSelector((state) =>
    selectRecentContributionsForGoal(state, goalId, 5),
  );
  const investments = useAppSelector(selectInvestments);
  const investmentValues = useAppSelector(selectInvestmentValuesMap);

  if (!hydrated) return <main><p role="status" aria-live="polite">{t("common.loading")}</p></main>;
  if (!goal)
    return <main className="p-4"><p role="status">{t("investments.goals.notFound")}</p></main>;

  return (
    <main className="investments-page">
      <div className="dashboard-content">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Typography variant="h1">{goal.name}</Typography>
            <p className="text-muted">{goal.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              className={linkClass}
              href={`/investments/goals/${goal.id}/edit`}
            >
              {t("common.edit")}
            </Link>
            <Button
              variant="secondary"
              onClick={() => {
                if (window.confirm(t("investments.goals.deleteConfirmation"))) {
                  dispatch(goalRemoved(goal.id));
                  router.push("/investments");
                }
              }}
            >
              {t("common.delete")}
            </Button>
          </div>
        </header>

        <SectionBox>
          <div className="mb-4 flex flex-wrap justify-between gap-3">
            <div>
              <p className="text-muted">{t("investments.metrics.current")}</p>
              <strong className="text-2xl text-primary">
                {formatCurrency(current, locale)}
              </strong>
            </div>
            <div>
              <p className="text-muted">
                {t("investments.goals.targetAmount")}
              </p>
              <strong>{formatCurrency(goal.targetAmount, locale)}</strong>
            </div>
            <div>
              <p className="text-muted">{t("investments.goals.targetDate")}</p>
              <strong>
                {new Intl.DateTimeFormat(locale).format(
                  new Date(`${goal.targetDate}T00:00:00`),
                )}
              </strong>
            </div>
          </div>
          <ProgressBar
            value={goal.targetAmount ? (current / goal.targetAmount) * 100 : 0}
            label={t("investments.goals.progress")}
          />
        </SectionBox>

        <SectionBox
          title={t("investments.assets.title")}
          headerAction={
            <Link
              className={linkClass}
              href={`/investments/goals/${goal.id}/investments/new`}
            >
              {t("investments.assets.new")}
            </Link>
          }
        >
          <div className="grid gap-3">
            {assets.length ? (
              assets.map((asset) => (
                <article className="asset-row" key={asset.id}>
                  <div>
                    <strong>{asset.name}</strong>
                    <p className="text-sm text-muted">
                      {asset.assetClass} · {asset.returnRate.toFixed(2)}%
                    </p>
                  </div>
                  <strong>
                    {formatCurrency(investmentValues[asset.id] ?? 0, locale)}
                  </strong>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => setContributionFor(asset.id)}>
                      {t("investments.contributions.new")}
                    </Button>
                    <Link
                      className={linkClass}
                      href={`/investments/investments/${asset.id}/edit`}
                    >
                      {t("common.edit")}
                    </Link>
                    <Button
                      variant="secondary"
                      onClick={() => dispatch(investmentRemoved(asset.id))}
                    >
                      {t("common.delete")}
                    </Button>
                  </div>
                </article>
              ))
            ) : (
              <p>{t("investments.assets.empty")}</p>
            )}
          </div>
        </SectionBox>

        <SectionBox title={t("investments.contributions.recent")}>
          <div className="grid gap-2">
            {history.length ? (
              history.map((item) => {
                const asset = investments.find(
                  (investment) => investment.id === item.investmentId,
                );
                return (
                  <div
                    key={item.id}
                    className="flex justify-between border-b py-2"
                  >
                    <span>{asset?.name}</span>
                    <span>
                      {new Intl.DateTimeFormat(locale).format(
                        new Date(`${item.date}T00:00:00`),
                      )}{" "}
                      · {formatCurrency(item.amount, locale)}
                    </span>
                  </div>
                );
              })
            ) : (
              <p>{t("investments.contributions.empty")}</p>
            )}
          </div>
        </SectionBox>

        {contributionFor && (
          <ContributionModal
            investmentId={contributionFor}
            onClose={() => setContributionFor(null)}
          />
        )}
      </div>
    </main>
  );
}
