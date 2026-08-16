import { Suspense } from "react";

import { ContractPriceReportPage } from "@/features/reports/contract-price-report";

export default function ContractPriceReportRoute() {
  return (
    <Suspense fallback={null}>
      <ContractPriceReportPage />
    </Suspense>
  );
}
