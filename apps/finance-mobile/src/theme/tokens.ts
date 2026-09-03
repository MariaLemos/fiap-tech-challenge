import type { TransactionCategory } from "@/types/finance";

export const palette = {
  background: "#08111F",
  backgroundSoft: "#0D1A2C",
  surface: "#122238",
  surfaceRaised: "#182B43",
  surfaceMuted: "#20344D",
  primary: "#5CE1B9",
  primaryStrong: "#2AC995",
  primaryInk: "#06261D",
  income: "#5CE1B9",
  expense: "#FF7A86",
  warning: "#FFC857",
  info: "#7C91FF",
  text: "#F7FAFC",
  textMuted: "#99A8BA",
  textSubtle: "#6F8094",
  border: "#233852",
  white: "#FFFFFF",
  black: "#000000",
  overlay: "rgba(3, 8, 15, 0.72)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radii = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const categoryColors: Record<TransactionCategory, string> = {
  Alimentação: "#FFB86B",
  Educação: "#8FA7FF",
  Investimentos: "#5CE1B9",
  Lazer: "#D995FF",
  Moradia: "#62C4FF",
  Outros: "#A6B2C1",
  Salário: "#4ED6A4",
  Saúde: "#FF7A86",
  Transporte: "#FFD166",
};
