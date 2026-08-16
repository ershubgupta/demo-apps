"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dispatch, ReactElement, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  Box,
  File,
  FileSpreadsheet,
  FileText,
  Home,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Tag,
  X,
} from "lucide-react";

import { AppTooltip } from "@/components/app-tooltip";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";
import type { TranslationKey } from "@/i18n/types";
import { cn } from "@/lib/utils/cnName";

type AppShellProps = {
  /** Route content rendered inside the authenticated shell. */
  children: ReactNode;
};

type MobilePageChromeContextValue = {
  setHeaderActions: Dispatch<SetStateAction<ReactNode>>;
  setStickyContent: Dispatch<SetStateAction<ReactNode>>;
};

type NavItem = {
  href: string;
  icon: typeof Home;
  labelKey: TranslationKey;
};

const MobilePageChromeContext =
  createContext<MobilePageChromeContextValue | null>(null);

const navItems: NavItem[] = [
  { href: "/home", labelKey: "navigation.home", icon: Home },
  { href: "/catalog", labelKey: "navigation.catalog", icon: Tag },
  { href: "/catalog-ho", labelKey: "navigation.catalogHo", icon: Tag },
  {
    href: "/catalog-store",
    labelKey: "navigation.catalogStore",
    icon: Tag,
  },
  {
    href: "/contract-price",
    labelKey: "navigation.contractPrice",
    icon: Box,
  },
  {
    href: "/reports/catalog-ho",
    labelKey: "navigation.reportCatalogHo",
    icon: File,
  },
  {
    href: "/reports/catalog-store",
    labelKey: "navigation.reportCatalogStore",
    icon: FileText,
  },
  {
    href: "/reports/contract-price",
    labelKey: "navigation.reportContractPrice",
    icon: FileSpreadsheet,
  },
  { href: "#", labelKey: "navigation.setting", icon: Settings },
];

export function AppShell({ children }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileHeaderActions, setMobileHeaderActions] =
    useState<ReactNode>(null);
  const [mobileStickyContent, setMobileStickyContent] =
    useState<ReactNode>(null);
  const pathname = usePathname();
  const t = useTranslations();
  const mobileChromeContext = useMemo(
    () => ({
      setHeaderActions: setMobileHeaderActions,
      setStickyContent: setMobileStickyContent,
    }),
    []
  );

  return (
    <MobilePageChromeContext.Provider value={mobileChromeContext}>
      <SidebarProvider className="flex-col md:flex-row lg:h-screen lg:overflow-hidden">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-4 md:hidden">
          <Link href="/home" className="flex min-w-0 items-center gap-3">
            <span className="text-base font-extrabold tracking-wide text-foreground">
              CP AXTRA
            </span>
            <span className="text-sm font-extrabold tracking-wide text-brand-secondary">
              makro
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-1.5">
            {mobileHeaderActions}
            <Button
              aria-label={t("navigation.openNavigation")}
              onClick={() => setMobileNavOpen(true)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {mobileStickyContent ? (
          <div className="sticky top-14 z-30 border-b border-border bg-background px-4 py-2 md:hidden">
            {mobileStickyContent}
          </div>
        ) : null}

        {mobileNavOpen ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <Button
              aria-label={t("navigation.closeNavigation")}
              className="absolute inset-0 h-auto w-auto rounded-none bg-foreground/45 hover:bg-foreground/45"
              onClick={() => setMobileNavOpen(false)}
              type="button"
              variant="ghost"
            />
            <aside className="relative flex h-full w-[280px] max-w-[85vw] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl">
              <SidebarHeader className="justify-between gap-3">
                <Link
                  href="/home"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex min-w-0 items-center gap-5 overflow-hidden whitespace-nowrap"
                >
                  <span className="text-base font-extrabold tracking-wide text-sidebar-accent-foreground">
                    CP AXTRA
                  </span>
                  <span className="text-sm font-extrabold tracking-wide text-brand-secondary">
                    makro
                  </span>
                </Link>
                <Button
                  aria-label={t("navigation.closeNavigation")}
                  onClick={() => setMobileNavOpen(false)}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
              </SidebarHeader>
              <SidebarNav
                collapsed={false}
                onNavigate={() => setMobileNavOpen(false)}
                pathname={pathname}
              />
              <SidebarProfile collapsed={false} />
            </aside>
          </div>
        ) : null}

        <DesktopSidebar pathname={pathname} />

        <SidebarInset className="lg:min-h-0">
          <main className="flex-1 p-4 md:p-6 lg:min-h-0 lg:overflow-hidden">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </MobilePageChromeContext.Provider>
  );
}

