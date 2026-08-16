import { LoginPage } from "@/features/auth/components/login-page";
import { env } from "@/lib/env";

type PageProps = {
  searchParams: Promise<{
    from?: string;
    callbackUrl?: string;
  }>;
};

function getSafeCallbackUrl(value?: string) {
  if (!value?.startsWith("/") || value.startsWith("//")) return "/home";
  return value;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const callbackUrl = getSafeCallbackUrl(params.from ?? params.callbackUrl);

  return (
    <LoginPage
      callbackUrl={callbackUrl}
      enablePasswordLogin={env.ENABLE_PASSWORD_LOGIN === "true"}
      enableSsoLogin={env.ENABLE_SSO_LOGIN === "true"}
      ssoProvider={env.SSO_PROVIDER}
    />
  );
}
