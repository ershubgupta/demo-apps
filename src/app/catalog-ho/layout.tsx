import { AppShell } from "@/components/layout/app-shell";

export default function CatalogsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
