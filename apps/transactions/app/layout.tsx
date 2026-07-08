import { Header, ThemeInitScript, ThemeProvider } from "@repo/design-system";
import "./globals.css";
import "./transactions/transactions.css";
import { UserInfoProvider } from "./hooks/UserInfo.provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <ThemeInitScript />
      </head>
      <body>
        <ThemeProvider defaultTheme="light">
          <UserInfoProvider>
            <Header userName="Maria Lemos" />
            {children}
          </UserInfoProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
