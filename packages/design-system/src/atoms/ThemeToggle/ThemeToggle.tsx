"use client";

import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "../../hooks/useTheme";
import "./ThemeToggle.css";

export const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`theme-toggle ${theme} ${className}`}
      onClick={toggleTheme}
      aria-label={`Trocar para tema ${theme === "light" ? "escuro" : "claro"}`}
    >
      <div className="icon rounded">
        <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
      </div>
    </div>
  );
};
