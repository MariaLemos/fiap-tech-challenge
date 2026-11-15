"use client";

import { Button, InputWrapper, SectionBox } from "@repo/design-system";
import type { InvestmentGoal } from "@repo/contracts";
import { useI18n } from "@repo/i18n/react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import {
  createGoalFormValues,
  getEntityFormStatus,
  toGoalInput,
  type GoalFormValues,
} from "../modules/investments/presentation/investmentFormValues";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { goalAdded, goalUpdated } from "../store/investments/investmentsSlice";
import {
  selectGoalById,
  selectHydrated,
} from "../store/investments/investmentsSelectors";

export function GoalForm({ goalId }: { goalId?: string }) {
  const { t } = useI18n();
  const hydrated = useAppSelector(selectHydrated);
  const goal = useAppSelector((state) =>
    goalId ? selectGoalById(state, goalId) : undefined,
  );
  const status = getEntityFormStatus(hydrated, goalId, goal);

  if (status === "loading") {
    return (
      <SectionBox className="max-w-3xl">
        <p role="status" aria-live="polite">
          {t("common.loading")}
        </p>
      </SectionBox>
    );
  }

  if (status === "notFound") {
    return (
      <SectionBox className="max-w-3xl">
        <p role="status">{t("investments.goals.notFound")}</p>
      </SectionBox>
    );
  }

  return <GoalFormContent key={goalId ?? "new"} goalId={goalId} goal={goal} />;
}

function GoalFormContent({
  goalId,
  goal,
}: {
  goalId?: string;
  goal?: InvestmentGoal;
}) {
  const dispatch = useAppDispatch();
  const { t } = useI18n();
  const router = useRouter();
  const form = useForm<GoalFormValues>({
    mode: "onChange",
    defaultValues: createGoalFormValues(goal),
  });
  const {
    formState: { isSubmitting, isValid },
  } = form;
  const submit = form.handleSubmit(async (data) => {
    const input = toGoalInput(data);
    if (goalId) {
      dispatch(goalUpdated({ id: goalId, input }));
    } else {
      dispatch(goalAdded(input));
    }
    router.push(goalId ? `/investments/goals/${goalId}` : "/investments");
  });
  const required = (message: string) => ({
    required: message,
    validate: (value: unknown) =>
      String(value ?? "").trim().length > 0 || message,
  });

  return (
    <SectionBox
      title={goalId ? t("investments.goals.edit") : t("investments.goals.new")}
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
