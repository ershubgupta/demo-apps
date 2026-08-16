import { Suspense } from "react";

import { ContractPriceDailyReportPage } from "@/features/reports/contract-price-daily-report";

export default function ContractPriceDailyReportRoute() {
  return (
    <Suspense fallback={null}>
      <ContractPriceDailyReportPage />
    </Suspense>
  );
}
