"use client";
import { Navigation, useIsMobile } from "@repo/design-system";
import { Statement } from "../components/Statement/Statement";
import "./page.css";

export default function Transfer() {
  const isMobile = useIsMobile();

  return (
    <main className="transactions-page  gap-4 py-4  h-[calc(100vh-4rem)]">
      {!isMobile && <Navigation />}

      <Statement showAddButton />
    </main>
  );
}
