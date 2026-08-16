"use client";

import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  Search,
  Settings,
  UsersRound,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils/cnName";

import { useNotificationsPolling, type PollingMode } from "./useNotificationsPolling";

type NotificationsDemoProps = {
  mode: PollingMode;
};

const summaryCards = [
  {
    label: "Open tasks",
    value: "24",
    detail: "8 due today",
    icon: CheckCircle2,
  },
  {
    label: "Pending invoices",
    value: "$18.4k",
    detail: "Across 6 accounts",
    icon: CreditCard,
  },
  {
    label: "Team workload",
    value: "86%",
    detail: "Capacity this week",
    icon: UsersRound,
  },
] as const;

const upcomingWork = [
  ["Client onboarding review", "Today, 11:30 AM", "Finance team"],
  ["Renewal package approval", "Today, 2:00 PM", "Success team"],
  ["Monthly close checklist", "Tomorrow", "Operations"],
] as const;

const recentActivity = [
  ["Payment method updated", "Brightline Studio", "12 min ago"],
  ["Contract packet sent", "North Pier Group", "34 min ago"],
  ["New workspace invite", "Maya Chen", "1 hr ago"],
  ["Invoice marked ready", "Oak & Finch", "2 hr ago"],
] as const;

export function NotificationsDemo({ mode }: NotificationsDemoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, error, isLoading } = useNotificationsPolling({
    enabled: isOpen,
    mode,
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <main className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FileText className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-muted-foreground">
                  Northstar
                </p>
                <h1 className="truncate text-lg font-semibold tracking-normal text-foreground sm:text-xl">
                  Operations Overview
                </h1>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button type="button" variant="outline" size="icon" aria-label="Search">
                <Search aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Settings"
                className="hidden sm:inline-flex"
              >
                <Settings aria-hidden="true" />
              </Button>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Open notifications"
                  className="relative"
                >
                  <Bell aria-hidden="true" />
                  <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-brand-secondary text-[11px] font-semibold text-white">
                    {data?.unreadCount ?? 4}
                  </span>
                </Button>
              </SheetTrigger>
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6">
          <section className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">Monday, August 3</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-normal text-foreground">
                  Good morning, Shubham
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Your team has a few approvals, payments, and client follow-ups waiting.
                </p>
              </div>
              <Button type="button" className="w-full gap-2 sm:w-auto">
                <CalendarDays aria-hidden="true" />
                View schedule
              </Button>
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-3">
            {summaryCards.map(({ label, value, detail, icon: Icon }) => (
              <Card key={label} className="rounded-lg">
                <CardContent className="flex items-start justify-between gap-4 p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="mt-2 text-2xl font-semibold">{value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
                  </div>
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="grid gap-4 lg:grid-cols-[1fr_340px]">
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle>Recent activity</CardTitle>
                <CardDescription>
                  Latest updates from accounts, billing, and team workflows.
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y rounded-lg border p-0">
                {recentActivity.map(([title, owner, time]) => (
                  <div
                    key={`${title}-${owner}`}
                    className="flex items-center justify-between gap-4 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{title}</p>
                      <p className="truncate text-sm text-muted-foreground">{owner}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle>Upcoming work</CardTitle>
                <CardDescription>Items scheduled for the next 24 hours.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingWork.map(([title, time, team]) => (
                  <div key={title} className="rounded-lg border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium">{title}</p>
                      <Clock3 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{time}</p>
                    <p className="mt-1 text-xs font-medium text-primary">{team}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <SheetContent className="gap-0 p-0">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            {isLoading
              ? "Checking for updates..."
              : error ?? `${data?.unreadCount ?? 0} unread`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {(data?.notifications ?? []).map((notification) => (
            <article
              key={notification.id}
              className="flex gap-3 border-b px-6 py-4 last:border-b-0"
            >
              <span
                className={cn(
                  "mt-1.5 size-2 shrink-0 rounded-full",
                  notification.unread ? "bg-brand-secondary" : "bg-border"
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-sm font-medium">{notification.title}</h2>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {notification.timeAgo}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {notification.description}
                </p>
              </div>
            </article>
          ))}

          {!data ? (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              No new notifications yet.
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}