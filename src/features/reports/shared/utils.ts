import type { AppBadgeVariant } from "@/components/app-badge";
import type { ReportDownloadAsset, ReportJob, ReportStatus } from "./types";

export function reportStatusVariant(status: ReportStatus): AppBadgeVariant {
  switch (status) {
    case "Completed":
      return "success";
    case "Failed":
      return "danger";
    case "Queued":
      return "warning";
    case "Processing":
      return "info";
    case "Idle":
      return "neutral";
  }
}

export function isReportStatusPending(status: ReportStatus): boolean {
  return status === "Queued" || status === "Processing";
}

export function canGenerateReport(job: ReportJob): boolean {
  return !isReportStatusPending(job.status);
}

export function getReportDownloadAsset<TAsset extends ReportDownloadAsset>(
  job: ReportJob
): TAsset | undefined {
  return job.status === "Completed"
    ? (job.asset as TAsset | undefined)
    : undefined;
}

export function hasPendingReportJobs(jobs: ReportJob[]): boolean {
  return jobs.some((job) => isReportStatusPending(job.status));
}

export function formatReportMessage(message: string): string {
  return message.trim() || "-";
}
