import React from "react";

export const Button = ({
  children,
  className = "",
  variant = "primary",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "icon";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const getClassForVariant = (variant: string) => {
    switch (variant) {
      case "icon":
        return "hover:opacity-75 text-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 border-none";
      case "primary":
        return "bg-primary text-white font-semibold hover:bg-primary/90 hover:scale-[0.98] active:scale-95 disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:scale-100";
      case "secondary":
        return "bg-foreground  font-semibold text-primary hover:bg-foreground/80 hover:scale-[0.98] active:scale-95 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100";

      default:
        return "text-base hover:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500";
    }
  };

  return (
    <button
      className={` px-2 py-2  
        border border-primary border-solid border-2 ${getClassForVariant(variant)} rounded-full transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 leading-none
        disabled:border-gray-400 h-10 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
