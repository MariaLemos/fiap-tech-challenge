"use client";

import React, { useState } from "react";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navigation } from "../Navigation/Navigation";
import { Button, useIsMobile } from "../..";
import "./MobileNavigation.css";
import { createPortal } from "react-dom";

export const MobileNavigation = ({
  className = "",
}: {
  className?: string;
}) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  if (!isMobile) return null;
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <button
        className={`flex justify-end items-center gap-2 cursor-pointer  bg-primary text-white ${className}`}
        onClick={toggleMenu}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
      {isMenuOpen &&
        createPortal(
          <>
            <Button
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
