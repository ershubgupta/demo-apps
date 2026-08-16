"use client";

import { Download, Info, PlayCircle } from "lucide-react";

import { AppTooltip } from "@/components/app-tooltip";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import type { ReportJob } from "../types";
import {
  canGenerateReport,
  formatReportMessage,
  getReportDownloadAsset,
} from "../utils";
import { ReportStatusBadge } from "./report-status-badge";

export function ReportGenerateButton({
  job,
  label,
  onGenerate,
}: {
  job: ReportJob;
  label?: string;
  onGenerate: () => void;
}) {
  const t = useTranslations();

  return (
    <Button
      disabled={!canGenerateReport(job)}
      onClick={onGenerate}
      size="sm"
      type="button"
      variant="outline"
    >
      <PlayCircle className="h-3.5 w-3.5" />
      {label ?? t("common.actions.generate")}
    </Button>
  );
}

export function ReportStatusMessageCell({
  job,
  label,
}: {
  job: ReportJob;
  label: string;
}) {
  const t = useTranslations();
  return (
    <div className="flex items-center justify-center gap-1.5">
      <ReportStatusBadge status={job.status} />
      <AppTooltip
        content={formatReportMessage(job.message)}
        contentClassName="max-w-80"
        side="left"
        variant="icon"
      >
        <Button
          aria-label={t("reports.common.statusMessageAria", { label })}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <Info className="h-3.5 w-3.5" />
        </Button>
      </AppTooltip>
    </div>
  );
}

export function ReportDownloadCell({ job }: { job: ReportJob }) {
  const t = useTranslations();
  const asset = getReportDownloadAsset(job);
  if (!asset) return <span className="text-muted-foreground">-</span>;
  return (
    <Button
      asChild
      aria-label={t("common.actions.downloadNamed", { label: asset.label })}
      className="text-status-active hover:text-status-active"
      size="icon-sm"
      variant="outline"
    >
      <a download={asset.fileName} href={asset.url}>
        <Download className="h-3.5 w-3.5" />
      </a>
    </Button>
  );
}
