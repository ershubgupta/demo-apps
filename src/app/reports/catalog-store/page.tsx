import { Suspense } from "react";

import { CatalogStoreReportPage } from "@/features/reports/catalog-store-report";

export default function CatalogStoreReportRoute() {
  return (
    <Suspense fallback={null}>
      <CatalogStoreReportPage />
    </Suspense>
  );
}
