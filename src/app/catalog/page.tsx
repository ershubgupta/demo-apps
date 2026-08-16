import { Suspense } from "react";

import { CatalogListPage } from "@/features/catalog/list";
import { catalogListPageConfigs } from "@/features/catalog/list/config/page-config";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CatalogListPage config={catalogListPageConfigs.catalog} />
    </Suspense>
  );
}
