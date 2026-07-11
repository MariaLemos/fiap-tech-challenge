"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export function LogoutClient() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const returnTo = searchParams.get("returnTo") ?? "/login";
    void signOut({
      callbackUrl: returnTo,
      redirect: true,
    });
  }, [searchParams]);

  return <p>Encerrando sessão...</p>;
}
