import { Suspense } from "react";

import { ContractPriceListPage } from "@/features/contract-price/list";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ContractPriceListPage />
    </Suspense>
  );
}
