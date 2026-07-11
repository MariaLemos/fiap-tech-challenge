"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { defaultLocale, translate, type Locale, type TranslationKey, type TranslationParams } from "./index";

type I18nContextValue = {
  locale: Locale;
  t: (key: TranslationKey, params?: TranslationParams) => string;
};

const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale,
  t: (key) => translate(defaultLocale, key),
});

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo<I18nContextValue>(
    () => ({ locale, t: (key, params) => translate(locale, key, params) }),
    [locale],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
