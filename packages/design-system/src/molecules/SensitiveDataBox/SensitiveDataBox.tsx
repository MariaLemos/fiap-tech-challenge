"use client";

import { useState } from "react";
import { Typography } from "../../atoms/typography/typography";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../../atoms";
export const SensitiveDataBox = ({
  children,
  className = "",title, variant = "bg",
}: {
  children: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
  variant?: "bg" | "colored";
}) => {
    const [showSensitiveData, setShowSensitiveData] = useState(false);
    const toggleVisibility = () => {
        setShowSensitiveData(!showSensitiveData);
    };
  return (
    <section
      className={`p-6 justify-self-end rounded-md  ${className}`}
    >

      <Typography variant="h3" className="mb-2">
        {title}
        <Button className="ml-4 text-sm text-gray-300" variant="icon" onClick={toggleVisibility}>
        <FontAwesomeIcon icon={showSensitiveData ? faEyeSlash : faEye} /></Button>
      </Typography>
      {showSensitiveData && children}
    </section>
  );
};
