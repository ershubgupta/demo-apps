import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

import { Toaster } from "sonner";
import { AppProviders } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const appIcons: Metadata["icons"] = {
  icon: [
    { url: "/assets/icon-16.png", sizes: "16x16", type: "image/png" },
    { url: "/assets/icon-32.png", sizes: "32x32", type: "image/png" },
  ],
  apple: [{ url: "/assets/apple-touch-icon.png" }],
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t("app.name"),
    description: t("app.description"),
    icons: appIcons,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <NextIntlClientProvider messages={messages}>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
