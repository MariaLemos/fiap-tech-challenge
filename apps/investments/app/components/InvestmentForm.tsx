"use client";

import { Button, InputWrapper, SectionBox } from "@repo/design-system";
import type { Investment, InvestmentGoal } from "@repo/contracts";
import { useI18n } from "@repo/i18n/react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import {
  createInvestmentFormValues,
  getEntityFormStatus,
  resolveDefaultGoalId,
  toInvestmentInput,
  type InvestmentFormValues,
} from "../modules/investments/presentation/investmentFormValues";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  investmentAdded,
  investmentUpdated,
} from "../store/investments/investmentsSlice";
import {
  selectGoals,
  selectHydrated,
  selectInvestmentById,
} from "../store/investments/investmentsSelectors";

type InvestmentFormProps = {
  investmentId?: string;
  defaultGoalId?: string;
};

export function InvestmentForm({
  investmentId,
  defaultGoalId,
}: InvestmentFormProps) {
  const { t } = useI18n();
  const hydrated = useAppSelector(selectHydrated);
  const goals = useAppSelector(selectGoals);
  const investment = useAppSelector((state) =>
    investmentId ? selectInvestmentById(state, investmentId) : undefined,
  );
  const status = getEntityFormStatus(hydrated, investmentId, investment);

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
        <p role="status">{t("investments.notFound")}</p>
      </SectionBox>
    );
  }

  const hydratedDefaultGoalId = resolveDefaultGoalId(goals, defaultGoalId);

  return (
    <InvestmentFormContent
      key={investmentId ?? `new:${hydratedDefaultGoalId ?? ""}`}
      investmentId={investmentId}
      defaultGoalId={hydratedDefaultGoalId}
      investment={investment}
      goals={goals}
    />
  );
}
function InvestmentFormContent({
  investmentId,
  defaultGoalId,
  investment,
  goals,
}: InvestmentFormProps & {
  investment?: Investment;
  goals: InvestmentGoal[];
}) {
  const dispatch = useAppDispatch();
  const { t } = useI18n();
  const router = useRouter();
  const form = useForm<InvestmentFormValues>({
    mode: "onChange",
    defaultValues: createInvestmentFormValues(investment, defaultGoalId),
  });
  const {
    formState: { isSubmitting, isValid },
  } = form;
  const submit = form.handleSubmit(async (data) => {
    const input = toInvestmentInput(data);
    if (investmentId) {
      dispatch(investmentUpdated({ id: investmentId, input }));
    } else {
      dispatch(investmentAdded(input));
    }
    router.push(
      input.goalId ? `/investments/goals/${input.goalId}` : "/investments",
    );
  });
  const textRules = {
    required: t("investments.validation.nameRequired"),
    minLength: { value: 2, message: t("investments.validation.nameMin") },
  };

  return (
    <SectionBox
      title={
        investmentId
          ? t("investments.assets.edit")
          : t("investments.assets.new")
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
