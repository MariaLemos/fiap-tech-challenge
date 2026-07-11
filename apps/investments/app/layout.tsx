import { cookies } from "next/headers";
import { Header, ThemeProvider } from "@repo/design-system";
import { buildCookieHeader, fetchCentralSession } from "@repo/auth";
import { localeCookieName, resolveLocale } from "@repo/i18n";
import { I18nProvider } from "@repo/i18n/react";
import "./globals.css";
import "./investments/investments.css";
import { StoreProvider } from "./store/StoreProvider";

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
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(localeCookieName)?.value);
  const authBackendOrigin = process.env.AUTH_ORIGIN ?? "http://localhost:3002";
  const session = await fetchCentralSession({
    authOrigin: authBackendOrigin,
    cookieHeader: buildCookieHeader(cookieStore),
  });
  const userName = session.user?.name ?? "Usuário";

  return (
    <html lang={locale} data-theme={initialTheme} suppressHydrationWarning>
      <body>
        <I18nProvider locale={locale}>
          <ThemeProvider defaultTheme={initialTheme}>
            <StoreProvider>
              <Header userName={userName} />
              {children}
            </StoreProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
