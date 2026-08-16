import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    AUTH_API_URL: z.string().url().default("http://localhost:4001"),
    AUTH_API_PATH_PREFIX: z.string().default("/api/auth"),
    CATALOG_API_URL: z.string().url().default("http://localhost:4010/rest/api"),
    CONTRACT_PRICE_API_URL: z
      .string()
      .url()
      .default("http://localhost:4010/rest/api"),
    USE_MOCK_API: z.enum(["true", "false"]).default("true"),
    BETTER_AUTH_COOKIE_PREFIX: z.string().default("local"),
    DEV_BYPASS_AUTH: z.enum(["true", "false"]).default("false"),
    DEV_KONG_BEARER_TOKEN: z.string().optional(),
    ENABLE_PASSWORD_LOGIN: z.enum(["true", "false"]).default("true"),
    ENABLE_SSO_LOGIN: z.enum(["true", "false"]).default("true"),
    SSO_PROVIDER: z.string().default("microsoft"),
    SSO_CALLBACK_URL: z.string().url().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().default("Catalog Admin"),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    AUTH_API_URL: process.env.AUTH_API_URL,
    AUTH_API_PATH_PREFIX: process.env.AUTH_API_PATH_PREFIX,
    CATALOG_API_URL: process.env.CATALOG_API_URL,
    CONTRACT_PRICE_API_URL: process.env.CATALOG_API_URL,
    USE_MOCK_API: process.env.USE_MOCK_API,
    BETTER_AUTH_COOKIE_PREFIX: process.env.BETTER_AUTH_COOKIE_PREFIX,
    DEV_BYPASS_AUTH: process.env.DEV_BYPASS_AUTH,
    DEV_KONG_BEARER_TOKEN: process.env.DEV_KONG_BEARER_TOKEN,
    ENABLE_PASSWORD_LOGIN: process.env.ENABLE_PASSWORD_LOGIN,
    ENABLE_SSO_LOGIN: process.env.ENABLE_SSO_LOGIN,
    SSO_PROVIDER: process.env.SSO_PROVIDER,
    SSO_CALLBACK_URL: process.env.SSO_CALLBACK_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
});
