"use client";

import React, { useState } from "react";
import { ThemeToggle } from "../../atoms";
import { SectionBox } from "../SectionBox/SectionBox";
import Link from "next/link";
import "./Navigation.css";

const pagesList = [
  { name: "Home", path: "/" },
  { name: "Transferencias", path: "/transfer" },
  { name: "Investimentos", path: "/investments" },
  { name: "Outros serviços", path: "/services" },
];

export const Navigation = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <SectionBox
      variant="colored"
      className={`flex flex-col flex-wrap justify-between items-center navigation ${className}`}
    >
      {children}
      <nav className="flex divide-primary divide-solid divide-y-2">
        {pagesList.map((page) => (
          <Link className="px-4 pt-4 pb-2" href={page.path} key={page.name}>
            {page.name}
          </Link>
        ))}
      </nav>
      <ThemeToggle />
    </SectionBox>
  );
};
