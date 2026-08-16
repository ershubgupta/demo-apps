import { notFound } from "next/navigation";

import { getCatalogStore } from "@/features/catalog-store/api/service";
import { DetailPage } from "@/features/catalog-store/detail";

type CatalogStoreDetailRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CatalogStoreDetailRoute({
  params,
}: CatalogStoreDetailRouteProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const catalog = await getCatalogStore(decodedId);
  if (!catalog) notFound();

  return <DetailPage id={decodedId} />;
}
