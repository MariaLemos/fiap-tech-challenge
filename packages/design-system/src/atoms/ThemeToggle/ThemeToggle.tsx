"use client";

import { useTheme } from "../../hooks/useTheme";
import { Button } from "../button/button";

export const ThemeToggle = ({ 
  className = "" 
}: { 
  className?: string 
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      variant="icon" 
      onClick={toggleTheme}
      className={`theme-transition text-2xl ${className}`}
      aria-label={`Trocar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  );
};