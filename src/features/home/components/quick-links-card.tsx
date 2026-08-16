"use client";

import Link from "next/link";

import type { QuickLink } from "@/features/home/home-dashboard-data";
import { useTranslations } from "next-intl";

export function QuickLinksCard({
  items,
  title,
  tone,
}: {
  items: QuickLink[];
  title: string;
  tone: "primary" | "warning";
}) {
  const t = useTranslations();
  const iconClassName =
    tone === "primary"
      ? "bg-accent text-primary"
      : "bg-status-draft/10 text-status-draft";

  return (
    <section className="flex h-full flex-col rounded-xl border-border bg-card border p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-bold text-foreground">{title}</h2>
      <div className="grid flex-1 content-start gap-3 sm:grid-cols-2">
        {items.map((item, index) => {
          const Icon = item.icon;
          const label = t(item.labelKey);
          const shouldSpanFullRow =
            items.length % 2 === 1 && index === items.length - 1;

          return (
            <Link
              className={`flex min-h-[54px] items-center gap-2.5 rounded-lg border-border bg-card border px-3 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-accent/40 ${
                shouldSpanFullRow ? "sm:col-span-2" : ""
              }`}
              href={item.href}
              key={item.labelKey}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 leading-4">{label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
