import { LoginForm } from "./LoginForm";
import { cookies } from "next/headers";
import { SectionBox, ThemeToggle, Typography } from "@repo/design-system";
import { localeCookieName, resolveLocale, translate } from "@repo/i18n";
import styles from "./login.module.css";

export default async function LoginPage() {
  const locale = resolveLocale((await cookies()).get(localeCookieName)?.value);

  return (
    <main className={styles.main}>
      <SectionBox className={styles.card}>
        <div className={styles.header}>
          <div>
            <Typography variant="h2">
              {translate(locale, "auth.login.title")}
            </Typography>
            <Typography variant="p" className={styles.subtitle}>
              {translate(locale, "auth.login.subtitle")}
            </Typography>
          </div>
          <ThemeToggle />
        </div>
        <LoginForm />
      </SectionBox>
    </main>
  );
}
