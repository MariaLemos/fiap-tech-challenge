import { Suspense } from "react";
import { LogoutClient } from "./LogoutClient";

export default function LogoutPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <Suspense fallback={<p>Encerrando sessão...</p>}>
        <LogoutClient />
      </Suspense>
    </main>
  );
}