export function useMobilePageChromeSlot({
  headerActions,
  stickyContent,
}: {
  headerActions?: ReactNode;
  stickyContent?: ReactNode;
}) {
  const context = useContext(MobilePageChromeContext);

  useEffect(() => {
    if (!context) return;
    context.setHeaderActions(headerActions ?? null);
    context.setStickyContent(stickyContent ?? null);

    return () => {
      context.setHeaderActions(null);
      context.setStickyContent(null);
    };
  }, [context, headerActions, stickyContent]);
}

function DesktopSidebar({ pathname }: { pathname: string }) {
  const { collapsed } = useSidebar();
  const t = useTranslations();

  return (
    <Sidebar>
      <SidebarHeader
        className={cn(
          "w-full",
          collapsed ? "justify-center px-0" : "justify-between gap-3"
        )}
      >
        {!collapsed ? (
          <Link
            href="/home"
            className="flex min-w-0 items-center gap-5 overflow-hidden whitespace-nowrap"
          >
            <span className="text-base font-extrabold tracking-wide text-sidebar-accent-foreground">
              CP AXTRA
            </span>
            <span className="text-sm font-extrabold tracking-wide text-brand-secondary">
              makro
            </span>
          </Link>
        ) : null}
        <SidebarTrigger
          aria-label={
            collapsed
              ? t("navigation.expandSidebar")
              : t("navigation.collapseSidebar")
          }
          className={cn(collapsed && "mx-auto")}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarNav collapsed={collapsed} pathname={pathname} />
      <SidebarProfile collapsed={collapsed} />
    </Sidebar>
  );
}

function SidebarNav({
  collapsed,
  onNavigate,
  pathname,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  pathname: string;
}) {
  const t = useTranslations();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          {navItems.map((item) => {
            const Icon = item.icon;
            const label = t(item.labelKey);
            const isActive =
              item.href !== "#" &&
              (pathname === item.href || pathname.startsWith(item.href + "/"));
            const navLink = (
              <SidebarMenuButton
                asChild
                isActive={isActive}
                isCollapsed={collapsed}
                className={cn(collapsed && "mx-auto w-10 justify-center px-0")}
              >
                <Link href={item.href} onClick={onNavigate}>
                  <Icon
                    className={cn(
                      "h-4.5 w-4.5 shrink-0",
                      isActive
                        ? "text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70"
                    )}
                  />
                  <span
                    className={cn(
                      "min-w-0 truncate transition-[max-width,opacity] duration-150 ease-out",
                      collapsed ? "max-w-0 opacity-0" : "max-w-40 opacity-100"
                    )}
                  >
                    {label}
                  </span>
                </Link>
              </SidebarMenuButton>
            );

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarTooltip label={label} disabled={!collapsed}>
                  {navLink}
                </SidebarTooltip>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
}

function SidebarProfile({ collapsed }: { collapsed: boolean }) {
  const t = useTranslations();

  return (
    <SidebarFooter>
      <div
        className={cn(
          "flex items-center  overflow-hidden whitespace-nowrap",
          collapsed ? "justify-center px-0" : "gap-3"
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          CA
        </div>
        <div
          className={cn(
            "min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-150 ease-out",
            collapsed ? "max-w-0 opacity-0" : "max-w-[150px] opacity-100"
          )}
        >
          <p className="truncate text-sm font-semibold text-sidebar-accent-foreground">
            {t("profile.name")}
          </p>
          <p className="truncate text-xs font-medium text-sidebar-foreground/55">
            {t("profile.email")}
          </p>
        </div>
      </div>
      <SidebarTooltip label={t("navigation.signOut")} disabled={!collapsed}>
        <Button
          className={cn(
            "mt-4 w-full justify-start overflow-hidden whitespace-nowrap text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "mx-auto w-10 justify-center px-0 gap-0"
          )}
          type="button"
          variant="ghost"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span
            className={cn(
              "min-w-0 truncate transition-[max-width,opacity] duration-150 ease-out",
              collapsed ? "max-w-0 opacity-0" : "max-w-[90px] opacity-100"
            )}
          >
            {t("navigation.signOut")}
          </span>
        </Button>
      </SidebarTooltip>
    </SidebarFooter>
  );
}

function SidebarTooltip({
  children,
  disabled,
  label,
}: {
  children: ReactElement;
  disabled: boolean;
  label: string;
}) {
  if (disabled) return children;

  return (
    <AppTooltip content={label} disabled={disabled} variant="sidebar">
      {children}
    </AppTooltip>
  );
}
