import { enUS, ptBR, type TranslationKey } from "./catalogs";

export const supportedLocales = ["pt-BR", "en-US"] as const;
export type Locale = (typeof supportedLocales)[number];
export const defaultLocale: Locale = "pt-BR";
export const localeCookieName = "locale";

const catalogs = { "pt-BR": ptBR, "en-US": enUS } as const;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && supportedLocales.includes(value as Locale);
}

export function resolveLocale(value: unknown): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export type TranslationParams = Record<string, string | number>;

export function translate(locale: Locale, key: TranslationKey, params?: TranslationParams): string {
  const message: string = catalogs[locale][key] ?? ptBR[key];
  if (!params) return message;
  return message.replace(/\{(\w+)\}/g, (match, name: string) =>
    params[name] === undefined ? match : String(params[name]),
  );
}

export function formatCurrency(value: number, locale: Locale, currency = "BRL") {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);
}

export type { TranslationKey } from "./catalogs";
