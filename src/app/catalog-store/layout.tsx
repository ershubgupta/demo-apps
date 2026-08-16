import { AppShell } from "@/components/layout/app-shell";

export default function CatalogStoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
