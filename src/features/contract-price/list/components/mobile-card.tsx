import Link from "next/link";

import type { DataTableMobileCard } from "@/components/data-table/data-table";
import type { ContractPrice } from "@/features/contract-price/types";
import type { Translate } from "@/i18n/types";

export function createContractPriceMobileCard(
  t: Translate = (key) => key
): DataTableMobileCard<ContractPrice> {
  return {
    renderTitle: (contractPrice) => (
      <Link
        className="truncate underline-offset-4 hover:underline"
        href={`/contract-price/${encodeURIComponent(contractPrice.number)}`}
      >
        {contractPrice.number}
      </Link>
    ),
    fields: [
      {
        label: t("common.fields.type"),
        render: (contractPrice) => contractPrice.type,
      },
      {
        label: t("common.fields.customer"),
        render: (contractPrice) => contractPrice.customerName,
      },
      {
        label: t("common.fields.item"),
        render: (contractPrice) => contractPrice.itemNo,
      },
      {
        label: t("common.fields.store"),
        render: (contractPrice) => contractPrice.store,
      },
      {
        label: t("common.fields.period"),
        render: (contractPrice) =>
          `${contractPrice.startDate} - ${contractPrice.endDate}`,
      },
      {
        label: t("common.fields.requestedBy"),
        render: (contractPrice) => contractPrice.requestedBy,
      },
    ],
  };
}
