"use client";

import { Button, InputWrapper, SectionBox } from "@repo/design-system";
import { useI18n } from "@repo/i18n/react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { useInvestments } from "../hooks/Investments.provider";

type InvestmentFormData = {
  goalId: string;
  name: string;
  assetClass: string;
  initialAmount: string | number;
  returnRate: string | number;
};

export function InvestmentForm({
  investmentId,
  defaultGoalId,
}: {
  investmentId?: string;
  defaultGoalId?: string;
}) {
  const { goals, investments, saveInvestment } = useInvestments();
  const { t } = useI18n();
  const router = useRouter();
  const investment = investments.find((item) => item.id === investmentId);
  const form = useForm<InvestmentFormData>({
    mode: "onChange",
    defaultValues: {
      goalId: investment?.goalId ?? defaultGoalId ?? "",
      name: investment?.name ?? "",
      assetClass: investment?.assetClass ?? "",
      initialAmount: investment?.initialAmount ?? 0,
      returnRate: investment?.returnRate ?? 0,
    },
  });
  const {
    formState: { isSubmitting, isValid },
  } = form;
  const submit = form.handleSubmit(async (data) => {
    const goalId = data.goalId || null;
    saveInvestment(
      {
        goalId,
        name: data.name,
        assetClass: data.assetClass,
        initialAmount: Number(data.initialAmount),
        returnRate: Number(data.returnRate),
      },
      investmentId,
    );
    router.push(goalId ? `/investments/goals/${goalId}` : "/investments");
  });
  const textRules = {
    required: t("investments.validation.nameRequired"),
    minLength: { value: 2, message: t("investments.validation.nameMin") },
  };
  return (
    <SectionBox
      title={
        investment ? t("investments.assets.edit") : t("investments.assets.new")
      }
      className="max-w-3xl"
    >
      <FormProvider {...form}>
        <form
          onSubmit={submit}
          noValidate
          className="grid gap-4 md:grid-cols-2"
        >
          <InputWrapper
            label={t("investments.assets.name")}
            name="name"
            required
            rules={textRules}
          />
          <InputWrapper
            label={t("investments.assets.class")}
            name="assetClass"
            required
            rules={textRules}
          />
          <InputWrapper
            label={t("investments.assets.initialAmount")}
            name="initialAmount"
            type="number"
            mask="money"
            required
            rules={{
              required: t("investments.validation.amountRequired"),
              validate: (value) =>
                Number(value) >= 0 || t("investments.validation.amountInvalid"),
            }}
          />
          <InputWrapper
            label={t("investments.assets.returnRate")}
            name="returnRate"
            type="number"
            required
            rules={{
              required: t("investments.validation.returnRequired"),
              validate: (value) =>
                Number.isFinite(Number(value)) ||
                t("investments.validation.amountInvalid"),
            }}
          />
          <InputWrapper
            label={t("investments.assets.goal")}
            name="goalId"
            type="select"
            className="md:col-span-2"
            options={[
              { label: t("investments.unassigned"), value: "" },
              ...goals.map((goal) => ({ label: goal.name, value: goal.id })),
            ]}
          />
          <div className="flex gap-2 md:col-span-2">
            <Button type="submit" disabled={!isValid} loading={isSubmitting}>
              {t("actions.confirm")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              {t("actions.cancel")}
            </Button>
          </div>
        </form>
      </FormProvider>
    </SectionBox>
  );
}
