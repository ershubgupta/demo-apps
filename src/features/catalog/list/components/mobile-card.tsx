import Link from "next/link";

import { AppBadge } from "@/components/app-badge";
import type { DataTableMobileCard } from "@/components/data-table/data-table";
import { PrioritySequence } from "@/components/priority-sequence/priority-sequence";
import { RowActions } from "./row-actions";
import {
  catalogStatusVariant,
  getCatalogStatusLabel,
} from "@/features/catalog-ho/config/status-config";
import type { Catalog } from "@/features/catalog-ho/types";
import type { Translate } from "@/i18n/types";
import { CatalogTypeEnum } from "@/types/catalog";
import type { RowAction } from "./row-actions";
import {
  canShowCatalogActions,
  getCatalogDetailHref,
  type CatalogListPageConfig,
} from "../config/page-config";
import { getCatalogTypeLabel } from "../config/filter-types";

export function mobileCard({
  config,
  onAction,
  t = (key) => key,
}: {
  config: CatalogListPageConfig;
  onAction: (catalog: Catalog, action: RowAction) => void;
  t?: Translate;
}): DataTableMobileCard<Catalog> {
  return {
    renderTitle: (catalog) => (
      <Link
        className="truncate underline-offset-4 hover:underline"
        href={getCatalogDetailHref(catalog)}
      >
        {catalog.number}
      </Link>
    ),
    renderActions: (catalog) =>
      canShowCatalogActions(catalog, config) ? (
        <RowActions catalog={catalog} onAction={onAction} />
      ) : null,
    renderStatus: (catalog) => (
      <AppBadge showDot variant={catalogStatusVariant[catalog.status]}>
        {getCatalogStatusLabel(catalog.status, t)}
      </AppBadge>
    ),
    fields: [
      ...(config.showCatalogTypeColumn
        ? [
            {
              label: t("common.fields.catalogType"),
              render: (catalog: Catalog) =>
                getCatalogTypeLabel(catalog.catalogType, t),
            },
          ]
        : []),
      ...(config.showRevisionColumn
        ? [
            {
              label: t("common.fields.revision"),
              render: (catalog: Catalog) =>
                catalog.catalogType === CatalogTypeEnum.CATALOG_STORE
                  ? "-"
                  : catalog.revision,
            },
          ]
        : []),
      {
        label: t("common.fields.charge"),
        render: (catalog) => catalog.charge,
      },
      {
        label: t("common.fields.startEnd"),
        render: (catalog) => `${catalog.startDate} - ${catalog.endDate}`,
      },
      {
        label: t("common.fields.pricePeriod"),
        render: (catalog) =>
          `${catalog.priceStartDate} - ${catalog.priceEndDate}`,
      },
      {
        label: t("common.fields.store"),
        fullWidth: true,
        render: (catalog) => (
          <PrioritySequence
            className="max-w-37.5"
            maxVisibleItems={3}
            value={catalog.store}
            variant="badge"
          />
        ),
      },
    ],
  };
}
