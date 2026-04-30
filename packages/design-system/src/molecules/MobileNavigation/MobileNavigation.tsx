"use client";

import React, { useId, useState } from "react";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navigation } from "../Navigation/Navigation";
import { Button, useIsMobile } from "../..";
import "./MobileNavigation.css";

export const MobileNavigation = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  if (!isMobile) return null;
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  console.log(isMenuOpen);
  return (
    <>
      <button
        className="flex justify-end items-center gap-2 cursor-pointer h-16 w-full p-6 bg-primary text-white"
        onClick={toggleMenu}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
      {isMenuOpen && (
        <>
          {" "}
          <Button className="close-button" variant="icon" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faX} />
          </Button>
          <Navigation></Navigation>
        </>
      )}
    </>
  );
};
