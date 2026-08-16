"use client";

import { Loader2 } from "lucide-react";
import { AppBadge } from "@/components/app-badge";
import type { ReportStatus } from "../types";
import { reportStatusVariant } from "../utils";

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  return (
    <AppBadge showDot variant={reportStatusVariant(status)}>
      <span className="inline-flex items-center gap-1">
        {status === "Processing" ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : null}
        {status}
      </span>
    </AppBadge>
  );
}
