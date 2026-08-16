"use client";

import {
  dashboardSections,
  masterDataLinks,
  overviewLinks,
} from "@/features/home/home-dashboard-data";
import { PageHeader } from "@/components/layout/page-header";
import { useTranslations } from "next-intl";

import { DashboardSummaryCard } from "./dashboard-summary-card";
import { QuickLinksCard } from "./quick-links-card";

export function HomeDashboard() {
  const t = useTranslations();

  return (
    <section className="flex h-full min-h-0 flex-col gap-4">
      <PageHeader subtitle={t("home.subtitle")} title={t("home.title")} />

      <div className="min-h-0 flex-1 overflow-auto pr-1">
        <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.85fr)]">
          <div className="space-y-4">
            {dashboardSections.map((section) => (
              <DashboardSummaryCard key={section.titleKey} section={section} />
            ))}
          </div>

          <div className="grid h-full gap-4 xl:grid-rows-2">
            <QuickLinksCard
              items={overviewLinks}
              title={t("home.overviewAndReport")}
              tone="primary"
            />
            <QuickLinksCard
              items={masterDataLinks}
              title={t("home.masterData")}
              tone="warning"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
