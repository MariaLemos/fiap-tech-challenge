// Definição dos temas
export const themes = {
  light: {
    primary: "#4F46E5",
    background: "#FFFFFF",
    surface: "#F9FAFB",
    foreground: "#111827",
    muted: "#6B7280",
    border: "#E5E7EB",
    accent: "#3B82F6",
  },
  dark: {
    primary: "#6366F1",
    background: "#0F172A",
    surface: "#1E293B",
    foreground: "#F8FAFC",
    muted: "#94A3B8",
    border: "#334155",
    accent: "#60A5FA",
  }
} as const

// Cores fixas (não dependem do tema)
export const staticColors = {
  mint: {
    500: "oklch(0.72 0.11 178)",
  },
  blue: {
    500: "#3B82F6",
  },
  red: {
    500: "#EF4444",
  },
  green: {
    500: "#10B981",
  },
} as const

// Export para compatibilidade (usa light como padrão)
export const colors = {
  ...themes.light,
  ...staticColors,
}

// Exports específicos
export const lightTheme = themes.light
export const darkTheme = themes.dark

// Export de nomes de tokens para TypeScript
export type ThemeTokens = keyof typeof themes.light