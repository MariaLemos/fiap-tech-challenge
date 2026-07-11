"use client";

import { type ChangeEvent } from "react";
import { isLocale, localeCookieName } from "@repo/i18n";
import { useI18n } from "@repo/i18n/react";
import "./LanguageSelector.css";

export const LanguageSelector = ({ className = "" }: { className?: string }) => {
  const { locale, t } = useI18n();

  const changeLocale = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value;
    if (!isLocale(nextLocale) || nextLocale === locale) return;

    document.cookie = `${localeCookieName}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    window.location.reload();
  };

  return (
    <div className={`language-selector ${className}`}>
      <label className="language-selector-field">
        <span>{t("navigation.language")}</span>
        <select value={locale} onChange={changeLocale}>
          <option value="pt-BR">Português</option>
          <option value="en-US">English</option>
        </select>
      </label>
    </div>
  );
};
