import { Header, ModalProvider, ThemeProvider } from "@repo/design-system";
import "./globals.css";
import { UserInfoProvider } from "./hooks/UserInfo.provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider defaultTheme="light">
          <UserInfoProvider>
            <ModalProvider>
              <Header userName="Maria Lemos" />
              {children}
            </ModalProvider>
          </UserInfoProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
