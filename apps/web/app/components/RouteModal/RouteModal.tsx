"use client";

import { Button, SectionBox } from "@repo/design-system";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <SectionBox
          title={titleKey ? t(titleKey) : title}
          headerAction={
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
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
