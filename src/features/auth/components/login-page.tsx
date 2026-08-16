"use client";

import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Shield } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

type LoginPageProps = {
  callbackUrl: string;
  enablePasswordLogin: boolean;
  enableSsoLogin: boolean;
  ssoProvider: string;
};

export function LoginPage({
  callbackUrl,
  enablePasswordLogin,
  enableSsoLogin,
  ssoProvider,
}: LoginPageProps) {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function signInWithPassword(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, callbackURL: callbackUrl }),
      });

      if (!response.ok) {
        const message = await response.text().catch(() => "");
        const nextError = message || t("auth.invalidCredentials");
        setError(nextError);
        toast.error(t("auth.signInFailed"), { description: nextError });
        return;
      }

      window.location.href = callbackUrl;
    } catch {
      const nextError = t("auth.unableToSignIn");
      setError(nextError);
      toast.error(t("auth.signInFailed"), { description: nextError });
    } finally {
      setIsSubmitting(false);
    }
  }

  function signInWithSso() {
    setError(null);
    setIsSubmitting(true);

    const params = new URLSearchParams({
      provider: ssoProvider,
      callbackURL: callbackUrl,
    });
    window.location.href = `/api/auth/sign-in/social?${params.toString()}`;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-[380px]">
        <div className="mb-7 flex justify-center">
          <BrandLockup />
        </div>

        <div className="rounded-2xl bg-card p-7 shadow-xl">
          <div className="mb-7 text-center">
            <h1 className="text-xl font-extrabold tracking-[-0.02em] text-foreground">
              {t("auth.title")}
            </h1>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {t("auth.subtitle")}
            </p>
          </div>

          <div className="space-y-5">
            {enablePasswordLogin ? (
              <form className="space-y-4" onSubmit={signInWithPassword}>
                <div className="space-y-2">
                  <Label
                    className="text-xs font-semibold text-muted-foreground"
                    htmlFor="email"
                  >
                    {t("auth.email")}
                  </Label>
                  <Input
                    id="email"
                    placeholder={t("auth.emailPlaceholder")}
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    className="text-xs font-semibold text-muted-foreground"
                    htmlFor="password"
                  >
                    {t("auth.password")}
                  </Label>
                  <div className="relative">
                    <Input
                      className="pr-10"
                      id="password"
                      placeholder={t("auth.passwordPlaceholder")}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                    <Button
                      aria-label={
                        showPassword
                          ? t("auth.hidePassword")
                          : t("auth.showPassword")
                      }
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword((value) => !value)}
                      size="icon-sm"
                      type="button"
                      variant="ghost"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("auth.signingIn") : t("auth.signIn")}
                </Button>
              </form>
            ) : null}

            {enablePasswordLogin && enableSsoLogin ? (
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs font-bold uppercase tracking-[0.04em] text-muted-foreground/70">
                  {t("auth.continueWith")}
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>
            ) : null}

            {enableSsoLogin ? (
              <Button
                type="button"
                className="w-full"
                disabled={isSubmitting}
                onClick={signInWithSso}
                variant="secondary"
              >
                <LockKeyhole className="mr-2 h-4 w-4 text-primary" />
                {t("auth.continueWithSso")}
              </Button>
            ) : null}

            {error ? (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                {error}
              </p>
            ) : null}

            {!enableSsoLogin && !enablePasswordLogin ? (
              <p className="rounded-lg border border-border bg-secondary p-3 text-sm text-muted-foreground">
                {t("auth.noMethods")}
              </p>
            ) : null}

            <div className="border-t border-border pt-5">
              <div className="flex items-start justify-center gap-3 text-center text-xs leading-5 text-muted-foreground/70">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/70" />
                <p>{t("auth.secureNotice")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function BrandLockup() {
  return (
    <div className="flex items-center gap-4">
      <span className="text-base font-extrabold tracking-wide text-primary">
        CP AXTRA
      </span>
      <span className="h-5 w-px bg-input" />
      <span className="text-sm font-extrabold italic tracking-wide text-brand-secondary">
        makro
      </span>
    </div>
  );
}
