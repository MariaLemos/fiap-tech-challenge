"use client";

import { useI18n } from "@repo/i18n/react";

export function HomeWidgetLoading({ area }: { area: string }) {
  const { t } = useI18n();

  return (
    <section className={`${area} deferred-home-widget`} aria-busy="true">
      <p role="status" aria-live="polite">
        {t("common.loading")}
      </p>
    </section>
  );
}
