"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type {
  DashboardSection,
  DashboardStat,
  DashboardStatTone,
} from "@/features/home/home-dashboard-data";
import { useTranslations } from "next-intl";

const statToneClassName: Record<DashboardStatTone, string> = {
  draft: "bg-status-draft",
  preview: "bg-status-preview",
  approved: "bg-status-approved",
  active: "bg-status-active",
  inactive: "bg-status-inactive",
  expired: "bg-status-expired",
  pending: "bg-status-pending",
};

export function DashboardSummaryCard({
  section,
}: {
  section: DashboardSection;
}) {
  const Icon = section.icon;
  const t = useTranslations();

  return (
    <section className="border-border bg-card rounded-xl border p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
            <Icon className="h-4 w-4" />
          </span>
          <h2 className="truncate text-lg font-bold text-foreground">
            {t(section.titleKey)}
          </h2>
        </div>
        <Link
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:text-primary/90 transition"
          href={section.href}
        >
          {t("common.actions.viewAll")}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-4">
        {section.stats.map((stat) => (
          <StatTile key={stat.labelKey} stat={stat} />
        ))}
      </div>
    </section>
  );
}

function StatTile({ stat }: { stat: DashboardStat }) {
  const t = useTranslations();

  return (
    <div className="border-border bg-card rounded-lg border px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${statToneClassName[stat.tone]}`}
        />
        <span
          className={`truncate text-xs font-medium ${
            stat.muted ? "text-muted-foreground/70" : "text-muted-foreground"
          }`}
        >
          {t(stat.labelKey)}
        </span>
      </div>
      <p
        className={`mt-1.5 text-xl font-bold leading-none tracking-[-0.02em] ${
          stat.muted ? "text-muted-foreground/70" : "text-foreground"
        }`}
      >
        {stat.value}
      </p>
    </div>
  );
}
