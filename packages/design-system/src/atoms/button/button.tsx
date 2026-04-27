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
      className={`px-2  py-2 ${variant === "primary" ? "bg-primary text-white" :  "bg-foreground text-primary" }
        border border-primary border-solid border-2 rounded-full transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
