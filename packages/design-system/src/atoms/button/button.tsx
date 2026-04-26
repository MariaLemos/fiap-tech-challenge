import React from "react";

export const Button = ({
  children,
  className = "",
  variant = "primary",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  variant?:"primary" | "secondary"| "icon";

}&React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button 
      className={`px-4 py-2 bg-mint-500 text-white rounded-md transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
