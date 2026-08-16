"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ChevronDown, RefreshCw } from "lucide-react";

import { AppBadge } from "@/components/app-badge";
import { AppField } from "@/components/app-field";
import { AppReadOnlyField } from "@/components/app-read-only-field";
import { AppTooltip } from "@/components/app-tooltip";
import { PrioritySequence } from "@/components/priority-sequence/priority-sequence";
import { Button } from "@/components/ui/button";
import {
  catalogStatusVariant,
  getCatalogStatusLabel,
} from "@/features/catalog-ho/config/status-config";
import { useTranslations } from "next-intl";
import { StatusEnum, type CatalogDetail } from "@/features/catalog-ho/types";
import { cn } from "@/lib/utils/cnName";
import { DatePicker } from "@/components/calendar/date-picker";
import { isBeforeToday, parseDate } from "@/lib/utils/date-format";
import type { DateRange } from "react-day-picker";

type SummaryPanelProps = {
  catalog: CatalogDetail;
  canEdit: boolean;
  onPeriodChange?: (range: { start: string; end: string }) => void;
  onUpdate?: () => void;
  onApprove?: () => void;
  isDirty?: boolean;
  periodError?: string;
};

export function SummaryPanel({
  catalog,
  canEdit,
  onPeriodChange,
  onUpdate,
  onApprove,
  isDirty = false,
  periodError,
}: SummaryPanelProps) {
  const t = useTranslations();
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [draftPeriodValue, setDraftPeriodValue] = useState<{
    range?: DateRange;
    periodEnd: string;
    periodStart: string;
  }>();
  const showApprove =
    catalog.status === StatusEnum.Preview ||
    catalog.status === StatusEnum.Draft;
  const showUpdate = catalog.status === StatusEnum.Draft;
  const showActions = showUpdate || showApprove;

  const from = parseDate(catalog.periodStart);
  const to = parseDate(catalog.periodEnd);

  const periodValue = {
    from,
    to,
  };
  const activeDraftPeriodValue =
    draftPeriodValue?.periodStart === catalog.periodStart &&
    draftPeriodValue.periodEnd === catalog.periodEnd
      ? draftPeriodValue.range
      : undefined;

  return (
    <aside className="flex min-h-0 flex-col rounded-xl border border-border bg-card shadow-sm lg:h-full lg:overflow-hidden">
      <div className="min-h-0 flex-1 p-4 lg:overflow-y-auto">
        <header className="space-y-3">
          <div className="hidden items-center justify-between gap-2 md:flex">
            <Link
              href="/catalog-ho"
              className="inline-flex min-w-0 items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/85"
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {t("details.catalog.backToCatalogHo")}
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
              <AppBadge showDot variant={catalogStatusVariant[catalog.status]}>
                {getCatalogStatusLabel(catalog.status, t)}
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
              variant={catalogStatusVariant[catalog.status]}
            >
              {getCatalogStatusLabel(catalog.status, t)}
            </AppBadge>
          </div>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
            {t("details.catalog.lastModified", {
              type: catalog.catalogType,
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
                label={t("common.fields.charge")}
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
                className="col-span-2"
                label={t("details.catalog.storeMasterPriceSequence")}
                value={
                  <PrioritySequence
                    className="max-w-none"
                    moreTriggerTooltip={t("details.catalog.morePriorities")}
                    value={catalog.storeMasterAndPriceSequence}
                    variant="badge"
                  />
                }
              />
              {canEdit ? (
                <AppField
                  className="col-span-2"
                  label={t("details.catalog.periodDate")}
                  required
                  error={periodError}
                >
                  <DatePicker
                    mode="range"
                    value={activeDraftPeriodValue ?? periodValue}
                    placeholder={t("details.catalog.selectPeriod")}
                    calendarProps={{
                      disabled: isBeforeToday,
                    }}
                    onChange={(range?: DateRange) => {
                      setDraftPeriodValue({
                        range,
                        periodStart: catalog.periodStart,
                        periodEnd: catalog.periodEnd,
                      });

                      if (!range?.from && !range?.to) {
                        onPeriodChange?.({ start: "", end: "" });
                        return;
                      }

                      if (range?.from && range?.to) {
                        onPeriodChange?.({
                          start: range.from.toISOString(),
                          end: range.to.toISOString(),
                        });
                      }
                    }}
                  />
                </AppField>
              ) : (
                <AppReadOnlyField
                  className="col-span-2"
                  label={t("details.catalog.periodDate")}
                  value={`${catalog.periodStart} - ${catalog.periodEnd}`}
                />
              )}
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

      {showActions ? (
        <div
          className={cn(
            "shrink-0 border-t border-border bg-card px-4 py-3",
            !summaryOpen && "hidden md:block"
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            {showApprove ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  disabled={!isDirty}
                  onClick={onUpdate}
                  className="flex-1"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  {t("details.catalog.update")}
                </Button>
                <Button type="button" onClick={onApprove} className="flex-1">
                  <Check className="h-3.5 w-3.5" />
                  {t("details.catalog.approve")}
                </Button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
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
