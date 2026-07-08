import { cookies } from "next/headers";
import { Header, ThemeProvider } from "@repo/design-system";
import "./globals.css";
import "./transactions/transactions.css";
import { UserInfoProvider } from "./hooks/UserInfo.provider";

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

  return (
    <html lang="pt-BR" data-theme={initialTheme} suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme={initialTheme}>
          <UserInfoProvider>
            <Header userName="Maria Lemos" />
            {children}
          </UserInfoProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
