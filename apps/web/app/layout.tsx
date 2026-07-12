import type { Metadata } from "next";
import { cookies } from "next/headers";
import localFont from "next/font/local";
import "./globals.css";
import "./transactions/transactions.css";
import { Header, ThemeProvider } from "@repo/design-system";
import { buildCookieHeader, fetchCentralSession } from "@repo/auth";
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
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(localeCookieName)?.value);
  const deployedOrigin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;
  const appOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN ?? deployedOrigin;
  const authPathPrefix = process.env.NEXT_PUBLIC_AUTH_PATH_PREFIX ?? "/auth";
  const normalizedAuthPathPrefix =
    authPathPrefix === "/"
      ? ""
      : authPathPrefix.endsWith("/")
        ? authPathPrefix.slice(0, -1)
        : authPathPrefix;
  const authOrigin =
    normalizedAuthPathPrefix && appOrigin
      ? appOrigin
      : (process.env.NEXT_PUBLIC_AUTH_ORIGIN ??
        process.env.AUTH_ORIGIN ??
        deployedOrigin ??
        "http://localhost:3002");
  const authBackendOrigin = process.env.AUTH_ORIGIN ?? authOrigin;
  const returnTo =
    process.env.NEXT_PUBLIC_APP_ORIGIN ??
    (deployedOrigin ? `${deployedOrigin}/` : "http://localhost:3000/");
  const logoutTarget = new URL(
    `${normalizedAuthPathPrefix}/logout`,
    authOrigin,
  );
  logoutTarget.searchParams.set("returnTo", returnTo);
  const session = await fetchCentralSession({
    authOrigin: authBackendOrigin,
    cookieHeader: buildCookieHeader(cookieStore),
  });
  const userName = session.user?.name ?? "Usuário";

  return (
    <html lang={locale} data-theme={initialTheme} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <I18nProvider locale={locale}>
          <ThemeProvider defaultTheme={initialTheme}>
            <UserInfoProvider>
              <Header
                userName={userName}
                logoutHref={logoutTarget.toString()}
                logoutLabel={translate(locale, "auth.logout")}
              />
              {children}
            </UserInfoProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
