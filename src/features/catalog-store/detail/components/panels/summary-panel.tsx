"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";

import { AppBadge } from "@/components/app-badge";
import { AppReadOnlyField } from "@/components/app-read-only-field";
import { AppTooltip } from "@/components/app-tooltip";
import { Button } from "@/components/ui/button";
import { catalogStoreStatusVariant } from "@/features/catalog-store/config/status-config";
import { useTranslations } from "next-intl";
import type { CatalogStoreDetail } from "@/features/catalog-store/types";
import { cn } from "@/lib/utils/cnName";

type SummaryPanelProps = {
  catalog: CatalogStoreDetail;
};

export function SummaryPanel({ catalog }: SummaryPanelProps) {
  const t = useTranslations();
  const [summaryOpen, setSummaryOpen] = useState(false);

  return (
    <aside className="flex min-h-0 flex-col rounded-xl border border-border bg-card shadow-sm lg:h-full lg:overflow-hidden">
      <div className="min-h-0 flex-1 p-4 lg:overflow-y-auto">
        <header className="space-y-3">
          <div className="hidden items-center justify-between gap-2 md:flex">
            <Link
              href="/catalog-store"
              className="inline-flex min-w-0 items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/85"
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {t("details.catalog.backToCatalogStore")}
              </span>
            </Link>
          </div>

          <div className="flex items-start justify-between gap-3 md:hidden">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {catalog.catalogType}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <AppBadge
                showDot
                variant={catalogStoreStatusVariant[catalog.status]}
              >
                {catalog.status}
              </AppBadge>
              <Button
                aria-expanded={summaryOpen}
                aria-label={
                  summaryOpen
                    ? t("details.catalog.summaryCollapse")
                    : t("details.catalog.summaryExpand")
                }
                className="shrink-0"
                onClick={() => setSummaryOpen((open) => !open)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    summaryOpen && "rotate-180"
                  )}
                />
              </Button>
            </div>
          </div>

          <div className="hidden items-start justify-between gap-3 md:flex">
            <div className="min-w-0">
              <AppTooltip content={catalog.number}>
                <h1 className="cursor-help truncate text-xl font-bold leading-tight text-foreground">
                  {catalog.number}
                </h1>
              </AppTooltip>
            </div>
            <AppBadge
              className="shrink-0"
              showDot
              variant={catalogStoreStatusVariant[catalog.status]}
            >
              {catalog.status}
            </AppBadge>
          </div>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
            {t("details.catalog.modifiedAt", {
              user: catalog.lastModifiedBy,
              date: catalog.lastModifiedAt,
            })}
          </p>
        </header>

        <div
          className={cn("mt-4 space-y-4", !summaryOpen && "hidden md:block")}
        >
          <ApprovalBadge approvedAt={catalog.approvedAt} />
          <div className="border-t border-border pt-3">
            <h2 className="text-sm font-semibold text-foreground">
              {t("details.catalog.information")}
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-5 text-xs">
              <AppReadOnlyField
                label={t("common.fields.catalogType")}
                value={catalog.catalogType}
              />
              <AppReadOnlyField
                label={t("common.fields.chargePercent")}
                required
                value={String(catalog.charge)}
              />
              <AppReadOnlyField
                label={t("common.fields.catalogNumber")}
                value={catalog.number}
              />
              <AppReadOnlyField
                label={t("common.fields.catalogRevision")}
                value={String(catalog.revision)}
              />
              <AppReadOnlyField
                label={t("common.fields.storeMaster")}
                value={catalog.storeMaster}
              />
              <AppReadOnlyField
                className="col-span-2"
                label={t("details.catalog.periodDate")}
                value={`${catalog.periodStart} - ${catalog.periodEnd}`}
              />
              <AppReadOnlyField
                label={t("common.fields.priceStartDate")}
                value={catalog.priceStart}
              />
              <AppReadOnlyField
                label={t("common.fields.priceEndDate")}
                value={catalog.priceEnd}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ApprovalBadge({ approvedAt }: { approvedAt?: string }) {
  const t = useTranslations();
  const isApproved = Boolean(approvedAt);
  return (
    <AppBadge
      className="w-fit px-2.5 py-0.5 text-[11px]"
      showDot
      variant={isApproved ? "success" : "warning"}
    >
      {isApproved
        ? t("details.catalog.approvedAt", { date: approvedAt ?? "" })
        : t("details.catalog.notYetApproved")}
    </AppBadge>
  );
}
