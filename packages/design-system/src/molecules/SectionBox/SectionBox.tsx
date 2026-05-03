import { Typography } from "../../atoms/typography/typography";
import image from "../../assets/background.svg";
import "./SectionBox.css";

export const SectionBox = ({
  children,
  className = "",
  title,
  variant = "colored",
}: {
  children: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
  variant?: "bg" | "colored";
}) => {
  return (
    <section
      className={`sectionBox p-8 ${variant} ${variant === "bg" ? "text-white" : "bg-foreground"} text-font rounded-md w-full ${className}`}
      style={
        variant === "bg"
          ? ({
              "--bg-image": `url(${image.src || image.default || image})`,
            } as React.CSSProperties)
          : undefined
      }
    >
      {title && (
        <Typography variant="h2" className="mb-2 w-full">
          {title}
        </Typography>
      )}
      {children}
    </section>
  );
};
