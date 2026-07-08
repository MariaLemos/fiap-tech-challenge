"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { applyThemeVariables } from "../atoms/tokens/theme-generator";

type Theme = "light" | "dark";
const THEME_STORAGE_KEY = "theme";
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

const isTheme = (theme: string | null): theme is Theme => {
  return theme === "light" || theme === "dark";
};

const getSystemTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getInitialTheme = (defaultTheme: Theme): Theme => {
  if (typeof window === "undefined") {
    return defaultTheme;
  }

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (isTheme(savedTheme)) {
    return savedTheme;
  }

  return getSystemTheme();
};

export const ThemeProvider = ({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setTheme(getInitialTheme(defaultTheme));
    setIsHydrated(true);
  }, [defaultTheme]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY && isTheme(event.newValue)) {
        setTheme(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) return;

    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
    applyThemeVariables(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.cookie = `${THEME_STORAGE_KEY}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
  }, [isHydrated, theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
