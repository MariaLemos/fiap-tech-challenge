"use client";

import { Button, InputWrapper, SectionBox } from "@repo/design-system";
import { useI18n } from "@repo/i18n/react";
import { FormProvider, useForm } from "react-hook-form";
import { useAppDispatch } from "../store/hooks";
import { contributionAdded } from "../store/investments/investmentsSlice";
import { useEffect, useRef, type KeyboardEvent } from "react";

type ContributionFormData = { amount: string | number; date: string };

export function ContributionModal({
  investmentId,
  onClose,
}: {
  investmentId: string;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const { t } = useI18n();
  const form = useForm<ContributionFormData>({
    mode: "onChange",
    defaultValues: { amount: "", date: new Date().toISOString().slice(0, 10) },
  });
  const dialogRef = useRef<HTMLDivElement>(null);
  const title = t("investments.contributions.new");
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector<HTMLElement>("input, button")?.focus();
    return () => previouslyFocused?.focus();
  }, []);
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex='-1'])"));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  };
  const {
    formState: { isSubmitting, isValid },
    handleSubmit,
  } = form;
  const submit = handleSubmit(async (data) => {
    dispatch(
      contributionAdded({
        investmentId,
        amount: Number(data.amount),
        date: data.date,
      }),
    );
    onClose();
  });
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={title} onKeyDown={handleKeyDown} className="w-full max-w-md">
      <SectionBox
        title={title}
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
    </div>
  );
}
