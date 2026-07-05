"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../../atoms";
import { SectionBox } from "../SectionBox/SectionBox";
import Link from "next/link";
import "./Navigation.css";

const pagesList = [
  { name: "Home", path: "/" },
  { name: "Transações", path: "/transactions", zone: "transactions" },
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
  const pathname = usePathname();

  return (
    <SectionBox
      variant="colored"
      className={`flex flex-wrap justify-between items-center w-full navigation ${className}`}
    >
      {children}
      <nav className="flex divide-primary divide-solid divide-y-2 w-full">
        {pagesList.map((page) => {
          const isActive = pathname === page.path;
          const className = `px-4 pt-4 pb-4 transition-all duration-300 ease-in-out rounded-md
                ${
                  isActive
                    ? "bg-primary text-white font-semibold shadow-md"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95"
                }
                hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50
              `;

          if (page.zone) {
            return (
              <a
                className={className}
                href={page.path}
                key={page.name}
                data-active={isActive}
              >
                {page.name}
              </a>
            );
          }

          return (
            <Link
              className={className}
              href={page.path}
              key={page.name}
              data-active={isActive}
            >
              {page.name}
            </Link>
          );
        })}
      </nav>
      <ThemeToggle />
    </SectionBox>
  );
};
