
import "./typography.css";
export const Typography = ({
  children,
  variant = "p",
  className = "",
}: {
    children: React.ReactNode;
    variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
    className?: string;
  }) => {
  const getClassForVariant = (variant: string) => {
    switch (variant) {
      case "h1": return "text-3xl font-bold";
      case "h2": return "text-2xl font-bold";
      case "h3": return "text-xl font-bold";
      case "h4": return "text-lg font-bold";
      case "h5": return "text-md font-bold";
      case "h6": return "text-sm font-bold";
      case "p": return "text-base";
      case "span": return "text-base";
      default: return "text-base";
    }
  };

  const Component = variant;
  
  return (
    <Component className={`${getClassForVariant(variant)} ${className}`}>
      {children}
    </Component>
  );
}