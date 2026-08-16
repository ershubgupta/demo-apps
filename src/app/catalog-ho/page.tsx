import { Suspense } from "react";

import { CatalogListPage } from "@/features/catalog/list";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CatalogListPage />
    </Suspense>
  );
}
