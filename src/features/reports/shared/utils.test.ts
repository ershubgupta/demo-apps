import { describe, expect, it } from "vitest";

import type { ReportJob } from "./types";
import {
  canGenerateReport,
  formatReportMessage,
  getReportDownloadAsset,
  hasPendingReportJobs,
  reportStatusVariant,
} from "./utils";

const completedJob: ReportJob<"item"> = {
  status: "Completed",
  message: "Done",
  asset: {
    fileName: "item.csv",
    label: "Item",
    url: "data:text/csv,item",
    variant: "item",
  },
};
describe("report helpers", () => {
  it("maps report status to semantic badge variants", () => {
    expect(reportStatusVariant("Completed")).toBe("success");
    expect(reportStatusVariant("Failed")).toBe("danger");
    expect(reportStatusVariant("Queued")).toBe("warning");
    expect(reportStatusVariant("Processing")).toBe("info");
    expect(reportStatusVariant("Idle")).toBe("neutral");
  });
  it("only exposes downloads for completed jobs", () => {
    expect(getReportDownloadAsset(completedJob)?.fileName).toBe("item.csv");
    expect(
      getReportDownloadAsset({ status: "Failed", message: "No data" })
    ).toBeUndefined();
  });
  it("disables generation while a report is pending", () => {
    expect(canGenerateReport(completedJob)).toBe(true);
    expect(
      canGenerateReport({ status: "Processing", message: "Running" })
    ).toBe(false);
    expect(
      hasPendingReportJobs([{ status: "Queued", message: "Waiting" }])
    ).toBe(true);
  });
  it("renders a dash for empty messages", () => {
    expect(formatReportMessage("  ")).toBe("-");
  });
});
