import { cookies } from "next/headers";
import { Header, ThemeProvider } from "@repo/design-system";
import { localeCookieName, resolveLocale } from "@repo/i18n";
import { I18nProvider } from "@repo/i18n/react";
import "./globals.css";
import "./investments/investments.css";
import { InvestmentsProvider } from "./hooks/Investments.provider";

const getInitialTheme = async () => {
  const theme = (await cookies()).get("theme")?.value;

  return theme === "dark" || theme === "light" ? theme : "light";
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialTheme = await getInitialTheme();
  const locale = resolveLocale((await cookies()).get(localeCookieName)?.value);

  return (
    <html lang={locale} data-theme={initialTheme} suppressHydrationWarning>
      <body>
        <I18nProvider locale={locale}>
          <ThemeProvider defaultTheme={initialTheme}>
            <InvestmentsProvider>
              <Header userName="Maria Lemos" />
              {children}
            </InvestmentsProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
