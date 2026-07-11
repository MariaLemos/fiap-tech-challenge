"use client";

import { Button, InputWrapper, SectionBox } from "@repo/design-system";
import { useI18n } from "@repo/i18n/react";
import { FormProvider, useForm } from "react-hook-form";
import { useInvestments } from "../hooks/Investments.provider";

type ContributionFormData = { amount: string | number; date: string };

export function ContributionModal({
  investmentId,
  onClose,
}: {
  investmentId: string;
  onClose: () => void;
}) {
  const { addContribution } = useInvestments();
  const { t } = useI18n();
  const form = useForm<ContributionFormData>({
    mode: "onChange",
    defaultValues: { amount: "", date: new Date().toISOString().slice(0, 10) },
  });
  const {
    formState: { isSubmitting, isValid },
    handleSubmit,
  } = form;
  const submit = handleSubmit(async (data) => {
    addContribution(investmentId, Number(data.amount), data.date);
    onClose();
  });
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <SectionBox
        title={t("investments.contributions.new")}
        className="max-w-md"
      >
        <FormProvider {...form}>
          <form onSubmit={submit} noValidate className="grid gap-4">
            <InputWrapper
              label={t("common.value")}
              name="amount"
              type="number"
              mask="money"
              required
              rules={{
                required: t("investments.validation.amountRequired"),
                validate: (value) =>
                  Number(value) > 0 ||
                  t("investments.validation.amountPositive"),
              }}
            />
            <InputWrapper
              label={t("common.date")}
              name="date"
              type="date"
              required
              rules={{
                required: t("investments.validation.dateRequired"),
                validate: (value) =>
                  String(value) <= new Date().toISOString().slice(0, 10) ||
                  t("investments.validation.contributionDateFuture"),
              }}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={!isValid} loading={isSubmitting}>
                {t("actions.confirm")}
              </Button>
              <Button type="button" variant="secondary" onClick={onClose}>
                {t("actions.cancel")}
              </Button>
            </div>
          </form>
        </FormProvider>
      </SectionBox>
    </div>
  );
}
