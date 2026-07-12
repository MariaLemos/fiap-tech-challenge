"use client";

import { Button, SectionBox } from "@repo/design-system";
import { useRouter } from "next/navigation";
import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { useI18n } from "@repo/i18n/react";
import type { TranslationKey } from "@repo/i18n";

export const RouteModal = ({
  children,
  onClose,
  title,
  titleKey,
}: {
  children: ReactNode;
  onClose?: () => void;
  title?: string;
  titleKey?: TranslationKey;
}) => {
  const router = useRouter();
  const { t } = useI18n();
  const handleClose = onClose || (() => router.back());
  const dialogRef = useRef<HTMLDivElement>(null);
  const resolvedTitle = titleKey ? t(titleKey) : title;

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const firstFocusable = dialog?.querySelector<HTMLElement>(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
    );
    firstFocusable?.focus();
    return () => previouslyFocused?.focus();
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      handleClose();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        "button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])",
      ),
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => event.target === event.currentTarget && handleClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={resolvedTitle}
        onKeyDown={handleKeyDown}
        className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <SectionBox
          title={resolvedTitle}
          headerAction={
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              aria-label={`${t("actions.close")}: ${resolvedTitle ?? "modal"}`}
            >
              {t("actions.close")}
            </Button>
          }
          variant="colored"
        >
          {children}
        </SectionBox>
      </div>
    </div>
  );
};
