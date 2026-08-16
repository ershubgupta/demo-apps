"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";

import { AppReadOnlyField } from "@/components/app-read-only-field";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/features/i18n";
import type { ContractPriceDetail } from "@/features/contract-price/types";
import { cn } from "@/lib/utils/cnName";

type SummaryPanelProps = {
  contract: ContractPriceDetail;
};

export function SummaryPanel({ contract }: SummaryPanelProps) {
  const { t } = useTranslation();
  const [summaryOpen, setSummaryOpen] = useState(false);

  return (
    <aside className="flex min-h-0 flex-col rounded-xl border border-border bg-card shadow-sm lg:h-full lg:overflow-hidden">
      <div className="min-h-0 flex-1 p-4 lg:overflow-y-auto">
        <header className="space-y-3">
          <div className="hidden items-center justify-between gap-2 md:flex">
            <Link
              href="/contract-price"
              className="inline-flex min-w-0 items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/85"
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {t("details.contractPrice.backToOverview")}
              </span>
            </Link>
          </div>

          <div className="flex items-start justify-between gap-3 md:hidden">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {t("navigation.contractPrice")}
              </p>
            </div>
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

          <div className="hidden md:block">
            <h1 className="truncate text-xl font-bold leading-tight text-foreground">
              {t("navigation.contractPrice")}
            </h1>
          </div>
          <p className="mt-1 whitespace-pre-line text-[11px] leading-snug text-muted-foreground">
            {t("details.contractPrice.lastModifiedBy", {
              user: contract.lastModifiedBy,
              date: contract.lastModifiedAt,
            })}
          </p>
          <p className="whitespace-pre-line text-[11px] leading-snug text-muted-foreground">
            {t("details.contractPrice.submittedBy", {
              user: contract.submittedBy,
              date: contract.submittedAt,
            })}
          </p>
        </header>

        <div
          className={cn("mt-4 space-y-4", !summaryOpen && "hidden md:block")}
        >
          <div className="border-t border-border pt-3">
            <h2 className="text-sm font-semibold text-foreground">
              {t("details.contractPrice.contractInformation")}
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-5 text-xs">
              <AppReadOnlyField
                label={t("common.fields.contractType")}
                value={contract.contractType}
              />
              <AppReadOnlyField
                label={t("common.fields.charge")}
                required
                value={String(contract.charge)}
              />
              <AppReadOnlyField
                label={t("common.fields.catalogNumber")}
                value={contract.number}
              />
              <AppReadOnlyField
                label={t("common.fields.primaryStore")}
                value={contract.primaryStore}
              />
              <AppReadOnlyField
                className="col-span-2"
                label={t("common.fields.storeOperation")}
                value={contract.storeOperation}
              />
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <h2 className="text-sm font-semibold text-foreground">
              {t("details.contractPrice.customerInformation")}
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-5 text-xs">
              <AppReadOnlyField
                label={t("details.contractPrice.customerCvCode")}
                value={contract.cvCode}
              />
              <AppReadOnlyField
                label={t("details.contractPrice.customerMmid")}
                value={contract.mmid}
              />
              <AppReadOnlyField
                className="col-span-2"
                label={t("common.fields.customer")}
                value={contract.customerName}
              />
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <div className="grid grid-cols-1 gap-5 text-xs">
              <AppReadOnlyField
                label={t("details.catalog.periodDate")}
                value={`${contract.periodStart} - ${contract.periodEnd}`}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
