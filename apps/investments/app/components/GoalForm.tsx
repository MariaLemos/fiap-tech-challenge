"use client";

import { Button, InputWrapper, SectionBox } from "@repo/design-system";
import { useI18n } from "@repo/i18n/react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { useInvestments } from "../hooks/Investments.provider";

type GoalFormData = {
  name: string;
  category: string;
  targetAmount: string | number;
  targetDate: string;
  description: string;
};

export function GoalForm({ goalId }: { goalId?: string }) {
  const { goals, saveGoal } = useInvestments();
  const { t } = useI18n();
  const router = useRouter();
  const goal = goals.find((item) => item.id === goalId);
  const form = useForm<GoalFormData>({
    mode: "onChange",
    defaultValues: {
      name: goal?.name ?? "",
      category: goal?.category ?? "",
      targetAmount: goal?.targetAmount ?? "",
      targetDate: goal?.targetDate ?? "",
      description: goal?.description ?? "",
    },
  });
  const {
    formState: { isSubmitting, isValid },
  } = form;
  const submit = form.handleSubmit(async (data) => {
    saveGoal({ ...data, targetAmount: Number(data.targetAmount) }, goalId);
    router.push(goalId ? `/investments/goals/${goalId}` : "/investments");
  });
  const required = (message: string) => ({
    required: message,
    validate: (value: unknown) =>
      String(value ?? "").trim().length > 0 || message,
  });
  return (
    <SectionBox
      title={goal ? t("investments.goals.edit") : t("investments.goals.new")}
      className="max-w-3xl"
    >
      <FormProvider {...form}>
        <form
          onSubmit={submit}
          noValidate
          className="grid gap-4 md:grid-cols-2"
        >
          <InputWrapper
            label={t("investments.goals.name")}
            name="name"
            required
            rules={{
              ...required(t("investments.validation.nameRequired")),
              minLength: {
                value: 3,
                message: t("investments.validation.nameMin"),
              },
            }}
          />
          <InputWrapper
            label={t("investments.goals.category")}
            name="category"
            required
            rules={required(t("investments.validation.categoryRequired"))}
          />
          <InputWrapper
            label={t("investments.goals.targetAmount")}
            name="targetAmount"
            type="number"
            mask="money"
            required
            rules={{
              required: t("investments.validation.amountRequired"),
              validate: (value) =>
                Number(value) > 0 || t("investments.validation.amountPositive"),
            }}
          />
          <InputWrapper
            label={t("investments.goals.targetDate")}
            name="targetDate"
            type="date"
            required
            rules={{
              required: t("investments.validation.dateRequired"),
              validate: (value) =>
                String(value) >= new Date().toISOString().slice(0, 10) ||
                t("investments.validation.targetDateFuture"),
            }}
          />
          <InputWrapper
            label={t("investments.goals.description")}
            name="description"
            className="md:col-span-2"
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
