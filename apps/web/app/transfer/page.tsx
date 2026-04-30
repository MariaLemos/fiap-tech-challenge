"use client";
import { Navigation, useIsMobile } from "@repo/design-system";
import { Statement } from "../components/Statement/Statement";

export default function Transfer() {
  const isMobile = useIsMobile();
  return (
    <main className="transfer-page grid gap-4 py-4 grid-cols-[200px_1fr] [grid-template-areas:'nav_statement'] h-[calc(100vh-4rem)]">
      {!isMobile && <Navigation />}
      <Statement />
    </main>
  );
}
