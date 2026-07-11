"use client";

import React, { useState } from "react";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navigation } from "../Navigation/Navigation";
import { Button, useIsMobile } from "../..";
import "./MobileNavigation.css";
import { createPortal } from "react-dom";
import { useI18n } from "@repo/i18n/react";

export const MobileNavigation = ({
  className = "",
}: {
  className?: string;
}) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useI18n();
  if (!isMobile) return null;
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <button
        aria-label={t("navigation.openMenu")}
        className={`flex justify-end items-center gap-2 cursor-pointer  bg-primary text-white ${className}`}
        onClick={toggleMenu}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
      {isMenuOpen &&
        createPortal(
          <>
            <Button
              aria-label={t("navigation.closeMenu")}
              className="navigation-close-button"
              variant="icon"
              onClick={toggleMenu}
            >
              <FontAwesomeIcon icon={faX} />
            </Button>
            <Navigation />
          </>,
          document.querySelector("main") || document.body,
        )}
    </>
  );
};
