export type ReportStatus =
  "Idle" | "Queued" | "Processing" | "Completed" | "Failed";

export type ReportVariant =
  "item" | "itemCustomer" | "storeItem" | "fullStore" | "contractPrice";

export type ReportDownloadAsset<
  TVariant extends ReportVariant = ReportVariant,
> = {
  fileName: string;
  label: string;
  url: string;
  variant: TVariant;
};

export type ReportJob<TVariant extends ReportVariant = ReportVariant> = {
  asset?: ReportDownloadAsset<TVariant>;
  message: string;
  status: ReportStatus;
};
