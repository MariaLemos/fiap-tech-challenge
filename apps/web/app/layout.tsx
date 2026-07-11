import type { Metadata } from "next";
import { cookies } from "next/headers";
import localFont from "next/font/local";
import "./globals.css";
import "./transactions/transactions.css";
import { Header, ThemeProvider } from "@repo/design-system";
import { localeCookieName, resolveLocale, translate } from "@repo/i18n";
import { I18nProvider } from "@repo/i18n/react";
import { UserInfoProvider } from "./hooks/UserInfo.provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = resolveLocale((await cookies()).get(localeCookieName)?.value);
  return {
    title: translate(locale, "meta.title"),
    description: translate(locale, "meta.description"),
  };
}

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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <I18nProvider locale={locale}>
          <ThemeProvider defaultTheme={initialTheme}>
            <UserInfoProvider>
              <Header userName="Maria Lemos" />
              {children}
            </UserInfoProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
