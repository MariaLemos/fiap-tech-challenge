"use client";

import { useEffect, useMemo, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button, Input, InputWrapper, Typography } from "@repo/design-system";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useI18n } from "@repo/i18n/react";
import {
  getDefaultReturnTo,
  logClientDebug,
  logRuntimeEnvHealth,
  normalizeReturnTo,
  readPersistedDebugLogs,
  resolveRedirectDestination,
} from "./loginRedirect";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const form = useForm<{
    email: string;
    password: string;
  }>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const returnTo = useMemo(
    () => normalizeReturnTo(searchParams.get("returnTo")),
    [searchParams],
  );

  useEffect(() => {
    logRuntimeEnvHealth();

    const persistedLogs = readPersistedDebugLogs();
    if (persistedLogs.length > 0) {
      console.info("[auth-login-debug] persisted.logs", {
        count: persistedLogs.length,
        latest: persistedLogs[persistedLogs.length - 1],
      });
    }

    const onError = (event: ErrorEvent) => {
      logClientDebug("window.error", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      logClientDebug("window.unhandledrejection", {
        reason:
          typeof event.reason === "string"
            ? event.reason
            : JSON.stringify(event.reason ?? null),
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  async function onSubmit(values: { email: string; password: string }) {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      logClientDebug("onSubmit.start", {
        email: values.email,
        returnTo,
      });

      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        callbackUrl: returnTo,
        redirect: false,
      });

      logClientDebug("onSubmit.signInResponse", {
        ok: response?.ok,
        error: response?.error,
        status: response?.status,
        url: response?.url,
      });

      if (!response || !response.ok || response.error) {
        setError(t("auth.login.error.invalidCredentials"));
        logClientDebug("onSubmit.invalidCredentials", {
          ok: response?.ok,
          error: response?.error,
        });
        return;
      }

      const destination = resolveRedirectDestination(returnTo, response.url);
      logClientDebug("onSubmit.redirectDestination", {
        destination,
        currentUrl: window.location.href,
      });
      setSuccessMessage(t("auth.login.success.redirecting"));
      setTimeout(() => {
        logClientDebug("onSubmit.windowAssign", {
          destination,
        });
        window.location.assign(destination);
      }, 600);

      setTimeout(() => {
        if (window.location.pathname.startsWith("/login")) {
          const fallback = getDefaultReturnTo();
          logClientDebug("onSubmit.windowReplaceFallback", {
            fallback,
            pathname: window.location.pathname,
          });
          window.location.replace(fallback);
        }
      }, 1800);
    } catch {
      setError(t("auth.login.error.unexpected"));
      logClientDebug("onSubmit.exception");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        method="post"
        className="grid min-w-[20rem] gap-3"
      >
        <InputWrapper
          label={t("auth.login.fields.email")}
          name="email"
          type="email"
          required
          rules={{
            required: t("auth.login.validation.emailRequired"),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t("auth.login.validation.emailInvalid"),
            },
          }}
        />

        <label className="flex flex-col gap-1">
          <Typography variant="strong" className="text-sm">
            {t("auth.login.fields.password")}
          </Typography>
          <div className="flex gap-2 items-center">
            <Controller
              name="password"
              control={form.control}
              rules={{
                required: t("auth.login.validation.passwordRequired"),
                minLength: {
                  value: 6,
                  message: t("auth.login.validation.passwordMin"),
                },
              }}
              render={({ field }) => (
                <Input
                  field={field}
                  type={showPassword ? "text" : "password"}
                  className="border-primary focus:border-primary/80 transition-colors flex-1"
                />
              )}
            />
            <Button
              type="button"
              variant="secondary"
              className="px-3"
              aria-pressed={showPassword}
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword
                ? t("auth.login.actions.hidePassword")
                : t("auth.login.actions.showPassword")}
            </Button>
          </div>
          {form.formState.errors.password?.message ? (
            <Typography variant="span" className="text-red-600 text-xs">
              {String(form.formState.errors.password.message)}
            </Typography>
          ) : null}
        </label>

        <Button type="submit" loading={loading} className="mt-1">
          {t("auth.login.actions.submit")}
        </Button>

        {error ? (
          <p role="alert">
            <Typography variant="span" className="text-red-600">
              {error}
            </Typography>
          </p>
        ) : null}

        {successMessage ? (
          <p role="status" aria-live="polite">
            <Typography variant="span" className="text-green-700">
              {successMessage}
            </Typography>
          </p>
        ) : null}
      </form>
    </FormProvider>
  );
}
