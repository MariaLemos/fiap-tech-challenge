import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ThemeProvider } from "@repo/design-system";
import { localeCookieName, resolveLocale } from "@repo/i18n";
import { I18nProvider } from "@repo/i18n/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auth",
  description: "Central authentication service",
};

const getInitialTheme = async () => {
  const theme = (await cookies()).get("theme")?.value;
  return theme === "dark" || theme === "light" ? theme : "light";
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialTheme = await getInitialTheme();
  const locale = resolveLocale(cookieStore.get(localeCookieName)?.value);
  return (
    <html lang={locale} data-theme={initialTheme} suppressHydrationWarning>
      <body>
        <I18nProvider locale={locale}>
          <ThemeProvider defaultTheme={initialTheme}>{children}</ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
