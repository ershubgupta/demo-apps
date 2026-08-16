import { Suspense } from "react";

import { CatalogHoReportPage } from "@/features/reports/catalog-ho-report";

export default function CatalogHoReportRoute() {
  return (
    <Suspense fallback={null}>
      <CatalogHoReportPage />
    </Suspense>
  );
}
