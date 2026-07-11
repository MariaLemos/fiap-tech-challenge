"use client";

import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "../../hooks/useTheme";
import "./ThemeToggle.css";
import { useI18n } from "@repo/i18n/react";

export const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();

  return (
    <div
      className={`theme-toggle ${theme} ${className}`}
      onClick={toggleTheme}
      aria-label={t(theme === "light" ? "theme.switchToDark" : "theme.switchToLight")}
    >
      <div className="icon rounded">
        <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
      </div>
    </div>
  );
};
